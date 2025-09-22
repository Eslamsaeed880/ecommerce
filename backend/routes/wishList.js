import express from 'express';
import wishListController from '../controllers/wishList.js';
import isAuth from '../middleware/isAuth.js';

const router = express.Router();

router.get('/:wishListId', isAuth, wishListController.getWishLists);

router.post('/', isAuth, wishListController.postWishList);

router.post('/product', isAuth, wishListController.postAddProductToWishList);

router.put('/', isAuth, wishListController.putWishList);

router.delete('/:wishListId', isAuth, wishListController.deleteWishList)

router.delete('/product/:wishListId', isAuth, wishListController.deleteProductFromWishList);

export default router;