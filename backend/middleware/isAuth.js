import jwt from 'jsonwebtoken';

const isAuth = (req, res, next) => {
    try {
        const authHeader = req.get('Authorization');
        if(!authHeader) {
            const error = new Error('Not Authorized.');
            error.statusCode = 401;
            throw error;
        }

        const token = authHeader.split(' ')[1];
        let decodedToken;
        
        decodedToken = jwt.verify(token, process.env.JWT_SECRET_KEY);
        
        if(!decodedToken) {
            const error = new Error('Not Authorized.');
            error.statusCode = 401;
            throw error;
        }
        
        console.log(decodedToken);
        req.userId = decodedToken.userId;
        next();
    } catch (err) {
        err.statusCode = 500;
        throw err;
    }
}

export default isAuth;