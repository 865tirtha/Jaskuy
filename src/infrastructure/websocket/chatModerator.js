const jwt = require('jsonwebtoken');
const db = require('../../config/db');
const { checkViolation } = require('../../core/utils/regexModerator');
const penaltyService = require('../../domains/penalties/penalty.service');

const initializeChatModerator = (io) => {

    // Auth Middleware Khusus Socket
    io.use((socket, next) => {
        const token = socket.handshake.auth.token;
        if (!token) return next(new Error('Authentication error'));

        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            socket.user = decoded; // { id, role }
            next();
        } catch (err) {
            next(new Error('Authentication error'));
        }
    });

    io.on('connection', (socket) => {

        // 1. Join Room (Berdasarkan Booking ID)
        socket.on('join_booking_chat', (bookingId) => {
            socket.join(`booking_${bookingId}`);
            console.log(`User ${socket.user.id} joined room booking_${bookingId}`);
        });

        // 2. Event Mengirim Pesan
        socket.on('send_message', async (data) => {
            const { bookingId, message } = data;
            const senderId = socket.user.id;
            const senderRole = socket.user.role; // USER or MITRA

            try {
                // A. Pengecekan AI Regex Moderator
                const violationCheck = checkViolation(message);

                let finalMessage = message;
                let isCensored = false;

                // B. Simpan Pesan ke Database (Censored or Not)
                if (violationCheck.isViolating) {
                    finalMessage = '[Pesan disensor oleh Sistem karena melanggar Aturan Komunikasi Jaskuy]';
                    isCensored = true;
                }

                const chatRes = await db.query(`
                    INSERT INTO chat_messages (booking_id, sender_role, sender_id, message_content, is_censored)
                    VALUES ($1, $2, $3, $4, $5) RETURNING id
                `, [bookingId, senderRole, senderId, finalMessage, isCensored]);

                const chatId = chatRes.rows[0].id;

                // C. EKSEKUSI PENALTI JIKA MELANGGAR
                if (isCensored) {
                    // 1. Simpan Catatan Pelanggaran
                    await db.query(`
                        INSERT INTO regex_violations (chat_id, violator_role, violator_id, violation_keyword)
                        VALUES ($1, $2, $3, $4)
                    `, [chatId, senderRole, senderId, violationCheck.keywordMatched]);

                    // 2. Eksekusi Hukuman Strike 1 / 2 / 3 via Penalty Service
                    const penaltyResult = await penaltyService.executeStrikePenalty(
                        senderRole,
                        senderId,
                        violationCheck.keywordMatched,
                        chatId
                    );

                    // Beri notifikasi Push ke pelanggar via Socket
                    socket.emit('system_alert', {
                        message: `PERINGATAN! Anda telah melanggar aturan Chat. Strike anda sekarang: ${penaltyResult.strike_count}. Status: ${penaltyResult.action_taken}`,
                        disconnect: penaltyResult.strike_count >= 3 // Tell client to GTFO if banned
                    });

                    // Jika akun dibanned/didisable, force disconnect websocketnya
                    if (penaltyResult.strike_count >= 1) {
                        socket.disconnect();
                        return; // Stop transmitting message
                    }
                }

                // D. Broadcast Final Message ke Lawan Bicara di Room
                io.to(`booking_${bookingId}`).emit('receive_message', {
                    chatId,
                    senderId,
                    senderRole,
                    message: finalMessage,
                    isSystemWarning: isCensored,
                    createdAt: new Date()
                });

            } catch (error) {
                console.error('[Socket.IO] Error handling chat message:', error);
                socket.emit('error', 'Gagal memproses pesan');
            }
        });
    });
};

module.exports = initializeChatModerator;
