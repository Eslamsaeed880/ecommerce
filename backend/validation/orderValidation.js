import { body, query } from 'express-validator';
import User from '../models/user.js';
import mongoose from 'mongoose';

function getOutOfStockItems(cart) {
    return cart.filter(item => {
        const stock = +item.productId.stock;
        const quantity = +item.quantity;
        return quantity > stock;
    });
}

export const addOrderValidator = [
    body('address')
        .notEmpty()
        .withMessage("Address is required.")
        .isLength({ min: 10, max: 500 })
        .withMessage("Address must be between 10-500 characters.")
        .trim()
        .custom(async (value, { req }) => {
            const userId = req.userId;
            
            const user = await User.findById(userId).populate('cart.productId');
            if (!user) {
                throw new Error("User not found.");
            }

            const cart = user.cart;

            if (!cart || cart.length === 0) {
                throw new Error("Cart is empty.");
            }

            for (const item of cart) {
                if (!item.productId || !item.productId._id) {
                    throw new Error("Invalid product in cart.");
                }

                if (!item.quantity || Number(item.quantity) <= 0) {
                    throw new Error("Invalid quantity in cart.");
                }
            }

            const outOfStockItems = getOutOfStockItems(cart);
            if (outOfStockItems.length > 0) {
                const itemDetails = outOfStockItems.map(item => 
                    `${item.productId.title} (requested: ${item.quantity}, available: ${item.productId.stock})`
                ).join(', ');
                throw new Error(`Out of stock items: ${itemDetails}`);
            }

            const invalidProducts = cart.filter(item => 
                !item.productId || 
                item.productId.isDeleted === true
            );

            if (invalidProducts.length > 0) {
                throw new Error("Some products in cart are no longer available.");
            }

            return true;
        })
];

export const getUserOrdersValidator = [
    query('page')
        .optional()
        .isInt({ min: 1 })
        .withMessage("Page must be a positive integer."),
    
    query('limit')
        .optional()
        .isInt({ min: 1, max: 100 })
        .withMessage("Limit must be between 1-100."),

    query('status')
        .optional()
        .isString()
        .trim()
];

export const verifyStripeValidator = [
    query('orderId')
        .notEmpty()
        .withMessage("Order ID is required.")
        .custom((value) => {
            if (!mongoose.Types.ObjectId.isValid(value)) {
                throw new Error("Invalid order ID format.");
            }
            return true;
        }),
    
    query('success')
        .notEmpty()
        .withMessage("Success parameter is required.")
        .isIn(['true', 'false'])
        .withMessage("Success must be 'true' or 'false'.")
];