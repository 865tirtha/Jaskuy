const db = require('../../config/db');

class MitraService {
    /**
     * Cari mitra relevan untuk order terbaru (Geofencing Dinamis 5-10-15KM & Priority Ads V4)
     */
    async findAvailableMitras(serviceId, userLon, userLat) {
        const serviceRes = await db.query('SELECT category FROM services WHERE id = $1', [serviceId]);
        if (serviceRes.rowCount === 0) throw new Error('Service not found');
        const category = serviceRes.rows[0].category;

        let searchRadius = 5000; // Mulai dari 5KM
        let finalResult = [];

        // Jika kategori DIGITAL, bypass radius loop.
        const maxRadiusLoops = category === 'PHYSICAL' ? 3 : 1;

        for (let i = 0; i < maxRadiusLoops; i++) {
            let queryText = `
          SELECT m.id, m.name, m.rating_avg, m.badge_tier, ms.base_price, 
                 pa.ad_rank, COALESCE(pa.visibility_score, 0) as ad_score,
                 pa.id as priority_ad_id,
                 ST_Distance(m.current_location, ST_SetSRID(ST_MakePoint($2, $3), 4326)) as distance_meters
          FROM mitras m
          JOIN mitra_services ms ON m.id = ms.mitra_id
          -- JOIN Priority Ads untuk mencari yang aktif
          LEFT JOIN mitra_priority_ads pa ON m.id = pa.mitra_id AND pa.is_active = TRUE
          WHERE ms.service_id = $1 AND m.status = 'ACTIVE' AND m.registration_paid = TRUE
        `;
            const params = [serviceId];

            // LOGIKA KATEGORI SLOT & LOKASI
            if (category === 'PHYSICAL') {
                if (!userLon || !userLat) throw new Error('Location (userLon, userLat) is required for Physical Services');
                queryText += ` AND m.work_status = 'AVAILABLE'`; // 1 Slot Only
                queryText += ` AND ST_DWithin(m.current_location, ST_SetSRID(ST_MakePoint($2, $3), 4326), ${searchRadius})`;
                params.push(userLon, userLat);
            } else {
                // DIGITAL: Multitasking N-slots, Bypass Location
                queryText += ` AND m.active_working_slots < m.max_concurrent_slots`;
                queryText = queryText.replace('ST_Distance(m.current_location, ST_SetSRID(ST_MakePoint($2, $3), 4326)) as distance_meters', '0 as distance_meters');
                queryText = queryText.replace('ST_SetSRID(ST_MakePoint($2, $3), 4326)', 'NULL');
            }

            // V4: SORTING SUPER BERLAPIS
            queryText += ` 
            ORDER BY 
              CASE WHEN pa.ad_rank = 'RANK_1_NEWBIE' THEN 1
                   WHEN pa.ad_rank = 'RANK_2_RECOVERY' THEN 2
                   ELSE 3 END ASC,
              ad_score DESC, 
              m.rating_avg DESC 
            LIMIT 20
        `;

            const result = await db.query(queryText, params);

            if (result.rowCount > 0 || category === 'DIGITAL') {
                finalResult = result.rows.map(row => ({
                    ...row,
                    is_out_of_range: category === 'PHYSICAL' && searchRadius > 5000,
                    out_of_range_fee: category === 'PHYSICAL' && searchRadius > 5000 ? 15000 : 0,
                    search_radius_km: searchRadius / 1000
                }));
                break; // Hentikan fallback loop jika sudah ketemu
            }

            // Jika kosong di 5KM, loop akan berlanjut ke 10KM (Radius + 5000)
            searchRadius += 5000;
            if (searchRadius > 15000) break; // Berhenti total setelah 15KM pencarian (Loop 3x)
        }

        return finalResult;
    }
}

module.exports = new MitraService();
