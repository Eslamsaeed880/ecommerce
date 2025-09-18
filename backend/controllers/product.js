import Product  from '../models/product.js';

import User from '../models/user.js';

const getProducts = async (req, res, next) => {
    try {
        const products = await Product.find();

        return res.status(200).json({products});

    } catch (err) {
        console.log(err);
        res.status(500).json({message: 'getProducts:', err});
    }
}

const getProduct = async (req, res, next) => {
    try {
        const productId = req.params.productId;
        const product = await Product.findById(productId);

        if(!product) {
            return res.status(400).json({ message: 'There is no product.' });
        }

        res.status(200).json({message: "Open product page successfully.", product});

    } catch (err) {
        console.log(err);
        res.status(500).json({message: 'getProduct:', err});
    }
}

import mongoose from 'mongoose';

const addToCart = async (req, res, next) => {
    try {

        if (!req.body || !req.body.productId) {
            return res.status(400).json({ message: "Product ID is required in request body." });
        }

        const userId = req.userId;
        const user = await User.findById(userId);
        const productId = req.body.productId;

        if(!user) {
            return res.status(400).json({message: "Not Authorized"})
        }


        const cart = user.cart;
        const cartIndex = cart.findIndex(item => item.productId == productId);

        if (cartIndex !== -1) {
            cart[cartIndex].quantity++;
        } else {
            cart.unshift({ productId, quantity: 1 });
        }

        user.cart = cart;
        await user.save();

        return res.status(200).json({message: "Product added to cart successfully.", cart});

    } catch (err) {
        console.log(err);
        res.status(500).json({message: 'addToCart:', err});
    }
}

export default { getProducts, getProduct, addToCart };