import logger from "../utils/logger"

// Check user is logged in
export const requireAuth = (req:any, res:any, next:any) => {
    // If no user is in session
    if(!req.session.userId) {
        logger.warn('Tried to access protected route without login');
        return res.status(401).json({ error: 'You need to log in'});
    }
    next();
};

// module.exports = { requireAuth };