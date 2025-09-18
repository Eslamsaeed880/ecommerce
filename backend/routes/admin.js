import express from 'express';

import adminAuth from '../middleware/adminAuth.js';

import adminController from '../controllers/admin.js';

import productRoutes from './product.js'

import upload from '../middleware/multer.js';


const router = express.Router();

router.post(
    '/product', 
    adminAuth,
    upload.fields([
        {name: "image1", maxCount: 1},
        {name: "image2", maxCount: 1},
        {name: "image3", maxCount: 1},
        {name: "image4", maxCount: 1}
    ]), 
    adminController.postAddProduct
);

router.delete('/product/:productId', adminAuth, adminController.deleteProduct);

router.put(
  '/product/:productId',
  adminAuth,
  upload.fields([
    { name: "image1", maxCount: 1 },
    { name: "image2", maxCount: 1 },
    { name: "image3", maxCount: 1 },
    { name: "image4", maxCount: 1 }
  ]),
  adminController.putUpdateProduct
);

router.get('/product/:productId', adminAuth, adminController.getProduct);

router.get('/', adminAuth, adminController.getProducts);

// router.use('/', productRoutes);

export default router;