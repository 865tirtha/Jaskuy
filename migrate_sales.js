const { Pool } = require('pg');
const pool = new Pool({
    user: 'postgres',
    host: '127.0.0.1',
    database: 'jaskuy',
    password: 'postgres',
    port: 5432,
});

async function migrateSales() {
    try {
        await pool.query(`ALTER TABLE sales_agents ADD COLUMN IF NOT EXISTS email VARCHAR(150) UNIQUE`);
        await pool.query(`ALTER TABLE sales_agents ADD COLUMN IF NOT EXISTS password_hash VARCHAR(255)`);
        console.log('Successfully altered sales_agents table on IPv4.');
    } catch (err) {
        console.error(err);
    } finally {
        process.exit(0);
    }
}

migrateSales();
