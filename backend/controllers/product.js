import Product  from '../models/product.js';

const getProducts = async (req, res, next) => {
    try {

        const page = +req.query.page || 1;

        const limit = +req.query.limit || 10;

        const skip = (page - 1) * limit;

        const products = await Product.find()
            .skip(skip)
            .limit(limit);

        const total = await Product.countDocuments();

        return res.status(200).json({
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