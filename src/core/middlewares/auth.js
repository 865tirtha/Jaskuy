const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ success: false, message: 'No token provided. Unauthorized.' });
        }

        const token = authHeader.split(' ')[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        req.user = decoded; // { id, role }
        next();
    } catch (error) {
        return res.status(403).json({ success: false, message: 'Invalid or expired token.' });
    }
};

const roleMiddleware = (allowedRoles) => {
    return (req, res, next) => {
        if (!req.user || !allowedRoles.includes(req.user.role)) {
            return res.status(403).json({
                success: false,
                message: `Forbidden. Only ${allowedRoles.join(' or ')} can access this route.`
            });
        }
        next();
    };
};

module.exports = { authMiddleware, roleMiddleware };
