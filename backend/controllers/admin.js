import Product  from '../models/product.js';
import {v2 as cloudinary} from 'cloudinary';
import WishList from '../models/wishList.js';
import Order from '../models/order.js';
import User from '../models/user.js';

const getAllProducts = async (req, res, next) => {
    try {
        const page = +req.query.page || 1;
        const limit = +req.query.limit || 10;
        const skip = (page - 1) * limit;
        const search = req.query.search || '';

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
            .populate('userId', 'name email');

        const total = await Product.countDocuments(query);

        if (products.length === 0) {
            return res.status(200).json({ 
                message: 'No products found', 
                products: [],
                pagination: { total: 0, page, limit, totalPages: 0 }
            });
        }

        return res.status(200).json({
            message: "Products retrieved successfully", 
            products,
            pagination: {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit)
            }
        });

    } catch (err) {
        console.log(err);
        res.status(500).json({ message: 'getProducts: ' + err.message });
    }
}

const getMyProducts = async (req, res, next) => {
    try {
        const page = +req.query.page || 1;
        const limit = +req.query.limit || 10;
        const skip = (page - 1) * limit;
        const search = req.query.search || '';

        let query = { userId: req.userId }; 
        
        if (search && search.trim()) {
            query.$and = [
                { userId: req.userId },
                {
                    $or: [
                        { title: { $regex: search.trim(), $options: 'i' } },
                        { category: { $regex: search.trim(), $options: 'i' } }
                    ]
                }
            ];
        }

        const products = await Product.find(query)
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);

        const total = await Product.countDocuments(query);

        if (products.length === 0) {
            return res.status(200).json({ 
                message: 'You have no products', 
                products: [],
                pagination: { total: 0, page, limit, totalPages: 0 }
            });
        }

        return res.status(200).json({
            message: "Your products retrieved successfully", 
            products,
            pagination: {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit)
            }
        });

    } catch (err) {
        console.log(err);
        res.status(500).json({ message: 'getMyProducts: ' + err.message });
    }
}

const postAddProduct = async (req, res, next) => {
    try {
        const { title, description, price, category, subCategory, sizes, stock } = req.body;

        if (!req.files) {
            return res.status(400).json({ message: 'No files uploaded.' });
        }


        const image1 = req.files.image1 && req.files.image1[0];
        const image2 = req.files.image2 && req.files.image2[0];
        const image3 = req.files.image3 && req.files.image3[0];
        const image4 = req.files.image4 && req.files.image4[0];

        const images = [image1, image2, image3, image4].filter(item => item !== undefined);

        if (images.length === 0) {
            return res.status(400).json({ message: 'At least one image file is required.' });
        }

        let imagesUrl = await Promise.all(
            images.map(async (item) => {
                let result = await cloudinary.uploader.upload(item.path, {resource_type: 'image'});
                return result.secure_url;
            })
        );

        const product = new Product({
            title, 
            description, 
            price: Number(price), 
            image: imagesUrl, 
            category, 
            subCategory, 
            sizes: JSON.parse(sizes), 
            userId: req.userId,
            stock
        });
        await product.save();

        console.log("Product added successfully");

        return res.status(200).json({message: "Product added successfully", product});

    } catch (err) {
        console.log(err);
        res.status(500).json({message: 'postAddProduct: ' + err.message});
    }
}

const getProduct = async (req, res, next) => {
    try {
        const productId = req.params.productId;
    
        const product = await Product.findOne({_id: productId, userId: req.userId}).populate('userId', 'name');
    
        if(!product) {
            return res.status(400).json({ message: 'Not Authorized.' });
        }
    
        return res.status(200).json({message: 'Get product successfully.', product});

    } catch (err) {
        console.log(err);
        res.status(500).json({message: 'getProduct: ' + err.message});
    }
}

