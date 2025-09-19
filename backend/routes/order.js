import express from 'express';

import orderController from '../controllers/order.js';

import adminAuth from '../middleware/adminAuth.js';

import isAuth from '../middleware/isAuth.js';

const router = express.Router();

router.get('/admin/orders', adminAuth, orderController.getOrders);

router.get('/orders', isAuth, orderController.getUserOrders);

router.post('/order', isAuth, orderController.addOrder);

router.post('/order-stripe', isAuth, orderController.addOrderStripe);

router.get('/verify', orderController.verifyStripe)

router.put('/admin/status/:orderId', adminAuth, orderController.updateOrderStatus);

export default router;