import jwt from 'jsonwebtoken';
import User from '../models/user.js';

const adminAuth = async (req, res, next) => {
    try {
        const authHeader = req.get('Authorization');
        if(!authHeader) {
            const error = new Error('Not Authorized.');
            error.statusCode = 400;
            throw error;
        }

        const token = authHeader.split(' ')[1];
        let decodedToken;
        
        decodedToken = jwt.verify(token, process.env.JWT_SECRET_KEY);
        
        if(!decodedToken) {
            const error = new Error('Not Authorized.');
            error.statusCode = 400;
            throw error;
        }
        
        console.log(decodedToken);
        req.userId = decodedToken.userId;

        const user = await User.findById(req.userId);

        if(!user || user.role !== 'admin') {
            const error = new Error('Not Authorized.');
            error.statusCode = 400;
            throw error;
        }

        next();
    } catch (err) {
        err.statusCode = 500;
        throw err;
    }
}

export default adminAuth;