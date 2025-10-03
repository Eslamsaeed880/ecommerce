import WishList from '../models/wishList.js';
import { validationResult } from 'express-validator';

const postWishList = async (req, res, next) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { name, description } = req.body;
        const userId = req.userId;

        const wishList = new WishList({ name, description, userId, products: [] });
        await wishList.save();

        return res.status(201).json({ message: "Created wishlist successfully", wishList });
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "postWishList", error: err.message });
    }
};

const getWishList = async (req, res, next) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { wishListId } = req.params;
        const userId = req.userId;
        const wishList = await WishList.findOne({ _id: wishListId, userId })
            .populate({
                path: 'products.productId',
                populate: {
                    path: 'userId',
                    select: 'name'
                }
            });

        return res.status(200).json({ message: "Get wishlist successfully", wishList });
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "getWishList", error: err.message });
    }
}

const getWishLists = async (req, res, next) => {
    try {
        const userId = req.userId;
        const wishLists = await WishList.find({ userId }).select('_id name description createdAt');

        return res.status(200).json({ message: "Wishlists got successfully.", wishLists });
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "getWishLists", error: err.message });
    }
}

const postAddProductToWishList = async (req, res, next) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const userId = req.userId;
        const { productId } = req.body;
        let wishList;

        const userWishlists = await WishList.find({ userId }).sort({ createdAt: 1 });

        if (userWishlists.length === 0) {
            wishList = new WishList({ name: 'Default', userId, products: [{ productId }] });
            await wishList.save();
        } else {
            const oldestWishList = userWishlists[0];
            const productExists = oldestWishList.products.some(
                p => p.productId.toString() === productId
            );

            if (!productExists) {
                oldestWishList.products.push({ productId });
                await oldestWishList.save();
            }
            wishList = oldestWishList;
        }

        return res.status(201).json({ message: "Product added to wishlist successfully", wishList });
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "addProductToWishList", error: err.message });
    }
};

const putWishList = async (req, res, next) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { wishListId, newWishListId, productId } = req.body;
        const userId = req.userId;
        
        const wishList = await WishList.findOne({ _id: wishListId, userId });
        const newWishList = await WishList.findOne({ _id: newWishListId, userId });

        wishList.products = wishList.products.filter(
            p => p.productId.toString() !== productId
        );
        await wishList.save();

        const alreadyInNew = newWishList.products.some(
            p => p.productId.toString() === productId
        );
        
        if (!alreadyInNew) {
            newWishList.products.push({ productId });
            await newWishList.save();
        }

        return res.status(200).json({
            message: alreadyInNew
                ? "Product moved, but it was already in the target wishlist."
                : "Product moved to another wishlist successfully.",
            newWishList
        });
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "putWishList", error: err.message });
    }
};

const deleteProductFromWishList = async (req, res, next) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { wishListId } = req.params;
        const { productId } = req.body;
        const userId = req.userId;
        
        const wishList = await WishList.findOne({ _id: wishListId, userId });
        
        wishList.products = wishList.products.filter(
            item => item.productId.toString() !== productId
        );

        await wishList.save();
        return res.status(204).send();
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "deleteProductFromWishList", error: err.message });
    }
}

const deleteWishList = async (req, res, next) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { wishListId } = req.params;
        await WishList.deleteOne({ _id: wishListId });

        return res.status(204).send();
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "deleteWishList", error: err.message });
    }
};

export default {
    getWishList, 
    getWishLists,
    postAddProductToWishList, 
    putWishList, 
    postWishList, 
    deleteProductFromWishList, 
    deleteWishList
};