import express from 'express';
import adminAuth from '../middleware/adminAuth.js';
import adminController from '../controllers/admin.js';
import upload from '../middleware/multer.js';
import isAuth from '../middleware/isAuth.js';
import { 
    getProductsValidator,
    addProductValidator,
    updateProductValidator,
    getProductValidator,
    deleteProductValidator,
    getOrdersValidator,
    updateOrderStatusValidator
} from '../validation/adminValidation.js';

const router = express.Router();

router.post(
    '/product', 
    isAuth,
    adminAuth,
    upload.fields([
        {name: "image1", maxCount: 1},
        {name: "image2", maxCount: 1},
        {name: "image3", maxCount: 1},
        {name: "image4", maxCount: 1}
    ]),
    addProductValidator,
    adminController.postAddProduct
);

router.put(
  '/product/:productId',
  isAuth,
  adminAuth,
  upload.fields([
    { name: "image1", maxCount: 1 },
    { name: "image2", maxCount: 1 },
    { name: "image3", maxCount: 1 },
    { name: "image4", maxCount: 1 }
  ]),
  updateProductValidator,
  adminController.putUpdateProduct
);

router.get('/product/:productId', isAuth, adminAuth, getProductValidator, adminController.getProduct);

router.delete('/product/:productId', isAuth, adminAuth, deleteProductValidator, adminController.deleteProduct);

router.get('/', isAuth, adminAuth, getProductsValidator, adminController.getMyProducts);

router.get('/products', isAuth, adminAuth, getProductsValidator, adminController.getAllProducts);

router.get('/wishlists', isAuth, adminAuth, adminController.getWishLists);

router.get('/orders', isAuth, adminAuth, getOrdersValidator, adminController.getOrders);

router.put('/order/status/:orderId', isAuth, adminAuth, updateOrderStatusValidator, adminController.updateOrderStatus);

export default router;