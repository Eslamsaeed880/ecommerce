import { body } from 'express-validator';
import User from '../models/user.js';
import bcrypt from 'bcrypt';

export const loginValidation = [
    body('email')
        .normalizeEmail()
        .custom(async (value) => {
            const user = await User.findOne({ email: value });
            if (!user) {
                throw new Error("Invalid user.");
            }
        }),
    body('password')
        .custom(async (value, { req }) => {
            const user = await User.findOne({ email: req.body.email });
            if (!user) {
                throw new Error("Invalid user.");
            }
            const match = await bcrypt.compare(value, user.password);
            if (!match) {
                throw new Error("Invalid user.");
            }
        })  
];

export const signupValidation = [
    body('firstName').isLength({ min: 2 }).isAlpha(),
    body('lastName').isLength({ min: 2 }).isAlpha(),
    body('email')
        .isEmail().withMessage("Invalid Email.")
        .custom(async (value) => {
            const user = await User.findOne({ email: value });
            if (user) throw new Error("Email already exists.");
        }),
    body('password')
        .trim()
        .isAlphanumeric()
        .isLength({ min: 6 })
        .withMessage("The password has to be alpha numeric and more than 5 characters.")
];