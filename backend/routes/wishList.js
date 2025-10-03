import express from 'express';
import wishListController from '../controllers/wishList.js';
import isAuth from '../middleware/isAuth.js';
import {
    getWishListValidator,
    postWishListValidator,
    postAddProductToWishListValidator,
    putWishListValidator,
    deleteProductFromWishListValidator,
    deleteWishListValidator
} from '../validation/wishListValidation.js';

const router = express.Router();

router.get('/:wishListId', isAuth, getWishListValidator, wishListController.getWishList);

router.get('/', isAuth, wishListController.getWishLists);

router.post('/', isAuth, postWishListValidator, wishListController.postWishList);

router.post('/product', isAuth, postAddProductToWishListValidator, wishListController.postAddProductToWishList);

router.put('/', isAuth, putWishListValidator, wishListController.putWishList);

router.delete('/:wishListId', isAuth, deleteWishListValidator, wishListController.deleteWishList);

router.delete('/product/:wishListId', isAuth, deleteProductFromWishListValidator, wishListController.deleteProductFromWishList);

export default router;