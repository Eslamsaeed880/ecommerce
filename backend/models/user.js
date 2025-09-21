import mongoose from "mongoose";
import { Schema } from "mongoose";

const userSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    authProvider: {
        type: String,
        enum: ['local', 'google'],
        required: true,
        default: 'local'
    },
    role: {
        type: String,
        required: true,
        default: 'user'
    },
    cart: [
        {
            productId: {
                type: mongoose.Types.ObjectId,
                ref: "Product",
                required: true
            },
            quantity: {
                type: Number,
                required: true,
                default: 1
            }
        }
    ],
    date: {
        type: Date,
        required: true,
        default: Date.now()
    }
}, {minimize: false});

const user = mongoose.model('User', userSchema);

export default user;