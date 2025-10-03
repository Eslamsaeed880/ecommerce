import Order from '../models/order.js';
import User from '../models/user.js';
import Stripe from 'stripe';
import Product from '../models/product.js';
import { validationResult } from 'express-validator';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const currency = 'usd';
const deliveryCharges = 10;

function validateStock(cart) {
    const outOfStockItems = cart.filter(item => {
        const stock = Number(item.productId.stock) || 0;
        const quantity = Number(item.quantity) || 0;
        return quantity > stock;
    });
    return outOfStockItems;
}

const getUserOrders = async (req, res, next) => {
    try {
        const userId = req.userId;
        const page = +req.query.page || 1;
        const limit = +req.query.limit || 10;
        const skip = (page - 1) * limit;
        const status = req.query.status; 

        let query = { userId };
        if (status && status.trim() !== '') {
            query.status = status;
        }

        const orders = await Order.find(query)
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit)
            .populate('products.productId', 'title price image');

        const total = await Order.countDocuments(query);

        return res.status(200).json({
            message: "Get orders successfully.", 
            orders,
            pagination: {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit),
                hasNextPage: page < Math.ceil(total / limit),
                hasPrevPage: page > 1
            },
            filters: { status }
        });

    } catch (err) {
        console.log(err);
        res.status(500).json({message: 'getUserOrders', error: err.message});
    }
}

const addOrder = async (req, res, next) => {
    try {
        const errors = validationResult(req);
        if(!errors.isEmpty()) {
            return res.status(400).json({errors: errors.array()});
        }

        const {address} = req.body;
        const paymentMethod = "COD";
        const userId = req.userId;
        const user = await User.findById(userId).populate('cart.productId');
        
        if (!user) {
            return res.status(404).json({message: "User not found."});
        }

        const cart = user.cart;

        if(cart.length === 0) {
            return res.status(400).json({message: "Cart is empty."});
        }

        const outOfStockItems = validateStock(cart);
        if(outOfStockItems.length > 0) {
            const itemNames = outOfStockItems.map(item => item.productId.title).join(', ');
            return res.status(400).json({
                message: `The following items are out of stock: ${itemNames}`
            });
        }

        let totalAmount = 0;
        const orderProducts = cart.map(item => {
            const price = Number(item.productId.price);
            const quantity = Number(item.quantity);
            totalAmount += price * quantity;
            
            return {
                productId: item.productId._id,
                quantity: quantity,
                price: price
            };
        });

        totalAmount += deliveryCharges;

        const order = new Order({
            userId, 
            address, 
            paymentMethod, 
            products: orderProducts,
            totalAmount,
            payment: false 
        });

        await order.save();

        for (const item of cart) {
            const product = await Product.findById(item.productId._id);
            if (product) {
                const currentStock = Number(product.stock) || 0;
                const qty = Number(item.quantity) || 1;
                product.stock = Math.max(0, currentStock - qty);
                await product.save();
            }
        }

        user.cart = [];
        await user.save();
    
        return res.status(201).json({
            message: "Order placed successfully.",
            orderId: order._id
        });
    } catch (err) {
        console.log(err);
        res.status(500).json({message: 'addOrder: ' + err.message});
    }
}

const addOrderStripe = async (req, res, next) => {
    try {
        const errors = validationResult(req);
        if(!errors.isEmpty()) {
            return res.status(400).json({errors: errors.array()});
        }

        const {address} = req.body;
        const paymentMethod = "Stripe";
        const userId = req.userId;
        const user = await User.findById(userId).populate('cart.productId');
        
        if (!user) {
            return res.status(404).json({message: "User not found."});
        }

        const cart = user.cart;

        if(cart.length === 0) {
            return res.status(400).json({message: "Cart is empty."});
        }

        const outOfStockItems = validateStock(cart);
        if(outOfStockItems.length > 0) {
            const itemNames = outOfStockItems.map(item => item.productId.title).join(', ');
            return res.status(400).json({
                message: `The following items are out of stock: ${itemNames}`
            });
        }

        let totalAmount = 0;
        const orderProducts = cart.map(item => {
            const price = Number(item.productId.price);
            const quantity = Number(item.quantity);
            totalAmount += price * quantity;
            
            return {
                productId: item.productId._id,
                quantity: quantity,
                price: price
            };
        });

        totalAmount += deliveryCharges;

        const origin = req.headers.origin || `http://localhost:${process.env.PORT || 4000}`;
        
        const order = new Order({
            userId, 
            address, 
            paymentMethod, 
            products: orderProducts, 
            totalAmount,
            payment: false 
        });
    
        await order.save();

        const line_items = cart.map((item, idx) => {
            const product = item.productId;
            const price = Number(product.price);
            const name = product.title || `Product ${idx + 1}`;
            
            if (isNaN(price)) {
                throw new Error(`Invalid price for product: ${name}`);
            }
            
            return {
                price_data: {
                    currency: currency,
                    product_data: { name },
                    unit_amount: Math.round(price * 100)
                },
                quantity: Number(item.quantity) || 1
            };
        });

        line_items.push({
            price_data: {
                currency: currency,
                product_data: {
                    name: 'Delivery Charges'
                },
                unit_amount: deliveryCharges * 100
            },
            quantity: 1
        });

        const session = await stripe.checkout.sessions.create({
            success_url: `${origin}/api/order/verify-stripe?success=true&orderId=${order._id}`,
            cancel_url: `${origin}/api/order/verify-stripe?success=false&orderId=${order._id}`,
            line_items,
            mode: 'payment',
        });

        res.status(201).json({message: "Stripe session created", session_url: session.url});

    } catch (err) {
        console.log(err);
        res.status(500).json({message: "addOrderStripe: " + err.message});
    }
}

const verifyStripe = async (req, res, next) => {
    const { orderId, success } = req.query;
    try {
        if (success === "true") {
            const order = await Order.findByIdAndUpdate(orderId, { 
                payment: true,
                status: 'processing' 
            });
            
            if (order && order.products && order.products.length > 0) {
                for (const item of order.products) {
                    const product = await Product.findById(item.productId); 
                    if (product) {
                        const currentStock = Number(product.stock) || 0;
                        const qty = Number(item.quantity) || 1;
                        product.stock = Math.max(0, currentStock - qty);
                        await product.save();
                    }
                }
                
                await User.findByIdAndUpdate(order.userId, { cart: [] });
            }
            
            res.status(200).json({ message: "Payment successful", orderId });
        } else {
            await Order.findByIdAndDelete(orderId);
            res.status(204).send();
        }
    } catch (err) {
        console.log("verifyStripe: ", err);
        res.status(500).json({ message: "Verification error: " + err.message });
    }
}

export default {
    getUserOrders, 
    addOrder, 
    addOrderStripe, 
    verifyStripe
};