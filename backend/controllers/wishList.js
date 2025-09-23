import WishList from '../models/wishList.js';

const postWishList = async (req, res, next) => {
    try {
        const { name, description } = req.body;
        const userId = req.userId;
        const existing = await WishList.findOne({ name, userId });

        if (existing) {
            return res.status(400).json({ message: "You already have a wishlist with this name." });
        }

        const wishList = new WishList({ name, description, userId, products: [] });
        await wishList.save();

        return res.status(200).json({ message: "Created wishlist successfully", wishList });
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "postWishList", error: err.message });
    }
};

const getWishList = async (req, res, next) => {
    try {
        const {wishListId} = req.params;
        const userId = req.userId;
        const wishList = await WishList.findOne({_id: wishListId, userId})
            .populate({
                path: 'products.productId',
                populate: {
                    path: 'userId',
                    select: 'name'
                }
            });

        return res.status(200).json({message: "Get wishlist successfully", wishList});
    } catch (err) {
        console.log(err);
        res.status(500).json({message: "getWishList", error: err.message});
    }
}

const getWishLists = async (req, res, next) => {
    try {
        const userId = req.userId;
        const wishLists = await WishList.find({userId}).select('_id name');

        return res.status(200).json({message: "Wishlists got successfully.", wishLists});
    } catch (err) {
        console.log(err);
        res.status(500).json({message: "getWishLists", error: err.message});
    }
}

const postAddProductToWishList = async (req, res, next) => {
    try {
        const wishListsCount = await WishList.countDocuments();
        const userId = req.userId;
        const { productId } = req.body;
        let wishList;

        if (wishListsCount === 0) {
            wishList = new WishList({ name: 'Default', userId, products: [{ productId }] });
            await wishList.save();
        } else {
            const [oldestWishList] = await WishList.find({ userId }).sort({ createdAt: 1 }).limit(1);

            if (!oldestWishList) {
                wishList = new WishList({ name: 'Default', userId, products: [{ productId }] });
                await wishList.save();
            } else {
                const productIds = new Set(oldestWishList.products.map(p => p.productId.toString()));
                productIds.add(productId.toString());
                oldestWishList.products = Array.from(productIds).map(id => ({ productId: id }));
                await oldestWishList.save();
                wishList = oldestWishList;
            }
        }

        return res.status(200).json({ message: "Product added to wishlist successfully", wishList });
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "addProductToWishList", error: err.message });
    }
};

const putWishList = async (req, res, next) => {
    try {
        const { wishListId, newWishListId, productId } = req.body;
        const userId = req.userId;
        const wishList = await WishList.findOne({ _id: wishListId, userId });
        const newWishList = await WishList.findOne({ _id: newWishListId, userId });

        if (!wishList || !newWishList) {
            return res.status(404).json({ message: "One or both wishlists not found." });
        }

        const existsInOld = wishList.products.some(
            p => p.productId.toString() === productId
        );
        if (!existsInOld) {
            return res.status(400).json({ message: "Product not found in the source wishlist." });
        }

        wishList.products = wishList.products.filter(
            p => p.productId.toString() !== productId
        );
        await wishList.save();

        const productIds = new Set(newWishList.products.map(p => p.productId.toString()));
        const alreadyInNew = productIds.has(productId.toString());
        productIds.add(productId.toString());
        newWishList.products = Array.from(productIds).map(id => ({ productId: id }));
        await newWishList.save();

        return res.status(200).json({
            message: alreadyInNew
                ? "Product moved, but it was already in the target wishlist."
                : "Product moved to another wishlist successfully.",
            newWishList
        });
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "putWishList", error: err.message });
    }
};

const deleteProductFromWishList = async (req, res, next) => {
    try {
        const {wishListId} = req.params;
        const {productId} = req.body;
        const userId = req.userId;
        const wishList = await WishList.findOne({_id: wishListId, userId});
        let products = wishList.products;
        products = products.filter(item => {
            return item.productId.toString() !== productId;
        })

        wishList.products = products;
        await wishList.save();
        return res.status(200).json({message: "Product from wishlist deleted successfully.", wishList});
    } catch(err) {
        console.log(err);
        res.status(500).json({ message: "delteProductFromWishList", error: err.message });
    }
}

const deleteWishList = async (req, res, next) => {
    try {
        const { wishListId } = req.params;
        const userId = req.userId;
        const wishList = await WishList.findById(wishListId);

        if (!wishList || userId.toString() !== wishList.userId.toString()) {
            return res.status(400).json({ message: "Not Authorized" });
        }

        await WishList.deleteOne({ _id: wishListId });

        return res.status(200).json({ message: "Wishlist deleted successfully." });
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "deleteWishList", error: err.message });
    }
};

export default {
    getWishList, 
    getWishLists,
    postAddProductToWishList, 
    putWishList, 
    postWishList, 
    deleteProductFromWishList, 
    deleteWishList
};