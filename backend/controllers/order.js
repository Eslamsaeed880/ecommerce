import order from '../models/order.js';
import Order from '../models/order.js';
import User from '../models/user.js';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const currency = 'usd';
const deliveryCharges = 10;

const getOrders = async (req, res, next) => {
    try {

        const orders = await Order.find();

        return res.status(200).json({message: "Get orders successfully.", orders});

    } catch (err) {
        console.log(err);
        res.status(500).json({message: 'addOrder:', err});
    }
}

const getUserOrders = async (req, res, next) => {
    try {

        const userId = req.userId;

        const orders = await Order.find({userId});

        return res.status(200).json({message: "Get orders successfully.", orders});

    } catch (err) {
        console.log(err);
        res.status(500).json({message: 'getUserOrders: ', err});
    }
}

const addOrder = async (req, res, next) => {
    try {

        const {address} = req.body;

        const paymentMethod = "COD";
        
        const userId = req.userId;
        
        const user = await User.findById(userId);
        
        const cart = user.cart;

        if(cart == []) {
            return res.status(400).json({message: "Cart is empty."});
        }
    
        user.cart = [];
        
        await user.save();

        const order = new Order({userId, address, paymentMethod, products: cart});
    
        await order.save();
    
        return res.status(200).json({message: "Order placed successfully.", order});

    } catch (err) {
        console.log(err);
        res.status(500).json({message: 'addOrder:', err});
    }

}

const addOrderStripe = async (req, res, next) => {
    try {

        const {address} = req.body;

        const paymentMethod = "Stripe";
        
        const userId = req.userId;
        
        const user = await User.findById(userId).populate('cart.productId');
        
        const cart = user.cart;

        if(cart.length === 0) {
            return res.status(400).json({message: "Cart is empty."});
        }

        const origin = req.headers.origin || `http://localhost:${process.env.PORT || 4000}`;

        const order = new Order({userId, address, paymentMethod, products: cart});
    
        await order.save();

        const line_items = cart.map((item, idx) => {
            const product = item.productId;

            const price = Number(product.price);
            const name = product.title || `Product ${idx + 1}`;
            if (isNaN(price)) {
                throw new Error(`Invalid price for cart item: ${JSON.stringify(item)}`);
            }
            return {
                price_data: {
                    currency: currency,
                    product_data: { name },
                    unit_amount: Math.round(price * 100)
                },
                quantity: item.quantity || 1
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
            success_url: `${origin}/api/verify?success=true&orderId=${order._id}`,
            cancel_url: `${origin}/api/verify?success=false&orderId=${order._id}`,
            line_items,
            mode: 'payment',
        });

        res.json({message:true, session_url: session.url});

    } catch (err) {
        console.log(err)
        res.status(500).json({message: "addOrderStripe", err})
    }
}

const verifyStripe = async (req, res, next) => {
    const { orderId, success } = req.query;

    try {
        if (success === "true") {
            const order = await Order.findByIdAndUpdate(orderId, { payment: true });
            if (order) {
                await User.findByIdAndUpdate(order.userId, { cart: [] });
            }
            res.json({ message: "Payment success.", order });
        } else {
            await Order.findByIdAndDelete(orderId);
            res.json({ message: "Payment method doesn't success." });
        }
    } catch (err) {
        console.log("verifyStripe: ", err);
        res.json({ message: err });
    }
}

const updateOrderStatus = async (req, res, next) => {
    try {

        const {status} = req.body;
    
        const {orderId} = req.params;
    
        const order = await Order.findById(orderId);
    
        order.status = status;
    
        order.save();

        return res.status(200).json({message: "Status Updated successfully.", order});

    } catch (err) {
        console.log(err);
        res.status(500).json({message: "updateOrderStatus:", err});
    }
}

export default {getOrders, getUserOrders, addOrder, addOrderStripe, updateOrderStatus, verifyStripe};