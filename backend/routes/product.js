import express from 'express';

import productController from '../controllers/product.js';

import isAuth from '../middleware/isAuth.js';

const router = express.Router();

router.get('/', productController.getProducts);

router.get('/product/:productId', productController.getProduct);

// add to cart
router.post('/cart', isAuth, productController.addToCart);

// delete cart

// change quantity

// add order

export default router;  