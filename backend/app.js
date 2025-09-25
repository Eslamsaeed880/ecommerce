import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import connectDb from './config/mongodb.js';
import connectCloudinary from './config/cloudinary.js';
import authRouter from './routes/auth.js';
import productRouter from './routes/product.js';
import adminRouter from './routes/admin.js';
import cartRouter from './routes/cart.js';
import wishlistRouter from './routes/wishList.js';
import orderRouter from './routes/order.js';
import passport from './middleware/googleAuth.js';
import reviewRouter from './routes/review.js';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';

const app = express();
const port = process.env.PORT || 4000;

connectDb();
connectCloudinary();

app.use(helmet());

app.use(cors({
    origin: ['http://localhost:3000', 'http://localhost:5173'],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true
}));

const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    message: 'Too many requests from this IP, please try again later.'
});

app.use('/api/', limiter);

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({extended: true}))

app.use(passport.initialize());

app.use('/api/auth', authRouter);
app.use('/api/admin', adminRouter);
app.use('/api/cart', cartRouter);
app.use('/api/review', reviewRouter);
app.use('/api/wishlist', wishlistRouter);
app.use('/api/order', orderRouter);
app.use('/api', productRouter);

app.get('/', (req, res) => {
    res.status(200).json({message: 'API is working'});
});

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: 'Something went wrong!' });
});

app.listen(port, () => console.log('Server started on port: ' + port));