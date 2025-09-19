import express from 'express';

import productController from '../controllers/product.js';

const router = express.Router();

router.get('/', productController.getProducts);

router.get('/product/:productId', productController.getProduct);


export default router;  