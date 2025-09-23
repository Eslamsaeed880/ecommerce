import mongoose from 'mongoose';
import {Schema} from 'mongoose';

const wishListSchema = new Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    products: [
        {
            productId: {
                type: Schema.Types.ObjectId,
                ref: 'Product',
                required: true
            }
        }
    ],
    description: {
        type: String,
        required: false
    }
}, {timestamps: true});

export default mongoose.model('WishList', wishListSchema);