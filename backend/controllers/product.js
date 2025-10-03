import { validationResult } from 'express-validator';
import Product  from '../models/product.js';

const getProducts = async (req, res, next) => {
    try {
        const page = +req.query.page || 1;
        const limit = +req.query.limit || 10;
        const skip = (page - 1) * limit;
        const { search } = req.body; 

        let query = {};
        if (search && search.trim()) {
            query = {
                $or: [
                    { title: { $regex: search.trim(), $options: 'i' } },
                    { category: { $regex: search.trim(), $options: 'i' } }
                ]
            };
        }

        const products = await Product.find(query)
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit)
            .populate('userId', 'name');
            
        const total = await Product.countDocuments(query);

        return res.status(200).json({
            products,
            pagination: {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit)
            },
            search: search || null
        });
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: 'getProducts:', err });
    }
}

const getProduct = async (req, res, next) => {
    try {
        const errors = validationResult(req);
        if(!errors.isEmpty()) {
            return res.status(400).json({message: errors.array()});
        }
        
        const productId = req.params.productId;
        const product = await Product.findById(productId);

        if (!product) {
            return res.status(404).json({message: "Product not found."});
        }
        res.status(200).json({message: "Open product page successfully.", product});
    } catch (err) {
        console.log(err);
        res.status(500).json({message: 'getProduct:', err});
    }
}

export default { getProducts, getProduct };