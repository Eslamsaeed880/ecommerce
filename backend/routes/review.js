import express from 'express';
import reviewController from '../controllers/review.js';
import isAuth from '../middleware/isAuth.js';
import { 
    postReviewValidator, 
    deleteUserReviewValidator, 
    getUserReviewsValidator, 
    getProductReviewsValidator, 
    updateUserReviewValidator 
} from '../validation/reviewValidation.js';

const router = express.Router();

router.post('/', isAuth, postReviewValidator, reviewController.postReview);

router.put('/:reviewId', isAuth, updateUserReviewValidator,reviewController.updateUserReview);

router.delete('/:reviewId', isAuth, deleteUserReviewValidator, reviewController.deleteUserReview);

router.get('/product/:productId', getProductReviewsValidator, reviewController.getProductReviews);

router.get('/user/:userId', getUserReviewsValidator, reviewController.getUserReviews);

export default router;