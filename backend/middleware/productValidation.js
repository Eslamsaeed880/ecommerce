import { param } from "express-validator";
import Product from "../models/product.js";

export const getProductValidator = [
    param('productId')
        .custom(async (value, {req}) => {
            const product = await Product.findById(value);

            if(!product) {
                throw new Error("This product doesn't exist.");
            }
        })
];