import express from 'express';
import orderController from '../controllers/order.js';
import isAuth from '../middleware/isAuth.js';
import { addOrderValidator, getUserOrdersValidator, verifyStripeValidator } from '../validation/orderValidation.js';

const router = express.Router();

router.get('/orders', isAuth, getUserOrdersValidator,orderController.getUserOrders);

router.post('/', isAuth, addOrderValidator, orderController.addOrder);

router.post('/stripe', isAuth, addOrderValidator, orderController.addOrderStripe);

router.get('/verify-stripe', verifyStripeValidator, orderController.verifyStripe);

export default router;