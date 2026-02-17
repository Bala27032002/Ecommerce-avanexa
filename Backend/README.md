# E-Commerce Backend

## Architecture
This backend follows MVC (Model-View-Controller) pattern with MongoDB:
- **Models**: Mongoose schemas (User, Product, Order)
- **Controllers**: Business logic (authController, productController, orderController)
- **Routes**: API endpoints (authRoutes, productRoutes, orderRoutes)
- **Database**: MongoDB with Mongoose ODM

## Prerequisites
- Node.js (v14 or higher)
- MongoDB (running on localhost:27017)

## Setup Instructions

1. Install dependencies:
```bash
npm install
```

2. Make sure MongoDB is running:
```bash
# Check if MongoDB is running
mongosh mongodb://localhost:27017
```

3. Seed the database with initial data:
```bash
npm run seed
```

This will create:
- Test user: test@gmail.com / Test@123
- 8 sample products in the Products collection

4. Start the server:
```bash
npm start
```

Server will run on http://localhost:5000

## Database Structure

### Collections:
1. **users** - User authentication data
2. **products** - Product catalog
3. **orders** - Order history

## API Endpoints

### Authentication
- POST /api/auth/login - Login with credentials
- POST /api/auth/register - Register new user

### Products (Protected)
- GET /api/products - Get all active products
- GET /api/products/search?q=query - Search products
- GET /api/products/:id - Get product by ID

### Orders (Protected)
- POST /api/orders - Create new order
- GET /api/orders - Get all orders
- GET /api/orders/:orderId - Get order by ID

### Health Check
- GET /api/health - Server health status

## Test Credentials
- Email: test@gmail.com
- Password: Test@123

## MongoDB Collections

### Users Collection
```json
{
  "email": "test@gmail.com",
  "password": "hashed_password",
  "name": "Test User",
  "createdAt": "2024-01-01T00:00:00.000Z"
}
```

### Products Collection
```json
{
  "name": "Wireless Headphones",
  "price": 2999,
  "image": "https://...",
  "category": "Electronics",
  "description": "Premium wireless headphones...",
  "stock": 50,
  "isActive": true
}
```

### Orders Collection
```json
{
  "orderId": "ORD1234567890",
  "items": [...],
  "userDetails": {...},
  "total": 5998,
  "status": "Confirmed"
}
```

## Project Structure
```
Backend/
├── config/
│   ├── config.js          # Configuration settings
│   └── database.js        # MongoDB connection
├── models/
│   ├── User.js            # User Mongoose schema
│   ├── Product.js         # Product Mongoose schema
│   └── Order.js           # Order Mongoose schema
├── controllers/
│   ├── authController.js  # Authentication logic
│   ├── productController.js # Product logic
│   └── orderController.js # Order logic
├── routes/
│   ├── authRoutes.js      # Auth endpoints
│   ├── productRoutes.js   # Product endpoints
│   └── orderRoutes.js     # Order endpoints
├── scripts/
│   └── seedData.js        # Database seeding script
└── server.js              # Main application file
```

## Features
MongoDB integration with Mongoose
Password hashing with bcrypt
JWT authentication
Input validation
Error handling
Database seeding script
Text search on products
