require('dotenv').config();
const db = require('./src/infrastructure/database/db');

async function checkSchema() {
    try {
        const res = await db.query(`
            SELECT table_name 
            FROM information_schema.tables 
            WHERE table_schema = 'public'
        `);
        console.log("TABLES IN DATABASE:");
        res.rows.forEach(r => console.log(r.table_name));

        const users = await db.query(`SELECT column_name, data_type FROM information_schema.columns WHERE table_name = 'users'`);
        console.log("\nUSERS TABLE COLUMNS:");
        users.rows.forEach(r => console.log(r.column_name, r.data_type));

        const sales = await db.query(`SELECT column_name, data_type FROM information_schema.columns WHERE table_name = 'sales_agents'`);
        console.log("\nSALES_AGENTS TABLE COLUMNS:");
        sales.rows.forEach(r => console.log(r.column_name, r.data_type));

        process.exit(0);
    } catch (e) {
        console.error(e);
        process.exit(1);
    }
}

checkSchema();
