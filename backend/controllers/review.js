import { validationResult } from 'express-validator';
import Review from '../models/review.js';

const getProductReviews = async (req, res, next) => {
    try {
        const errs = validationResult(req);
        if(!errs.isEmpty()) {
            return res.status(400).json({errors: errs.array()});
        }

        const {productId} = req.params;
        const page = +req.query.page || 1;
        const limit = +req.query.limit || 12;
        const skip = (page - 1) * limit;

        const reviews = await Review.find({productId})
            .sort({createdAt: -1})
            .skip(skip)
            .limit(limit)
            .populate('userId', 'name');

        const total = await Review.countDocuments({productId});
    
        return res.status(200).json({
            message: "Reviews got successfully.", 
            reviews,
            pagination: {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit)
            }
        });

    } catch (err) {
        res.status(500).json({message: "getProductReviews", error: err.message}); // Fixed typo
    }
}

const postReview = async (req, res, next) => {
    try {
        const errs = validationResult(req);

        if(!errs.isEmpty()) {
            return res.status(400).json({errors: errs.array()});
        }

        const {productId, comment, rating} = req.body;
        const userId = req.userId;
        const review = new Review({productId, comment, rating, comment, userId});
        await review.save();

        return res.status(200).json({message: "review posted successfully"});

    } catch (err) {
        res.status(500).json({message: "postReview", errror: err.message});
    }
}

const getUserReviews = async (req, res, next) => {
    try {
        const errs = validationResult(req);

        if(!errs.isEmpty()) {
            return res.status(400).json({errors: errs.array()});
        }

        const {userId} = req.params;
        const reviews = await Review.find({userId}).sort({ createdAt: -1 }).populate('productId', 'title');

        return res.status(200).json({message: "Reviews got successfully.", reviews});

    } catch (err) {
        res.status(500).json({message: "getUserReviews", errror: err.message});
    }
}

const deleteUserReview = async (req, res, next) => {
    try {
        const errs = validationResult(req);

        if(!errs.isEmpty()) {
            return res.status(400).json({errors: errs.array()});
        }

        const {reviewId} = req.params;
        const review = await Review.findById(reviewId);
        await Review.deleteOne(review);

        return res.status(200).json({message: "Review deleted successfully"});

    } catch (err) {
        res.status(500).json({message: "deleteUserReview", errror: err.message});
    }
}

const updateUserReview = async (req, res, next) => {
    try {
        const errs = validationResult(req);

        if(!errs.isEmpty()) {
            return res.status(400).json({errors: errs.array()});
        }

        const {comment, rating} = req.body;
        const {reviewId} = req.params;
        const review = await Review.findById(reviewId);
        await Review.updateOne(review, {comment, rating});

        return res.status(200).json({message: "Review updated successfully"});

    } catch (err) {
        res.status(500).json({message: "updateUserReview", errror: err.message});
    }
}

export default {
    getProductReviews, 
    getUserReviews, 
    postReview, 
    deleteUserReview, 
    updateUserReview
};