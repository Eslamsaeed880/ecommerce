import { body, param } from 'express-validator';
import User from '../models/user.js'

export const addToCartValidator = [
    body('productId')
        .custom(async (value, {req}) => {
            if(!value) {
                throw new Error("Product ID is required in request body.")
            }
            const user = await User.findById(req.userId);

            if(!user) {
                throw new Error("Not Authorized.");
            }
        })
];

export const deleteItemFromCartValidator = [
    param('cartId')
        .custom(async (value, {req}) => {
            const user = await User.findById(req.userId);

            const cart = user.cart || [];

            if(cart.length === 0 || !cart.some(item => item._id.toString() === value)) {
                throw new Error("This cart item doesn't exist.");
            }
        })
];

export const updateItemFromCartValidator = [
    param('cartId')
        .custom(async (value, {req}) => {
            const user = await User.findById(req.userId);

            const cart = user.cart || [];

            if(cart.length === 0 || !cart.some(item => item._id.toString() === value)) {
                throw new Error("This cart item doesn't exist.");
            }
        }),
    body('quantity')
        .isInt({ min: 1})
        .withMessage("Quantity must be positive integer.")
];