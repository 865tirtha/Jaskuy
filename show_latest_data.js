require('dotenv').config();
const db = require('./src/infrastructure/database/db');

async function showLatestData() {
    try {
        console.log("=== DATA TERAKHIR DARI DATABASE ===");

        // Latest Users
        const users = await db.query(`SELECT id, email, role, created_at, phone FROM users ORDER BY created_at DESC LIMIT 3`);
        console.log("\n[Users Terbaru]:");
        console.log(JSON.stringify(users.rows, null, 2));

        // Latest Mitras
        const mitras = await db.query(`SELECT id, user_id, status, type, display_name, created_at FROM mitras ORDER BY created_at DESC LIMIT 3`);
        console.log("\n[Mitra Terbaru]:");
        console.log(JSON.stringify(mitras.rows, null, 2));

        // Latest Sales
        const sales = await db.query(`SELECT id, user_id, referral_code, current_commission, total_earned, created_at FROM sales_agents ORDER BY created_at DESC LIMIT 3`);
        console.log("\n[Sales Terbaru]:");
        console.log(JSON.stringify(sales.rows, null, 2));

        process.exit(0);
    } catch (e) {
        console.error("Error fetching data:", e.message);
        process.exit(1);
    }
}

showLatestData();
