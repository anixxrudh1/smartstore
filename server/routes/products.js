import express from 'express'
import Product from '../models/Product.js'
import { verifyToken } from '../middleware/auth.js'
import { verifyTokenMiddleware } from '../config/jwt.js'

const router = express.Router()

// Use JWT verification
router.use(verifyTokenMiddleware)

// @route GET /api/products
// @desc Get all products for the user
// @access Private
router.get('/', async (req, res) => {
  try {
    const products = await Product.find({ userId: req.user.id }).sort({ createdAt: -1 })
    res.json(products)
  } catch (error) {
    console.error('Error fetching products:', error)
    res.status(500).json({ message: 'Failed to fetch products' })
  }
})

// @route GET /api/products/:id
// @desc Get single product
// @access Private
router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findOne({
      _id: req.params.id,
      userId: req.user.id,
    })

    if (!product) {
      return res.status(404).json({ message: 'Product not found' })
    }

    res.json(product)
  } catch (error) {
    console.error('Error fetching product:', error)
    res.status(500).json({ message: 'Failed to fetch product' })
  }
})

// @route POST /api/products
// @desc Create new product
// @access Private
router.post('/', async (req, res) => {
  try {
    const { name, description, price, stock, category, sku } = req.body

    // Validation
    if (!name || price === undefined || stock === undefined) {
      return res.status(400).json({ message: 'Name, price, and stock are required' })
    }

    // Check for duplicate SKU if provided
    if (sku) {
      const existingProduct = await Product.findOne({ sku })
      if (existingProduct) {
        return res.status(400).json({ message: 'Product with this SKU already exists' })
      }
    }

    const product = await Product.create({
      userId: req.user.id,
      name: name.trim(),
      description: description || '',
      price: parseFloat(price),
      stock: parseInt(stock),
      category: category || 'Uncategorized',
      sku: sku ? sku.trim() : undefined,
    })

    res.status(201).json(product)
  } catch (error) {
    console.error('Error creating product:', error)
    res.status(500).json({ message: error.message || 'Failed to create product' })
  }
})

// @route PUT /api/products/:id
// @desc Update product
// @access Private
router.put('/:id', async (req, res) => {
  try {
    let product = await Product.findOne({
      _id: req.params.id,
      userId: req.user.id,
    })

    if (!product) {
      return res.status(404).json({ message: 'Product not found' })
    }

    // Update allowed fields
    const allowedFields = [
      'name',
      'description',
      'price',
      'stock',
      'category',
      'sku',
      'tags',
      'aiDescription',
      'marketingCaption',
      'seoKeywords',
    ]

    allowedFields.forEach((field) => {
      if (req.body[field] !== undefined) {
        if (field === 'name') {
          product[field] = req.body[field].trim()
        } else if (['price', 'stock'].includes(field)) {
          product[field] = field === 'price' ? parseFloat(req.body[field]) : parseInt(req.body[field])
        } else {
          product[field] = req.body[field]
        }
      }
    })

    product = await product.save()
    res.json(product)
  } catch (error) {
    console.error('Error updating product:', error)
    res.status(500).json({ message: error.message || 'Failed to update product' })
  }
})

// @route DELETE /api/products/:id
// @desc Delete product
// @access Private
router.delete('/:id', async (req, res) => {
  try {
    const product = await Product.findOneAndDelete({
      _id: req.params.id,
      userId: req.user.id,
    })

    if (!product) {
      return res.status(404).json({ message: 'Product not found' })
    }

    res.json({ message: 'Product deleted successfully', product })
  } catch (error) {
    console.error('Error deleting product:', error)
    res.status(500).json({ message: error.message || 'Failed to delete product' })
  }
})

export default router
