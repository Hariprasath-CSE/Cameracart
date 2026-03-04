const jwt = require('jsonwebtoken');
const User = require('../models/User');

const protect = async (req, res, next) => {
    let token;

    console.log('🔐 Auth Middleware - Headers:', req.headers.authorization ? 'Present' : 'Missing');

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            // Get token from header
            token = req.headers.authorization.split(' ')[1];
            // treat literal strings 'null' or 'undefined' as missing
            if (!token || token === 'null' || token === 'undefined') {
                throw new Error('No valid token provided');
            }
            console.log('🔑 Token extracted:', token ? token.substring(0, 20) + '...' : 'No token');

            // Verify token
            const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret');
            console.log('✅ Token verified successfully. User ID:', decoded.id);

            // Get user from the token
            req.user = await User.findById(decoded.id).select('-password');

            if (!req.user) {
                console.error('❌ User not found for token. User ID from token:', decoded.id);
                return res.status(401).json({
                    success: false,
                    message: 'Not authorized, user not found'
                });
            }

            console.log('✅ User found:', req.user.name, '- ID:', req.user._id);
            return next();
        } catch (error) {
            console.error('❌ Token verification error:', error.message);
            console.error('Error details:', error);
            return res.status(401).json({
                success: false,
                message: 'Not authorized, token failed',
                error: error.message
            });
        }
    } else {
        console.error('❌ No authorization header or invalid format');
        return res.status(401).json({
            success: false,
            message: 'Not authorized, no token'
        });
    }
};

// Admin only middleware
const adminOnly = (req, res, next) => {
    if (req.user && req.user.role === 'admin') {
        next();
    } else {
        res.status(403).json({
            success: false,
            message: 'Access denied. Admin privileges required.'
        });
    }
};

module.exports = { protect, adminOnly };
