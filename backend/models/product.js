import mongoose from "mongoose";
import { Schema } from "mongoose";

const productSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    image: {
        type: Array,
    },
    category: {
        type: String,
        required: true
    },
    subCategory: {
        type: String,
        required: true
    },
    sizes: {
        type: Array
    },
    userId: {
        type: mongoose.Types.ObjectId,
        required: false
    },
    date: {
        type: Date,
        required: true,
        default: Date.now()
    }
});

const product = mongoose.model("Product", productSchema);

export default product;