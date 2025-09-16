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
    cartId: [
        {
            type: mongoose.Types.ObjectId,
            default: {}
        }
    ]
}, {minimize: false});

const user = mongoose.model('User', userSchema);

export default user;