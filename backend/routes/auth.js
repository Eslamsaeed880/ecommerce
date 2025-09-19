import express from 'express';

import authController from '../controllers/auth.js';

import { loginValidation, signupValidation } from '../middleware/authValidation.js';

const router = express.Router();

router.post('/login', loginValidation, authController.postLogin);

router.post('/signup', signupValidation, authController.postSignup);

export default router;