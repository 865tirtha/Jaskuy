require('dotenv').config();
const db = require('./src/infrastructure/database/db');

async function checkSchema2() {
    try {
        const res = await db.query(`
            SELECT table_name 
            FROM information_schema.tables 
            WHERE table_schema = 'public'
        `);
        console.log("ALL PUBLIC TABLES:");
        res.rows.forEach(r => console.log(r.table_name));

        process.exit(0);
    } catch (e) {
        console.error(e);
        process.exit(1);
    }
}

checkSchema2();
