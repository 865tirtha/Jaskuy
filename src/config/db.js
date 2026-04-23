const { Pool } = require('pg');
const dotenv = require('dotenv');

dotenv.config();

// Konfigurasi node-postgres Pool
const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    max: 20, // Set pool max size
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 10000, // Increased to 10 seconds for Cloud DB handshake
    ssl: { rejectUnauthorized: false }
});

pool.on('error', (err, client) => {
    console.error('Unexpected error on idle client', err);
    process.exit(-1);
});

module.exports = {
    // Digunakan untuk single query
    query: (text, params) => pool.query(text, params),
    // Digunakan untuk Transactions (BEGIN, COMMIT, ROLLBACK)
    getClient: () => pool.connect()
};
