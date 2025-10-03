# 🛒 Ecommerce API

A comprehensive and secure RESTful API for an ecommerce platform built with Node.js, Express.js, and MongoDB. This API provides complete functionality for user management, product catalog, shopping cart, order processing, and administrative features.

![Ecommerce API](image.png)

![Node.js](https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white)
![Express.js](https://img.shields.io/badge/Express.js-404D59?style=for-the-badge)
![MongoDB](https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white)
![JWT](https://img.shields.io/badge/JWT-black?style=for-the-badge&logo=JSON%20web%20tokens)

## 📋 Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Environment Variables](#environment-variables)
- [Usage](#usage)
- [API Documentation](#api-documentation)
- [Project Structure](#project-structure)
- [Security Features](#security-features)
- [Payment Integration](#payment-integration)
- [Contributing](#contributing)
- [License](#license)

## ✨ Features

### 🔐 Authentication & Authorization
- User registration and login
- Google OAuth 2.0 integration
- JWT-based authentication
- Role-based access control (User/Admin)
- Password encryption with bcrypt

### 🛍️ Product Management
- Product CRUD operations
- Category and subcategory management
- Image upload with Cloudinary integration
- Product search and filtering
- Size and inventory management

### 🛒 Shopping Experience
- Shopping cart functionality
- Wishlist management
- Product reviews and ratings
- Order management and tracking

### 💳 Payment Processing
- Stripe payment integration
- Secure payment processing

### 👨‍💼 Admin Features
- Admin dashboard functionality
- User management
- Order management
- Product inventory control

### 🔒 Security
- Helmet.js for security headers
- Rate limiting
- Input validation with express-validator
- CORS configuration
- Secure password handling

## 🛠️ Tech Stack

**Backend:**
- Node.js
- Express.js
- MongoDB with Mongoose ODM
- JWT for authentication
- Passport.js for OAuth

**Cloud Services:**
- Cloudinary for image storage
- MongoDB Atlas (recommended)

**Payment:**
- Stripe
- Cash on Delivery (COD)

**Development:**
- Nodemon for development
- Swagger for API documentation
- ESLint for code quality

## 📋 Prerequisites

Before running this project, make sure you have the following installed:

- Node.js (v14 or higher)
- npm or yarn
- MongoDB (local or Atlas)
- Cloudinary account
- Stripe account (for payments)

## 🚀 Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Eslamsaeed880/ecommerce.git
   cd ecommerce
   ```

2. **Navigate to backend directory**
   ```bash
   cd backend
   ```

3. **Install dependencies**
   ```bash
   npm install
   ```

4. **Set up environment variables** (see [Environment Variables](#environment-variables))

5. **Start the development server**
   ```bash
   npm start
   ```

The server will start on `http://localhost:4000` (or your specified PORT)

## 🔧 Environment Variables

Create a `.env` file in the backend directory with the following variables:

```env
# Server Configuration
PORT=4000
NODE_ENV=development

# MongoDB Configuration
MONGODB_URI=mongodb://localhost:27017/ecommerce
# or for MongoDB Atlas:
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/ecommerce

# JWT Configuration
JWT_SECRET=your_super_secret_jwt_key
JWT_EXPIRES_IN=7d

# Cloudinary Configuration
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret

# Google OAuth Configuration
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret

# Email Configuration (Nodemailer with SendGrid)
SENDGRID_API_KEY=your_sendgrid_api_key
FROM_EMAIL=your_verified_email@domain.com

# Payment Configuration
STRIPE_SECRET_KEY=your_stripe_secret_key

# Frontend URL (for CORS)
FRONTEND_URL=http://localhost:3000
```

## 💻 Usage

### Starting the Server

```bash
# Development mode (with nodemon)
npm start

# Production mode
node app.js
```

### API Base URL
```
http://localhost:4000/api
```

### API Documentation
Access the interactive Swagger documentation at:
```
http://localhost:4000/api-docs
```

## 📚 API Documentation

The API includes the following main endpoints:

### Authentication
- `POST /api/auth/signup` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/google` - Google OAuth login
- `GET /api/auth/google/callback` - Google OAuth callback
- `POST /api/auth/reset-password` - Reset password
- `POST /api/auth/confirm-reset-password` - Confirm password reset

### Products
- `GET /api/` - Get all products
- `GET /api/product/:productId` - Get product by ID
- `POST /api/admin/product` - Create product (Admin only)
- `PUT /api/admin/product/:productId` - Update product (Admin only)
- `DELETE /api/admin/product/:productId` - Delete product (Admin only)

### Cart
- `GET /api/cart` - Get user cart
- `POST /api/cart` - Add item to cart
- `PUT /api/cart/:cartId` - Update cart item
- `DELETE /api/cart/:cartId` - Remove item from cart

### Orders
- `GET /api/order/orders` - Get user orders
- `POST /api/order` - Create new order (Cash on Delivery)
- `POST /api/order/stripe` - Create order with Stripe payment
- `GET /api/order/verify-stripe` - Verify Stripe payment

### Wishlist
- `GET /api/wishlist` - Get all user wishlists
- `GET /api/wishlist/:wishListId` - Get specific wishlist
- `POST /api/wishlist` - Create new wishlist
- `POST /api/wishlist/:wishListId/product` - Add product to wishlist
- `PUT /api/wishlist/:wishListId` - Update wishlist
- `DELETE /api/wishlist/:wishListId/product/:productId` - Remove product from wishlist
- `DELETE /api/wishlist/:wishListId` - Delete entire wishlist

### Reviews
- `GET /api/review/product/:productId` - Get product reviews
- `GET /api/review/user` - Get user reviews
- `POST /api/review` - Create review
- `PUT /api/review/:reviewId` - Update review
- `DELETE /api/review/:reviewId` - Delete review

### Admin
- `GET /api/admin/product` - Get all products (Admin only)
- `GET /api/admin/orders` - Get all orders (Admin only)
- `PUT /api/admin/order/:orderId/status` - Update order status (Admin only)

For complete API documentation with request/response examples, visit the Swagger documentation at `/api-docs`.

## 📁 Project Structure

```
ecommerce/
├── backend/
│   ├── app.js                 # Main application file
│   ├── package.json           # Dependencies and scripts
│   ├── swagger.yaml           # API documentation
│   ├── config/
│   │   ├── mongodb.js         # MongoDB connection
│   │   ├── cloudinary.js      # Cloudinary configuration
│   │   └── swagger.js         # Swagger configuration
│   ├── controllers/
│   │   ├── auth.js            # Authentication logic
│   │   ├── product.js         # Product management
│   │   ├── cart.js            # Cart operations
│   │   ├── order.js           # Order processing
│   │   ├── review.js          # Review management
│   │   ├── wishList.js        # Wishlist operations
│   │   └── admin.js           # Admin functionality
│   ├── middleware/
│   │   ├── isAuth.js          # JWT authentication
│   │   ├── adminAuth.js       # Admin authorization
│   │   ├── googleAuth.js      # Google OAuth setup
│   │   └── multer.js          # File upload handling
│   ├── models/
│   │   ├── user.js            # User schema
│   │   ├── product.js         # Product schema
│   │   ├── order.js           # Order schema
│   │   ├── review.js          # Review schema
│   │   └── wishList.js        # Wishlist schema
│   ├── routes/
│   │   ├── auth.js            # Authentication routes
│   │   ├── product.js         # Product routes
│   │   ├── cart.js            # Cart routes
│   │   ├── order.js           # Order routes
│   │   ├── review.js          # Review routes
│   │   ├── wishList.js        # Wishlist routes
│   │   └── admin.js           # Admin routes
│   └── validation/
│       ├── authValidation.js      # Auth input validation
│       ├── productValidation.js   # Product validation
│       ├── cartValidation.js      # Cart validation
│       ├── orderValidation.js     # Order validation
│       ├── reviewValidation.js    # Review validation
│       ├── wishListValidation.js  # Wishlist validation
│       └── adminValidation.js     # Admin validation
├── image.png              # Project screenshot/logo
├── LICENSE               # MIT License
└── README.md            # Project documentation
```

## 🔐 Security Features

This API implements several security best practices:

- **Helmet.js**: Sets various HTTP headers to secure the app
- **Rate Limiting**: Prevents abuse and DoS attacks
- **CORS**: Configured for cross-origin requests
- **Input Validation**: Using express-validator for all inputs
- **Password Hashing**: Using bcrypt for secure password storage
- **JWT Authentication**: Stateless authentication with secure tokens
- **Role-based Access**: Different permissions for users and admins

## 💳 Payment Integration

The API supports multiple payment methods:

### Stripe
- Credit/Debit card processing
- Secure payment handling
- Payment verification with webhooks
- Endpoint: `POST /api/order/stripe`
- Verification: `GET /api/order/verify-stripe`

### Cash on Delivery (COD)
- Traditional cash payment method
- Order placed without online payment
- Endpoint: `POST /api/order`

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

### Development Guidelines

- Follow the existing code style
- Add appropriate comments
- Update documentation for new features
- Ensure all tests pass
- Add validation for new endpoints

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👥 Author

**Eslam Saeed**
- GitHub: [@Eslamsaeed880](https://github.com/Eslamsaeed880)

## 🙏 Acknowledgments

- Express.js community for the excellent framework
- MongoDB team for the robust database solution
- All contributors who help improve this project

## 📞 Support

If you have any questions or need help with setup, please:

1. Check the [Issues](https://github.com/Eslamsaeed880/ecommerce/issues) page
2. Create a new issue if your problem isn't already reported
3. Provide detailed information about your problem

---

⭐ **If you find this project helpful, please give it a star!** ⭐