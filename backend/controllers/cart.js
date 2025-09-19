import User from '../models/user.js';

const getCart = async (req, res, next) => {
    try {

        const user = await User.findById(req.userId);
        const cart = user.cart;

        if(!user) {
            return res.status(400).json({message: "Not Authorized"});
        } else if(cart.length === 0) {
            return res.status(200).json({message: "Cart is empty.", cart: []});
        }

        return res.status(200).json({message: "Get cart successfully.", cart});

    } catch (err) {
        console.log(err);
        res.status(500).json({message: 'getCart:', err});
    }
}

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
        const userId = req.userId;
        const cartId = req.params.cartId;
    
        const user = await User.findById(userId);

        if(!user) {
            return res.status(400).json({message: "Not Authorized"});
        }

        let cart = user.cart;

        if(cart.length === 0) {
            return res.status(400).json({message: "Cart is empty."});
        }
    
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
        const userId = req.userId;
        const cartId = req.params.cartId;
        const updatedQuantity = req.body.quantity;

        if(updatedQuantity < 1) {
            return res.status(400).json({message: "The Quantity should be positive"});
        }
    
        const user = await User.findById(userId);

        if(!user) {
            return res.status(400).json({message: "Not Authorized"});
        }

        const cart = user.cart || [];
        const cartIndex = cart.findIndex(item => item._id.toString() === cartId);

        if(cartIndex === -1) {
            return res.status(400).json({message: "Cart item not found."});
        } 

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