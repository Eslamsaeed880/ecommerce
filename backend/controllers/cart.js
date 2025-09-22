import User from '../models/user.js';
import {validationResult} from 'express-validator';

const getCart = async (req, res, next) => {
    try {

        const user = await User.findById(req.userId);
        const cart = user.cart;

        return res.status(200).json({message: "Get cart successfully.", cart});

    } catch (err) {
        console.log(err);
        res.status(500).json({message: 'getCart:', err});
    }
}

const addToCart = async (req, res, next) => {
    try {

        const errors = validationResult(req);

        if(!errors.isEmpty()) {
            return res.status(400).json({errors: errors.array()});
        }

        const userId = req.userId;
        const user = await User.findById(userId);
        const productId = req.body.productId;

        const cart = user.cart || [];
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

const deleteItemFromCart = async (req, res, next) => {
    try {
        const errors = validationResult(req);

        if(!errors.isEmpty()) {
            return res.status(400).json({errors: errors.array()});
        }

        const userId = req.userId;
        const cartId = req.params.cartId;
    
        const user = await User.findById(userId);

        let cart = user.cart;
    
        cart = cart.filter(item => item._id.toString() !== cartId);
    
        user.cart = cart;
    
        await user.save();

        return res.status(200).json({message: "Cart item deleted successfully.", cart: user.cart});

    } catch (err) {
        console.log(err);
        res.status(500).json({message: 'deleteItemFromCart:', err});
    }
}

const putUpdateItemFromCart = async (req, res, next) => {
    try {
        const errors = validationResult(req);

        if(!errors.isEmpty()) {
            return res.status(400).json({errors: errors.array()});
        }

        const userId = req.userId;
        const cartId = req.params.cartId;
        const updatedQuantity = req.body.quantity;

    
        const user = await User.findById(userId);

        const cart = user.cart || [];
        const cartIndex = cart.findIndex(item => item._id.toString() === cartId);

        cart[cartIndex].quantity = updatedQuantity;

        user.cart = cart;
        await user.save();

        return res.status(200).json({message: "Cart item updated successfully", cart: user.cart});

    } catch (err) {
        console.log(err);
        res.status(500).json({message: 'deleteItemFromCart:', err});
    }
}

export default {addToCart, deleteItemFromCart, putUpdateItemFromCart, getCart};