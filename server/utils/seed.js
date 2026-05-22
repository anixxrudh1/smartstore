import mongoose from 'mongoose'
import Product from '../models/Product.js'
import Sales from '../models/Sales.js'
import User from '../models/User.js'

export async function seedDemo(MONGODB_URI) {
  const uri = MONGODB_URI || process.env.MONGODB_URI || 'mongodb://localhost:27017/smartstore'
  await mongoose.connect(uri)

  let user = await User.findOne({ email: 'demo@example.com' })
  if (!user) {
    user = new User({ storeName: 'Demo Store', email: 'demo@example.com', password: 'password123' })
    await user.save()
  }
  const userId = user._id

  // Clear existing
  await Product.deleteMany({ userId })
  await Sales.deleteMany({ userId })

  const initialProducts = [
    { name: 'MacBook Pro M3', price: 1999.99, stock: 45, category: 'Electronics' },
    { name: 'iPhone 15 Pro Max', price: 1199.99, stock: 80, category: 'Electronics' },
    { name: 'Sony WH-1000XM5', price: 348.0, stock: 150, category: 'Audio' },
    { name: 'Ergonomic Office Chair', price: 299.99, stock: 5, category: 'Furniture' },
    { name: 'Standing Desk Pro', price: 499.99, stock: 12, category: 'Furniture' },
    { name: 'Nike Air Max 2024', price: 150.0, stock: 200, category: 'Clothing' },
    { name: "Levi's 501 Original", price: 59.99, stock: 320, category: 'Clothing' },
    { name: 'Yeti Rambler 20oz', price: 35.0, stock: 500, category: 'Accessories' },
    { name: 'Apple Watch Series 9', price: 399.0, stock: 95, category: 'Electronics' },
    { name: 'Nintendo Switch OLED', price: 349.99, stock: 4, category: 'Gaming' },
    { name: 'Logitech MX Master 3S', price: 99.99, stock: 120, category: 'Electronics' },
    { name: 'Keychron K2 Keyboard', price: 89.0, stock: 65, category: 'Electronics' },
    { name: 'Gym Shark T-Shirt', price: 25.0, stock: 450, category: 'Clothing' },
    { name: 'Samsonite Suitcase', price: 180.0, stock: 8, category: 'Accessories' },
    { name: 'Kindle Paperwhite', price: 139.99, stock: 110, category: 'Electronics' },
  ]

  // Add images and richer descriptions
  const images = [
    'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800&q=60',
    'https://images.unsplash.com/photo-1512496015851-a90fb38ba796?w=800&q=60',
    'https://images.unsplash.com/photo-1518444029157-7d1c3e2d6f8b?w=800&q=60',
    'https://images.unsplash.com/photo-1557800636-894a64c1696f?w=800&q=60',
    'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=800&q=60',
    'https://images.unsplash.com/photo-1520975916806-0b2a8c1b6a2b?w=800&q=60',
    'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=800&q=60',
    'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&q=60',
    'https://images.unsplash.com/photo-1573164574394-85f7b8b3d1f2?w=800&q=60',
    'https://images.unsplash.com/photo-1606813902870-7a88f8c2a9a1?w=800&q=60',
    'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800&q=60',
    'https://images.unsplash.com/photo-1519681393784-d120267933ba?w=800&q=60',
    'https://images.unsplash.com/photo-1520975916806-0b2a8c1b6a2b?w=800&q=60',
    'https://images.unsplash.com/photo-1520962917994-8f2d3c3b4b8f?w=800&q=60',
    'https://images.unsplash.com/photo-1523475496153-3d6cc7f9b8d8?w=800&q=60',
  ]

  const productsToInsert = initialProducts.map((p, i) => ({
    ...p,
    userId,
    description: `Premium ${p.name} — perfect for ${p.category.toLowerCase()} enthusiasts. Features high-quality materials, excellent performance, and backed by our demo warranty.`,
    marketingCaption: `${p.name}: top-rated in ${p.category}`,
    sku: `SKU-${Math.random().toString(36).substring(2, 9).toUpperCase()}`,
    image: images[i % images.length],
    salesCount: 0,
    revenue: 0,
  }))

  const insertedProducts = await Product.insertMany(productsToInsert)

  // Generate sales
  const salesRecords = []
  const now = new Date()
  for (let i = 0; i < 30; i++) {
    const date = new Date(now.getTime() - i * 24 * 60 * 60 * 1000)
    const dailySalesCount = Math.floor(Math.random() * 6) + 3
    for (let j = 0; j < dailySalesCount; j++) {
      const product = insertedProducts[Math.floor(Math.random() * insertedProducts.length)]
      const quantity = Math.floor(Math.random() * 5) + 1
      const totalRevenue = quantity * product.price
      salesRecords.push({ userId, productId: product._id, quantity, price: product.price, totalRevenue, date })
      product.salesCount += quantity
      product.revenue += totalRevenue
    }
  }

  await Sales.insertMany(salesRecords)
  for (const p of insertedProducts) await p.save()

  return { user, products: insertedProducts.length, sales: salesRecords.length }
}

export default seedDemo
