import Product  from '../models/product.js';

import {v2 as cloudinary} from 'cloudinary';

const getProducts = async (req, res, next) => {
    try {
        const product = await Product.find({ userId: req.userId });
        
        if(!product) {
            return res.status(400).json({message: 'There is no product'});
        }

        return res.status(200).json({message: "Your products is got successfully", product});

    } catch (err) {
        console.log(err);
        res.status(500).json({message: 'postAddProduct: ' + err.message});
    }
}

const postAddProduct = async (req, res, next) => {
    try {
        const { title, description, price, category, subCategory, sizes } = req.body;

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
            userId: req.userId
        });
        await product.save();

        console.log("Product added successfully", product);

        return res.status(200).json({message: "Product added successfully", product});

    } catch (err) {
        console.log(err);
        res.status(500).json({message: 'postAddProduct: ' + err.message});
    }
}

const getProduct = async (req, res, next) => {
    try {
        const productId = req.params.productId;
    
        const product = await Product.findOne({_id: productId, userId: req.userId});
    
        if(!product) {
            return res.status(400).json({ message: 'Not Authorized.' });
        }
    
        return res.status(400).json({message: 'Get product successfully.', product});

    } catch (err) {
        console.log(err);
        res.status(500).json({message: 'getProduct: ' + err.message});
    }
}

const putUpdateProduct = async (req, res, next) => {
    try {
        const { title, description, price, category, subCategory, sizes } = req.body;
        const productId = req.params.productId;

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

        const product = await Product.findOne({_id: productId, userId: req.userId});

        if(!product) {
            return res.status(400).json({ message: 'Not Authorized.' });
        }

        product.title = title;
        product.description = description;
        product.price = Number(price);
        product.image = imagesUrl;
        product.category = category;
        product.subCategory = subCategory;
        product.sizes = JSON.parse(sizes);

        await product.save();

        console.log("Product updated successfully", product);

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

        await Product.deleteOne(productId);

        console.log(product);
        return res.status(200).json({ message: "Product deleted successfully", product });
        
    } catch (err) {
        console.log(err);
        res.status(500).json({message: 'deleteProduct: ' + err.message});
    }
}



export default { postAddProduct, putUpdateProduct, deleteProduct, getProducts, getProduct };