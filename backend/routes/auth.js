import express from 'express';
import authController from '../controllers/auth.js';

const router = express.Router();

// router.get('/login', authController.getLogin);

router.post('/login', authController.postLogin);

// router.get('/signup', authController.getSignup);

router.post('/signup', authController.postSignup);

export default router;