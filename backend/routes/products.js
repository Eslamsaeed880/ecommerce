import express from 'express';
import productController from '../controllers/products.js';
import isAuth from '../middleware/isAuth.js';
import upload from '../middleware/multer.js';

const router = express.Router();

router.get('/products', productController.getProducts);

router.post(
    '/add-product', 
    isAuth,
    upload.fields(
        [
            {
                name: "image1", 
                maxCount: 1
            },
            {
                name: "image2", 
                maxCount: 1
            },
            {
                name: "image3", 
                maxCount: 1
            },
            {
                name: "image4", 
                maxCount: 1
            }
        ]
    ), 
    productController.postAddProduct
);

router.get('/product/:productId', isAuth,productController.getProduct);

router.delete('/product/:productId', isAuth, productController.deleteProduct);

router.put('/product/:productId', isAuth, productController.putUpdateProduct);

export default router;