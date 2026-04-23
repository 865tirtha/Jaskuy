const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ success: false, message: 'Unauthorized: Missing or invalid token' });
        }

        const token = authHeader.split(' ')[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Simpan data decoded ke req.user ({ id, role })
        req.user = decoded;
        next();
    } catch (error) {
        return res.status(401).json({ success: false, message: 'Unauthorized: Token expired or invalid' });
    }
};

const roleMiddleware = (allowedRoles) => {
    return (req, res, next) => {
        if (!req.user || !allowedRoles.includes(req.user.role)) {
            return res.status(403).json({ success: false, message: 'Forbidden: You do not have the required permissions' });
        }
        next();
    };
};

module.exports = {
    authMiddleware,
    roleMiddleware
};
