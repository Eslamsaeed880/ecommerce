import express from 'express';
import orderController from '../controllers/order.js';
import isAuth from '../middleware/isAuth.js';

const router = express.Router();


router.get('/orders', isAuth, orderController.getUserOrders);

router.post('/', isAuth, orderController.addOrder);

router.post('/stripe', isAuth, orderController.addOrderStripe);

router.get('/verify-stripe', orderController.verifyStripe);

export default router;