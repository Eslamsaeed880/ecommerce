import { body, param } from "express-validator";
import Product from '../models/product.js';
import Review from '../models/review.js';
import User from '../models/user.js';


export const postReviewValidator = [
    body('productId')
        .custom(async (value, {req}) => {
            const product = await Product.findById(value);

            if(!product) {
                throw Error("this product doesn't exist.");
            }
        }),
    body('comment')
        .trim()
        .isLength({min: 5, max: 1000})
        .withMessage("Comment length should be from 5 to 1000"),
    body('rating')
        .isInt({min: 1, max: 5})
        .withMessage("Rating should be from 1 to 5 integer.")
];

export const deleteUserReviewValidator = [
    param('reviewId')
        .custom(async (value, {req}) => {
            const review = await Review.findById(value);

            if(!review) {
                throw new Error("Wrong review.");
            }

            const user = await User.findById(req.userId);

            if(req.userId !== review.userId.toString() && user.role !== 'admin') {
                throw new Error("Not Authorized.")
            }
        })
];

export const getUserReviewsValidator = [
    param('userId')
        .custom(async (value) => {
            const user = await User.findById(value);
            if (!user) {
                throw new Error("User does not exist.");
            }
        })
];

export const getProductReviewsValidator = [
    param('productId')
        .custom(async (value) => {
            const product = await Product.findById(value);
            if (!product) {
                throw new Error("Product does not exist.");
            }
        })
];

export const updateUserReviewValidator = [
    param('reviewId')
        .custom(async (value, {req}) => {
            const review = await Review.findById(value);

            if(!review) {
                throw new Error("Wrong review.");
            }

            const user = await User.findById(req.userId);

            if(req.userId !== review.userId.toString() && user.role !== 'admin') {
                throw new Error("Not Authorized.")
            }
        }),
    body('comment')
        .trim()
        .isLength({min: 5, max: 1000})
        .withMessage("Comment length should be from 5 to 1000"),
    body('rating')
        .isInt({min: 1, max: 5})
        .withMessage("Rating should be from 1 to 5 integer.")
];