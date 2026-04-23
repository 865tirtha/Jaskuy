/**
 * Regex pintar untuk mendeteksi bypass komunikasi di luar aplikasi
 * Mendeteksi variasi kata WhatsApp, Sosmed, dan Nomor Telepon
 */

const REGEX_PATTERNS = [
    // 1. Deteksi Nomor Handphone dengan variasi penulisan licik
    // Contoh: 0812, kosong lapan, +62, 0 8 1 2, nol delapan
    /(\+?62|0?8)[-\s]?([0-9]{3,4})[-\s]?([0-9]{3,4})[-\s]?([0-9]{3,4})/i,
    /(kosong|nol|o|O)[\s\-\_]*(lapan|delapan|8)[\s\-\_]*(satu|1|2|3|4|5|6|7|8|9|0)/i,

    // 2. Deteksi Ajakan pindah aplikasi (WhatsApp)
    /(wa|w a|wasap|whatsapp|w@|we a)[\s\-\_]*((nomor|no|pindah|chat|hubung|call|telp)[a-z]*)/i,

    // 3. Deteksi Sosial Media
    /(instagram|ig|instgrm|telegram|tele|tioktok|fb|facebook)[a-z\s\-\_]*(@[\w.]+)/i,

    // 4. Deteksi link
    /(https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9]+\.[^\s]{2,}|www\.[a-zA-Z0-9]+\.[^\s]{2,})/i
];

/**
 * Mencocokkan pesan dengan Regex. Jika terdeteksi masalah, return info pelanggaran.
 */
const checkViolation = (message) => {
    for (let i = 0; i < REGEX_PATTERNS.length; i++) {
        const match = message.match(REGEX_PATTERNS[i]);
        if (match) {
            return {
                isViolating: true,
                keywordMatched: match[0],
                patternIndex: i
            };
        }
    }
    return { isViolating: false };
};

module.exports = {
    checkViolation
};
