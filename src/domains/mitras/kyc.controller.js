const kycService = require('./kyc.service');

exports.uploadKyc = async (req, res, next) => {
    try {
        const mitraId = req.user.id; // From authMiddleware
        const { ktpUrl, selfieUrl } = req.body; // In reality, this might be multipart/form-data with multer

        if (!ktpUrl || !selfieUrl) {
            return res.status(400).json({ success: false, message: 'KTP and Selfie URLs are required.' });
        }

        const data = await kycService.uploadKycDocument(mitraId, ktpUrl, selfieUrl);
        res.status(200).json({ success: true, data });
    } catch (error) {
        next(error);
    }
};
