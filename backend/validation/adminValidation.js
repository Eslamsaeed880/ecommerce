import { body, query, param } from 'express-validator';

const paginationValidator = [
    query('page')
        .optional()
        .isInt({min: 1})
        .withMessage("Page must be a positive integer."),
    query('limit')
        .optional()
        .isInt({ min: 1, max: 100 })
        .withMessage("Limit must be between 1-100."),
    query('search')
        .optional()
        .isLength({ max: 100 })
        .withMessage("Search term must not exceed 100 characters.")
        .trim()
];

const productIdValidator = [
    param('productId')
        .isMongoId()
        .withMessage("Invalid product ID format.")
];

const orderIdValidator = [
    param('orderId')
        .isMongoId()
        .withMessage("Invalid order ID format.")
];

const productFieldValidators = {
    title: body('title')
        .isLength({ min: 2, max: 200 })
        .withMessage("Title must be between 2-200 characters.")
        .trim(),
    
    description: body('description')
        .isLength({ min: 10, max: 2000 })
        .withMessage("Description must be between 10-2000 characters.")
        .trim(),
    
    price: body('price')
        .isFloat({ min: 0.01, max: 999999 })
        .withMessage("Price must be between $0.01 and $999,999."),
    
    category: body('category')
        .isLength({ min: 2, max: 50 })
        .withMessage("Category must be between 2-50 characters.")
        .trim(),
    
    subCategory: body('subCategory')
        .optional()
        .isLength({ max: 50 })
        .withMessage("Sub-category must not exceed 50 characters.")
        .trim(),
    
    sizes: body('sizes')
        .custom((value) => {
            try {
                const parsedSizes = JSON.parse(value);
                if (!Array.isArray(parsedSizes) || parsedSizes.length === 0) {
                    throw new Error("Sizes must be a non-empty array.");
                }
                return true;
            } catch {
                throw new Error("Invalid sizes format.");
            }
        }),
    
    stock: body('stock')
        .isInt({ min: 0, max: 999999 })
        .withMessage("Stock must be between 0 and 999,999.")
};

const fileValidator = body().custom((value, { req }) => {
    if (!req.files || Object.keys(req.files).length === 0) {
        throw new Error("At least one product image is required.");
    }
    
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    const maxSize = 5 * 1024 * 1024; // 5MB
    
    Object.values(req.files).forEach((fileArray) => {
        if (Array.isArray(fileArray)) {
            fileArray.forEach((file) => {
                if (!allowedTypes.includes(file.mimetype)) {
                    throw new Error("Only JPEG, PNG, and WebP images are allowed.");
                }
                if (file.size > maxSize) {
                    throw new Error("Each image must be less than 5MB.");
                }
            });
        }
    });
    
    return true;
});

export const getProductsValidator = paginationValidator;

export const addProductValidator = [
    productFieldValidators.title.notEmpty().withMessage("Title is required."),
    productFieldValidators.description.notEmpty().withMessage("Description is required."),
    productFieldValidators.price.notEmpty().withMessage("Price is required."),
    productFieldValidators.category.notEmpty().withMessage("Category is required."),
    productFieldValidators.subCategory,
    productFieldValidators.sizes,
    productFieldValidators.stock.notEmpty().withMessage("Stock is required."),
    fileValidator
];

export const updateProductValidator = [
    ...productIdValidator,
    productFieldValidators.title.optional(),
    productFieldValidators.description.optional(),
    productFieldValidators.price.optional(),
    productFieldValidators.category.optional(),
    productFieldValidators.subCategory,
    body('sizes').optional().custom((value) => {
        if (value) {
            try {
                const parsedSizes = JSON.parse(value);
                if (!Array.isArray(parsedSizes) || parsedSizes.length === 0) {
                    throw new Error("Sizes must be a non-empty array.");
                }
                return true;
            } catch {
                throw new Error("Invalid sizes format.");
            }
        }
        return true;
    }),
    productFieldValidators.stock.optional()
];

export const getProductValidator = productIdValidator;

export const deleteProductValidator = productIdValidator;

export const getOrdersValidator = paginationValidator;

export const updateOrderStatusValidator = [
    ...orderIdValidator,
    body('status')
        .notEmpty()
        .withMessage("Order status is required.")
        .isIn(['pending', 'processing', 'shipped', 'delivered', 'cancelled', 'refund'])
        .withMessage("Invalid order status.")
];