const putUpdateProduct = async (req, res, next) => {
    try {
        const { title, description, price, category, subCategory, sizes, stock } = req.body;
        const productId = req.params.productId;

        const product = await Product.findOne({_id: productId, userId: req.userId});
        if(!product) {
            return res.status(404).json({ message: 'Product not found or not authorized.' });
        }

        let imagesUrl = product.image; 
        
        if (req.files && Object.keys(req.files).length > 0) {
            const image1 = req.files.image1 && req.files.image1[0];
            const image2 = req.files.image2 && req.files.image2[0];
            const image3 = req.files.image3 && req.files.image3[0];
            const image4 = req.files.image4 && req.files.image4[0];

            const images = [image1, image2, image3, image4].filter(item => item !== undefined);

            if (images.length > 0) {
                imagesUrl = await Promise.all(
                    images.map(async (item) => {
                        let result = await cloudinary.uploader.upload(item.path, {resource_type: 'image'});
                        return result.secure_url;
                    })
                );
            }
        }

        product.title = title || product.title;
        product.description = description || product.description;
        product.price = price ? Number(price) : product.price;
        product.image = imagesUrl;
        product.category = category || product.category;
        product.subCategory = subCategory || product.subCategory;
        product.sizes = sizes ? JSON.parse(sizes) : product.sizes;
        product.stock = stock !== undefined ? Number(stock) : product.stock;

        await product.save();

        return res.status(200).json({message: "Product updated successfully", product});

    } catch (err) {
        console.log(err);
        res.status(500).json({message: 'putUpdateProduct: ' + err.message});
    }
}

const deleteProduct = async (req, res, next) => {
    try {
        const productId = req.params.productId
        const product = await Product.findById(productId);
        if(!product) {
            return res.status(400).json({ message: 'There is no product.' });
        }

        if(product.userId != req.userId) {
            return res.status(400).json({ message: 'Not Authorized.' });
        }

        await Product.findByIdAndDelete(productId);

        return res.status(200).json({ message: "Product deleted successfully" });
        
    } catch (err) {
        console.log(err);
        res.status(500).json({message: 'deleteProduct' ,error: err.message});
    }
}

const getWishLists = async (req, res, next) => {
    try {
        const wishLists = await WishList.find()
            .sort({ createdAt: -1 });

        if (wishLists.length === 0) {
            return res.status(200).json({ 
                message: 'No wishlists found', 
                wishLists: []
            });
        }

        return res.status(200).json({
            message: "Wishlists retrieved successfully", 
            wishLists
        });

    } catch (err) {
        console.log(err);
        res.status(500).json({ message: 'getWishLists', error: err.message });
    }
}

const getOrders = async (req, res, next) => {
    try {
        const page = +req.query.page || 1;
        const limit = +req.query.limit || 15;
        const skip = (page - 1) * limit;
        const search = req.query.search || '';

        let query = {};
        if (search && search.trim()) {
            const users = await User.find({
                $or: [
                    { name: { $regex: search.trim(), $options: 'i' } },
                    { email: { $regex: search.trim(), $options: 'i' } }
                ]
            }).select('_id');
            
            const userIds = users.map(user => user._id);
            
            query = {
                $or: [
                    { status: { $regex: search.trim(), $options: 'i' } },
                    { paymentMethod: { $regex: search.trim(), $options: 'i' } },
                    { userId: { $in: userIds } }
                ]
            };
        }

        const orders = await Order.find(query)
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit)
            .populate('userId', 'name email')
            .populate('products.productId', 'title price');

        const total = await Order.countDocuments(query);

        if (orders.length === 0) {
            return res.status(200).json({ 
                message: 'No orders found', 
                orders: [],
                pagination: { total: 0, page, limit, totalPages: 0 }
            });
        }

        return res.status(200).json({
            message: "Orders retrieved successfully", 
            orders,
            pagination: {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit)
            }
        });

    } catch (err) {
        console.log(err);
        res.status(500).json({ message: 'getOrders: ' + err.message });
    }
}

const updateOrderStatus = async (req, res, next) => {
    try {
        const { status } = req.body;
        const { orderId } = req.params;

        const validStatuses = ['pending', 'processing', 'shipped', 'delivered', 'cancelled', 'refund'];
        if (!validStatuses.includes(status)) {
            return res.status(400).json({ message: "Invalid order status." });
        }

        const order = await Order.findById(orderId);
        if (!order) {
            return res.status(404).json({ message: "Order not found." });
        }

        if (['delivered', 'cancelled'].includes(order.status) && status !== 'refund') {
            return res.status(400).json({ message: "Cannot change status of completed orders." });
        }

    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "updateOrderStatus:", err });
    }
}

export default { 
    postAddProduct, 
    putUpdateProduct, 
    deleteProduct, 
    getAllProducts, 
    getMyProducts,
    getProduct, 
    getWishLists, 
    updateOrderStatus, 
    getOrders 
};