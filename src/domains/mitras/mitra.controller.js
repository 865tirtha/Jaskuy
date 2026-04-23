const mitraService = require('./mitra.service');

class MitraController {

    // ==========================================
    // CARI MITRA TERDEKAT & AKTIF BERDASARKAN SERVICE
    // ==========================================
    async searchMitras(req, res, next) {
        try {
            const { serviceId, userLon, userLat } = req.query;

            if (!serviceId) {
                return res.status(400).json({ success: false, message: 'serviceId is required' });
            }

            const mitras = await mitraService.findAvailableMitras(
                serviceId,
                parseFloat(userLon),
                parseFloat(userLat)
            );

            res.status(200).json({
                success: true,
                count: mitras.length,
                data: mitras
            });

        } catch (error) {
            next(error);
        }
    }
}

module.exports = new MitraController();
