const registrationService = require('./registration.service');

class RegistrationController {

    // ==========================================
    // BAYAR BIAYA PENDAFTARAN (Rp 50.000)
    // ==========================================
    async payRegistrationFee(req, res, next) {
        try {
            const mitraId = req.user.id; // User identity from auth header

            // Kita asumsikan pembayaran (gateway) berhasil dilakukan di sini
            const data = await registrationService.processRegistrationPayment(mitraId);
            res.status(200).json(data);
        } catch (error) {
            // Tangkap pesan Error Lemparan Service
            res.status(400).json({ success: false, message: error.message });
            next(error);
        }
    }
}

module.exports = new RegistrationController();
