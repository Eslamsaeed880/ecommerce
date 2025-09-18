import Product  from '../models/product.js';

const getProducts = async (req, res, next) => {
    try {
        const products = await Product.find();

        return res.status(200).json({products});

    } catch (err) {
        console.log(err);
        res.status(500).json({message: 'getProducts:', err});
    }
}

const getProduct = async (req, res, next) => {
    try {
        const productId = req.params.productId;
        const product = await Product.findById(productId);

        if(!product) {
            return res.status(400).json({ message: 'There is no product.' });
        }

        res.status(200).json({message: "Open product page successfully.", product});

    } catch (err) {
        console.log(err);
        res.status(500).json({message: 'getProduct:', err});
    }
}

export default { getProducts, getProduct };