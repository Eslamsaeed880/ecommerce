import express from 'express';

import productController from '../controllers/product.js';

import isAuth from '../middleware/isAuth.js';

const router = express.Router();

router.get('/', productController.getProducts);

router.get('/product/:productId', productController.getProduct);

// add to cart
router.post('/cart', isAuth, productController.addToCart);

// delete cart
router.delete('/cart/:cartId', isAuth, productController.deleteItemFromCart);

// change quantity
router.put('/cart/:cartId', isAuth, productController.putUpdateItemFromCart);

// add order


export default router;  