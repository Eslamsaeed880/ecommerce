import { body, param } from 'express-validator';
import mongoose from 'mongoose';
import WishList from '../models/wishList.js';
import Product from '../models/product.js';

const wishListIdValidator = [
    param('wishListId')
        .isMongoId()
        .withMessage("Invalid wishlist ID format.")
        .custom(async (value, { req }) => {
            const userId = req.userId;
            const wishlist = await WishList.findOne({ _id: value, userId });
            if (!wishlist) {
                throw new Error("Wishlist not found or not authorized.");
            }
            return true;
        })
];

const productIdValidator = body('productId')
    .notEmpty()
    .withMessage("Product ID is required.")
    .isMongoId()
    .withMessage("Invalid product ID format.")
    .custom(async (value) => {
        const product = await Product.findById(value);
        if (!product) {
            throw new Error("Product not found.");
        }
        return true;
    });

export const getWishListValidator = wishListIdValidator;

export const postWishListValidator = [
    body('name')
        .notEmpty()
        .withMessage("Wishlist name is required.")
        .isLength({ min: 1, max: 100 })
        .withMessage("Wishlist name must be between 1-100 characters.")
        .trim()
        .custom(async (value, { req }) => {
            const userId = req.userId;
            const existing = await WishList.findOne({ name: value.trim(), userId });
            if (existing) {
                throw new Error("You already have a wishlist with this name.");
            }
            return true;
        }),
    
    body('description')
        .optional()
        .isLength({ max: 500 })
        .withMessage("Description must not exceed 500 characters.")
        .trim()
];

export const postAddProductToWishListValidator = [
    productIdValidator
];

export const putWishListValidator = [
    body('wishListId')
        .notEmpty()
        .withMessage("Source wishlist ID is required.")
        .isMongoId()
        .withMessage("Invalid source wishlist ID format.")
        .custom(async (value, { req }) => {
            const userId = req.userId;
            const wishlist = await WishList.findOne({ _id: value, userId });
            if (!wishlist) {
                throw new Error("Source wishlist not found or not authorized.");
            }
            return true;
        }),
    
    body('newWishListId')
        .notEmpty()
        .withMessage("Target wishlist ID is required.")
        .isMongoId()
        .withMessage("Invalid target wishlist ID format.")
        .custom(async (value, { req }) => {
            const userId = req.userId;
            const wishlist = await WishList.findOne({ _id: value, userId });
            if (!wishlist) {
                throw new Error("Target wishlist not found or not authorized.");
            }
            
            if (value === req.body.wishListId) {
                throw new Error("Source and target wishlists cannot be the same.");
            }
            
            return true;
        }),
    
    productIdValidator.custom(async (value, { req }) => {
        const wishListId = req.body.wishListId;
        const userId = req.userId;
        
        const wishList = await WishList.findOne({ _id: wishListId, userId });
        if (wishList) {
            const productExists = wishList.products.some(
                p => p.productId.toString() === value
            );
            if (!productExists) {
                throw new Error("Product not found in the source wishlist.");
            }
        }
        return true;
    })
];

export const deleteProductFromWishListValidator = [
    ...wishListIdValidator,
    body('productId')
        .notEmpty()
        .withMessage("Product ID is required.")
        .isMongoId()
        .withMessage("Invalid product ID format.")
        .custom(async (value, { req }) => {
            const wishListId = req.params.wishListId;
            const userId = req.userId;
            
            const wishList = await WishList.findOne({ _id: wishListId, userId });
            if (wishList) {
                const productExists = wishList.products.some(
                    p => p.productId.toString() === value
                );
                if (!productExists) {
                    throw new Error("Product not found in this wishlist.");
                }
            }
            return true;
        })
];

export const deleteWishListValidator = [
    param('wishListId')
        .isMongoId()
        .withMessage("Invalid wishlist ID format.")
        .custom(async (value, { req }) => {
            const userId = req.userId;
            const wishlist = await WishList.findOne({ _id: value, userId });
            if (!wishlist) {
                throw new Error("Wishlist not found or not authorized.");
            }
            
            const userWishlistsCount = await WishList.countDocuments({ userId });
            if (userWishlistsCount === 1 && wishlist.name === 'Default') {
                throw new Error("Cannot delete your only wishlist.");
            }
            
            return true;
        })
];

export const updateWishListValidator = [
    ...wishListIdValidator,
    body('name')
        .optional()
        .isLength({ min: 1, max: 100 })
        .withMessage("Wishlist name must be between 1-100 characters.")
        .trim()
        .custom(async (value, { req }) => {
            if (value) {
                const userId = req.userId;
                const wishListId = req.params.wishListId;
                const existing = await WishList.findOne({ 
                    name: value.trim(), 
                    userId, 
                    _id: { $ne: wishListId } 
                });
                if (existing) {
                    throw new Error("You already have another wishlist with this name.");
                }
            }
            return true;
        }),
    
    body('description')
        .optional()
        .isLength({ max: 500 })
        .withMessage("Description must not exceed 500 characters.")
        .trim()
];