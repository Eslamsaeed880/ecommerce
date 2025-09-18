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
    }  
}, {minimize: false});

const order = mongoose.model('Order', orderSchema);

export default order;