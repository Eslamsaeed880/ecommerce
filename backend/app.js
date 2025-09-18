import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import connectDb from './config/mongodb.js';
import connectCloudinary from './config/cloudinary.js';
import authRouter from './routes/auth.js';
import productRouter from './routes/product.js';
import adminRouter from './routes/admin.js';

const app = express();
const port = process.env.PORT || 4000;
connectDb();
connectCloudinary();

// app.use(express.json());
app.use(cors());
app.use(async (req, res, next) => {
    res.setHeader('Authorization', 'Content-Type');
    next();
});

app.use('/auth', express.json(),authRouter);
app.use('/admin', adminRouter)
app.use(express.json(), productRouter);

app.get('/', (req, res) => {
    res.status(200).json({message: 'API is working'});
});

app.listen(port, () => console.log('Server started on port: ' + port));