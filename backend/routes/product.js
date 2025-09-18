import express from 'express';

import productController from '../controllers/product.js';

import isAuth from '../middleware/isAuth.js';

const router = express.Router();

router.get('/', productController.getProducts);

router.get('/product/:productId', productController.getProduct);

// add order

// delete item from order

// update item from order

// payment process


export default router;  