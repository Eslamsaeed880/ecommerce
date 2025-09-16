import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import connectDb from './config/mongodb.js';
import connectCloudinary from './config/cloudinary.js';

const app = express();
const port = process.env.PORT || 4000;
connectDb();
connectCloudinary();

app.use(express.json());
app.use(cors());

app.get('/', (req, res) => {
    res.status(200).json({message: 'API is working'});
});

app.listen(port, () => console.log('Server started on port: ' + port));