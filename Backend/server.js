import express from 'express';
import cors from 'cors';
import { connectDB } from './config/database.js';
import authRoutes from './routes/authRoutes.js';
import productRoutes from './routes/productRoutes.js';
import cartRoutes from './routes/cartRoutes.js';
import orderRoutes from './routes/orderRoutes.js';

const app = express();
const PORT = 5000;

connectDB();

app.use(cors());
app.use(express.json());

// Debug middleware
app.use((req, res, next) => {
  console.log(`${req.method} ${req.path}`);
  next();
});

app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/orders', orderRoutes);

app.get('/api/health', (req, res) => {
  res.json({ 
    success: true, 
    message: 'Server is running',
    timestamp: new Date().toISOString()
  });
});

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found'
  });
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: 'Something went wrong!',
    error: err.message
  });
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`📝 API Documentation:`);
  console.log(`   POST   /api/auth/login`);
  console.log(`   POST   /api/auth/register`);
  console.log(`   GET    /api/products`);
  console.log(`   GET    /api/products/search?q=query`);
  console.log(`   GET    /api/products/:id`);
  console.log(`   GET    /api/cart`);
  console.log(`   POST   /api/cart`);
  console.log(`   PUT    /api/cart`);
  console.log(`   DELETE /api/cart/:productId`);
  console.log(`   POST   /api/orders`);
  console.log(`   GET    /api/orders`);
  console.log(`   GET    /api/orders/:orderId`);
});
