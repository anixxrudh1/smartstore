import express from 'express'
import { verifyTokenMiddleware } from '../config/jwt.js'
import Product from '../models/Product.js'
import Sales from '../models/Sales.js'

const router = express.Router()

// Use JWT verification
router.use(verifyTokenMiddleware)

// @route GET /api/sales/revenue
// @desc Get total and average revenue
// @access Private
router.get('/revenue', async (req, res) => {
  try {
    const result = await Sales.aggregate([
      { $match: { userId: req.user.id } },
      {
        $group: {
          _id: null,
          total: { $sum: '$totalRevenue' },
          count: { $sum: 1 },
        },
      },
    ])

    const { total = 0, count = 0 } = result[0] || {}
    const average = count > 0 ? (total / count).toFixed(2) : 0

    res.json({ total, average, orderCount: count })
  } catch (error) {
    console.error('Error fetching revenue:', error)
    res.status(500).json({ message: 'Failed to fetch revenue data' })
  }
})

// @route GET /api/sales/data
// @desc Get sales data by date
// @access Private
router.get('/data', async (req, res) => {
  try {
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)

    const salesData = await Sales.aggregate([
      {
        $match: {
          userId: req.user.id,
          date: { $gte: thirtyDaysAgo },
        },
      },
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$date' } },
          revenue: { $sum: '$totalRevenue' },
          orders: { $sum: 1 },
          quantity: { $sum: '$quantity' },
        },
      },
      { $sort: { _id: -1 } },
      { $limit: 30 },
    ])

    res.json(salesData)
  } catch (error) {
    console.error('Error fetching sales data:', error)
    res.status(500).json({ message: 'Failed to fetch sales data' })
  }
})

// @route GET /api/sales/top-products
// @desc Get top-selling products
// @access Private
router.get('/top-products', async (req, res) => {
  try {
    const topProducts = await Product.find({ userId: req.user.id })
      .select('name price salesCount revenue')
      .sort({ revenue: -1, salesCount: -1 })
      .limit(10)

    // Filter out products with no sales
    const filteredProducts = topProducts.filter((p) => p.salesCount > 0)

    res.json(filteredProducts)
  } catch (error) {
    console.error('Error fetching top products:', error)
    res.status(500).json({ message: 'Failed to fetch top products' })
  }
})

// @route GET /api/sales/product-history/:productId
// @desc Get revenue history for a product (last 14 days)
// @access Private
router.get('/product-history/:productId', async (req, res) => {
  try {
    const { productId } = req.params
    const days = 14
    const fromDate = new Date(Date.now() - days * 24 * 60 * 60 * 1000)

    const history = await Sales.aggregate([
      {
        $match: {
          userId: req.user.id,
          productId: new require('mongoose').Types.ObjectId(productId),
          date: { $gte: fromDate },
        },
      },
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$date' } },
          revenue: { $sum: '$totalRevenue' },
          orders: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ])

    res.json(history)
  } catch (error) {
    console.error('Error fetching product history:', error)
    res.status(500).json({ message: 'Failed to fetch product history' })
  }
})

// @route GET /api/sales/low-stock
// @desc Get products with low stock
// @access Private
router.get('/low-stock', async (req, res) => {
  try {
    const lowStockThreshold = 10 // Define threshold

    const lowStockProducts = await Product.find({
      userId: req.user.id,
      stock: { $lte: lowStockThreshold },
    })
      .select('name stock category')
      .sort({ stock: 1 })
      .limit(10)

    res.json(lowStockProducts)
  } catch (error) {
    console.error('Error fetching low stock products:', error)
    res.status(500).json({ message: 'Failed to fetch low stock alerts' })
  }
})

// @route POST /api/sales/record-sale
// @desc Record a sale for a product
// @access Private
router.post('/record-sale', async (req, res) => {
  try {
    const { productId, quantity, price } = req.body

    if (!productId || !quantity || !price) {
      return res.status(400).json({ message: 'Product ID, quantity, and price are required' })
    }

    // Find product
    const product = await Product.findOne({
      _id: productId,
      userId: req.user.id,
    })

    if (!product) {
      return res.status(404).json({ message: 'Product not found' })
    }

    // Check stock
    if (product.stock < quantity) {
      return res.status(400).json({ message: 'Insufficient stock' })
    }

    // Create sale record
    const totalRevenue = quantity * price
    const sale = await Sales.create({
      userId: req.user.id,
      productId,
      quantity,
      price,
      totalRevenue,
    })

    // Update product stock and sales count
    product.stock -= quantity
    product.salesCount += quantity
    product.revenue += totalRevenue
    await product.save()

    res.status(201).json(sale)
  } catch (error) {
    console.error('Error recording sale:', error)
    res.status(500).json({ message: error.message || 'Failed to record sale' })
  }
})

export default router
