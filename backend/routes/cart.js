import express from 'express';
import cartController from '../controllers/cart.js';    
import isAuth from '../middleware/isAuth.js';
import {
    addToCartValidator, 
    deleteItemFromCartValidator, 
    updateItemFromCartValidator
} from '../validation/cartValidation.js';

const router = express.Router();

router.get('/', isAuth, cartController.getCart);

router.post('/', isAuth, addToCartValidator, cartController.addToCart);

router.delete('/:cartId', isAuth, deleteItemFromCartValidator, cartController.deleteItemFromCart);

router.put('/:cartId', isAuth, updateItemFromCartValidator, cartController.putUpdateItemFromCart);


export default router;  