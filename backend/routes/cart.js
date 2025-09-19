import express from 'express';

import cartController from '../controllers/cart.js';    

import isAuth from '../middleware/isAuth.js';

const router = express.Router();

router.get('/', isAuth, cartController.getCart);

router.post('/', isAuth, cartController.addToCart);

router.delete('/:cartId', isAuth, cartController.deleteItemFromCart);

router.put('/:cartId', isAuth, cartController.putUpdateItemFromCart);


export default router;  