const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const db = require('../../infrastructure/database/db');

class AuthService {
    async register(data, role) {
        const { name, phone, email, password, nik, dob } = data;
        const tableName = role === 'MITRA' ? 'mitras' : 'users';

        const client = await db.getClient();
        try {
            await client.query('BEGIN');

            const existing = await client.query(`SELECT id FROM ${tableName} WHERE email = $1 OR phone = $2`, [email, phone]);
            if (existing.rowCount > 0) throw new Error('Email or phone already registered');

            const salt = await bcrypt.genSalt(10);
            const hash = await bcrypt.hash(password, salt);

            let insertQuery;
            let params;

            if (role === 'MITRA') {
                if (!nik || !dob) throw new Error('NIK and Date of Birth are required for Mitra');

                // Check if NIK is blacklisted
                const blacklistCheck = await client.query('SELECT nik FROM blacklisted_niks WHERE nik = $1', [nik]);
                if (blacklistCheck.rowCount > 0) throw new Error('This NIK has been blacklisted due to severe violations.');

                insertQuery = `
                    INSERT INTO mitras (name, phone, email, password_hash, nik, dob, is_kyc_verified, status)
                    VALUES ($1, $2, $3, $4, $5, $6, FALSE, 'ACTIVE') RETURNING id, email
                `;
                params = [name, phone, email, hash, nik, dob];
            } else {
                insertQuery = `
                    INSERT INTO users (name, phone, email, password_hash, status)
                    VALUES ($1, $2, $3, $4, 'ACTIVE') RETURNING id, email
                `;
                params = [name, phone, email, hash];
            }

            const result = await client.query(insertQuery, params);
            await client.query('COMMIT');

            return result.rows[0];
        } catch (e) {
            await client.query('ROLLBACK');
            throw e;
        } finally {
            client.release();
        }
    }

    async login(email, password, role) {
        const tableName = role === 'MITRA' ? 'mitras' : 'users';

        const result = await db.query(`SELECT id, password_hash, status FROM ${tableName} WHERE email = $1`, [email]);
        if (result.rowCount === 0) throw new Error('Invalid credentials');

        const user = result.rows[0];

        // Ensure user is not banned or disabled
        if (user.status !== 'ACTIVE') {
            throw new Error(`Account is currently ${user.status}`);
        }

        const validPassword = await bcrypt.compare(password, user.password_hash);
        if (!validPassword) throw new Error('Invalid credentials');

        const token = jwt.sign(
            { id: user.id, role },
            process.env.JWT_SECRET,
            { expiresIn: '30d' }
        );

        return { token, user: { id: user.id, role } };
    }
}

module.exports = new AuthService();
