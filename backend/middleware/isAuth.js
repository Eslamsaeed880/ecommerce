import jwt from 'jsonwebtoken';

const isAuth = async (req, res, next) => {
    try {
        const authHeader = req.get('Authorization');
        if(!authHeader) {
            const error = new Error('Not Authorized.');
            error.statusCode = 401;
            throw error;
        }

        const token = authHeader.split(' ')[1];
        let decodedToken;
        
        try {
            decodedToken = jwt.verify(token, process.env.JWT_SECRET_KEY);
        } catch (err) {
            if(err.name === 'TokenExpiredError') {
                return res.status(401).json({message: 'Session expired. Please login again.'});
            }
            return res.status(401).json({ message: 'Not Authorized.' });
        }
        
        if(!decodedToken) {
            const error = new Error('Not Authorized.');
            error.statusCode = 401;
            throw error;
        }
        
        req.userId = decodedToken.userId;
        next();
        
    } catch (err) {
        err.statusCode = 500;
        throw err;
    }
}

export default isAuth;