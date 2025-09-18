import express from 'express';

import productController from '../controllers/products.js';

import isAuth from '../middleware/isAuth.js';

const router = express.Router();

router.get('/', productController.getProducts);

router.get('/product/:productId', productController.getProduct);

// add to cart

// delete cart

// change quantity

// add order

export default router;  