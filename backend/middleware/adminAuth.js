import User from '../models/user.js';

const adminAuth = async (req, res, next) => {
    try {
        if (!req.userId) {
            return res.status(401).json({ message: 'Authentication required.' });
        }

        const user = await User.findById(req.userId);

        if (!user) {
            return res.status(401).json({ message: 'User not found.' });
        }

        if (user.role !== 'admin') {
            return res.status(403).json({ message: 'Admin access required.' });
        }

        req.user = user;
        next();       
    } catch (err) {
        console.error('Admin auth error:', err);
        return res.status(500).json({ message: 'Authorization error.' });
    }
}

export default adminAuth;