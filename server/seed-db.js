import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Product from './models/Product.js';
import Sales from './models/Sales.js';
import User from './models/User.js';

dotenv.config({ path: '../.env' }); // Assuming run from server dir, but let's just use absolute path or run from root
// Wait, if it's in server/seed-db.js, run from smartstore root, path is './.env'
dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/smartstore';

const initialProducts = [
  { name: 'MacBook Pro M3', price: 1999.99, stock: 45, category: 'Electronics' },
  { name: 'iPhone 15 Pro Max', price: 1199.99, stock: 80, category: 'Electronics' },
  { name: 'Sony WH-1000XM5', price: 348.00, stock: 150, category: 'Audio' },
  { name: 'Ergonomic Office Chair', price: 299.99, stock: 5, category: 'Furniture' },
  { name: 'Standing Desk Pro', price: 499.99, stock: 12, category: 'Furniture' },
  { name: 'Nike Air Max 2024', price: 150.00, stock: 200, category: 'Clothing' },
  { name: 'Levi\'s 501 Original', price: 59.99, stock: 320, category: 'Clothing' },
  { name: 'Yeti Rambler 20oz', price: 35.00, stock: 500, category: 'Accessories' },
  { name: 'Apple Watch Series 9', price: 399.00, stock: 95, category: 'Electronics' },
  { name: 'Nintendo Switch OLED', price: 349.99, stock: 4, category: 'Gaming' },
  { name: 'Logitech MX Master 3S', price: 99.99, stock: 120, category: 'Electronics' },
  { name: 'Keychron K2 Keyboard', price: 89.00, stock: 65, category: 'Electronics' },
  { name: 'Gym Shark T-Shirt', price: 25.00, stock: 450, category: 'Clothing' },
  { name: 'Samsonite Suitcase', price: 180.00, stock: 8, category: 'Accessories' },
  { name: 'Kindle Paperwhite', price: 139.99, stock: 110, category: 'Electronics' }
];

async function seedDB() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');

    let user = await User.findOne({ email: 'demo@example.com' });
    if (!user) {
      user = new User({
        storeName: 'Demo Store',
        email: 'demo@example.com',
        password: 'password123'
      });
      await user.save();
      console.log('Created demo user');
    }

    const userId = user._id;

    // Clear existing data for this user
    await Product.deleteMany({ userId });
    await Sales.deleteMany({ userId });
    console.log('Cleared existing products and sales for demo user');

    // Insert Products
    const productsToInsert = initialProducts.map(p => ({
      ...p,
      userId,
      description: `High quality ${p.name} in the ${p.category} category.`,
      sku: `SKU-${Math.random().toString(36).substring(7).toUpperCase()}`,
      salesCount: 0,
      revenue: 0
    }));

    const insertedProducts = await Product.insertMany(productsToInsert);
    console.log(`Inserted ${insertedProducts.length} products`);

    // Generate 30 days of sales data
    const salesRecords = [];
    const now = new Date();

    for (let i = 0; i < 30; i++) {
      const date = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
      
      // Randomly pick 3-8 products sold on this day
      const dailySalesCount = Math.floor(Math.random() * 6) + 3;
      
      for (let j = 0; j < dailySalesCount; j++) {
        const randomProductIndex = Math.floor(Math.random() * insertedProducts.length);
        const product = insertedProducts[randomProductIndex];
        
        // Random quantity between 1 and 5
        const quantity = Math.floor(Math.random() * 5) + 1;
        const totalRevenue = quantity * product.price;

        salesRecords.push({
          userId,
          productId: product._id,
          quantity,
          price: product.price,
          totalRevenue,
          date
        });

        // Update product's aggregate sales/revenue in memory
        product.salesCount += quantity;
        product.revenue += totalRevenue;
      }
    }

    await Sales.insertMany(salesRecords);
    console.log(`Inserted ${salesRecords.length} sales records`);

    // Save updated products with their aggregate sales/revenue
    for (const p of insertedProducts) {
      await p.save();
    }
    console.log('Updated product sales aggregates');

    console.log('Database seeded successfully!');
    process.exit(0);
  } catch (err) {
    console.error('Seeding error:', err);
    process.exit(1);
  }
}

seedDB();
