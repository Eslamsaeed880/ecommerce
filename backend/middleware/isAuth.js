import jwt from 'jsonwebtoken';
import User from '../models/user.js';

const isAuth = async (req, res, next) => {
    try {
        const authHeader = req.get('Authorization');
        if(!authHeader) {
            return res.status(401).json({ message: 'Not Authorized.' });
        }

        const token = authHeader.split(' ')[1];
        if(!token) {
            return res.status(401).json({ message: 'Not Authorized.' });
        }

        let decodedToken;
        
        try {
            decodedToken = jwt.verify(token, process.env.JWT_SECRET_KEY);
        } catch (err) {
            if(err.name === 'TokenExpiredError') {
                return res.status(401).json({message: 'Session expired. Please login again.'});
            }
            return res.status(401).json({ message: 'Not Authorized.' });
        }
        
        if(!decodedToken || !decodedToken.userId) {
            return res.status(401).json({ message: 'Not Authorized.' });
        }

        const userExists = await User.findById(decodedToken.userId);
        if (!userExists) {
            return res.status(401).json({ message: 'User not found. Please login again.' });
        }
        
        req.userId = decodedToken.userId;
        next();
        
    } catch (err) {
        console.error('Auth error:', err);
        return res.status(500).json({ message: 'Authentication error.' });
    }
}

export default isAuth;