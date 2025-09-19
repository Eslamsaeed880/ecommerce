import express from 'express';

import productController from '../controllers/product.js';

import { getProductValidator } from '../middleware/productValidation.js';

const router = express.Router();

router.get('/', productController.getProducts);

router.get('/product/:productId', getProductValidator, productController.getProduct);


export default router;  