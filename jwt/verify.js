const jwt = require('jsonwebtoken');
const verifyToken = (req, res, next) => {
    const token = req.header('X-Token');
    if (!token) return res.status(401).json({ message: 'No token provided', error: true })
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded.user;
        next();
    } catch (error) {
        if(error.name === 'TokenExpiredError') return res.status(401).json({ message: 'Token expired', error: true })
        res.status(401).json({ message: 'Invalid token', error: true })
    }
}

module.exports = verifyToken