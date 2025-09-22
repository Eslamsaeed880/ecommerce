import mongoose from 'mongoose';
import {Schema} from 'mongoose';

const orderSchema = new Schema({
    products: [
        {
            productId: {
                type: mongoose.Types.ObjectId,
                ref: "Product",
                required: true
            },
            quantity: {
                type: Number,
                required: true
            }
        }
    ],
    userId: {
        type: mongoose.Types.ObjectId,
        ref: "User",
        required: true
    },
    address: {
        type: String,
        required: true
    },
    status: {
        type: String,
        required: true,
        default: 'Placed'
    },
    paymentMethod: {
        type: String,
        required: true
    },
    payment: {
        type: Boolean,
        required: true,
        default: false
    },
    date: {
        type: Date,
        required: true,
        default: Date.now()
    }
}, {minimize: false});

const order = mongoose.model('Order', orderSchema);

export default order;