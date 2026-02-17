import mongoose from 'mongoose';
import User from '../models/User.js';
import Product from '../models/Product.js';

const MONGODB_URI = 'mongodb://localhost:27017/Ecommerce';

const seedData = async () => {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');

    // Clear existing data
    await User.deleteMany({});
    await Product.deleteMany({});
    console.log('Cleared existing data');

    // Create test user
    const user = new User({
      email: 'test@gmail.com',
      password: 'Test@123',
      name: 'Test User'
    });
    await user.save();
    console.log('Created test user: test@gmail.com / Test@123');

    // Create products
    const products = [
      {
        name: 'Wireless Headphones',
        price: 2999,
        image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400',
        category: 'Electronics',
        description: 'Premium wireless headphones with noise cancellation',
        stock: 50
      },
      {
        name: 'Smart Watch',
        price: 4999,
        image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400',
        category: 'Electronics',
        description: 'Fitness tracking smart watch with heart rate monitor',
        stock: 30
      },
      {
        name: 'Running Shoes',
        price: 3499,
        image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400',
        category: 'Fashion',
        description: 'Comfortable running shoes for daily workouts',
        stock: 100
      },
      {
        name: 'Laptop Backpack',
        price: 1299,
        image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400',
        category: 'Accessories',
        description: 'Durable laptop backpack with multiple compartments',
        stock: 75
      },
      {
        name: 'Coffee Maker',
        price: 2499,
        image: 'https://images.unsplash.com/photo-1517668808822-9ebb02f2a0e6?w=400',
        category: 'Home',
        description: 'Automatic coffee maker with timer function',
        stock: 40
      },
      {
        name: 'Yoga Mat',
        price: 899,
        image: 'https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=400',
        category: 'Sports',
        description: 'Non-slip yoga mat for home workouts',
        stock: 150
      },
      {
        name: 'Bluetooth Speaker',
        price: 1999,
        image: 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=400',
        category: 'Electronics',
        description: 'Portable bluetooth speaker with 10 hours battery',
        stock: 60
      },
      {
        name: 'Sunglasses',
        price: 1499,
        image: 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=400',
        category: 'Fashion',
        description: 'UV protection sunglasses with polarized lenses',
        stock: 80
      }
    ];

    await Product.insertMany(products);
    console.log(`Created ${products.length} products`);

    console.log('\nDatabase seeded successfully!');
    console.log('\n Test Credentials:');
    console.log('   Email: test@gmail.com');
    console.log('   Password: Test@123');
    
    process.exit(0);
  } catch (error) {
    console.error(' Seed error:', error);
    process.exit(1);
  }
};

seedData();
