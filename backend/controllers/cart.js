import User from '../models/user.js';
import Product from '../models/product.js';
import {validationResult} from 'express-validator';

const getCart = async (req, res, next) => {
    try {
        const page = +req.query.page || 1;
        const limit = +req.query.limit || 10;
        const skip = (page - 1) * limit;
        const search = req.query.search || '';

        const user = await User.findById(req.userId);
        if (!user) {
            return res.status(404).json({ message: "User not found." });
        }

        let cart = user.cart || [];

        if (search && search.trim()) {
            const matchingProducts = await Product.find({
                $or: [
                    { title: { $regex: search.trim(), $options: 'i' } },
                    { category: { $regex: search.trim(), $options: 'i' } },
                    { description: { $regex: search.trim(), $options: 'i'}}
                ]
            }).select('_id');

            const matchingProductIds = matchingProducts.map(p => p._id.toString());
            
            cart = cart.filter(item => 
                matchingProductIds.includes(item.productId.toString())
            );
        }

        const total = cart.length;
        const paginatedCart = cart.slice(skip, skip + limit);

        const populatedCart = await User.populate(
            { cart: paginatedCart },
            { 
                path: 'cart.productId',
                select: 'title description price image category stock'
            }
        );

        if (paginatedCart.length === 0) {
            return res.status(200).json({
                message: "Cart is empty or no products found.",
                cart: [],
                pagination: { total: 0, page, limit, totalPages: 0 }
            });
        }

        return res.status(200).json({
            message: "Get cart successfully.",
            cart: populatedCart.cart,
            pagination: {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit)
            }
        });

    } catch (err) {
        console.log(err);
        res.status(500).json({ message: 'getCart:', error: err.message });
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

        return res.status(201).json({message: "Product added to cart successfully."});

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
        return res.status(204).send();

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

        return res.status(200).json({message: "Cart item updated successfully"});

    } catch (err) {
        console.log(err);
        res.status(500).json({message: 'deleteItemFromCart:', err});
    }
}

export default {
    addToCart,
    deleteItemFromCart, 
    putUpdateItemFromCart, 
    getCart
};