import express from 'express';

import cartController from '../controllers/cart.js';    

import isAuth from '../middleware/isAuth.js';

const router = express.Router();

router.post('/cart', isAuth, cartController.addToCart);

router.delete('/cart/:cartId', isAuth, cartController.deleteItemFromCart);

router.put('/cart/:cartId', isAuth, cartController.putUpdateItemFromCart);


export default router;  