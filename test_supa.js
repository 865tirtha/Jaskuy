const { Pool } = require('pg');
const dotenv = require('dotenv');
dotenv.config();

console.log("Database URL:", process.env.DATABASE_URL);

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
});

async function testConnection() {
    try {
        const client = await pool.connect();
        console.log("Successfully connected to Supabase!");
        const res = await client.query('SELECT * FROM sales_agents LIMIT 1');
        console.log("Sales Agents Table Exists! Rows:", res.rows.length);
        client.release();
    } catch (err) {
        console.error("Connection error explicitly:", err);
    } finally {
        pool.end();
    }
}

testConnection();
