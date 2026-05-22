import express from 'express'
import { verifyTokenMiddleware } from '../config/jwt.js'
import Product from '../models/Product.js'
import * as aiService from '../services/aiService.js'

const router = express.Router()

// Use JWT verification
router.use(verifyTokenMiddleware)

// @route POST /api/ai/generate-description
// @desc Generate product description using OpenAI
// @access Private
router.post('/generate-description', async (req, res) => {
  try {
    const { productId } = req.body

    if (!productId) {
      return res.status(400).json({ message: 'Product ID is required' })
    }

    // Verify product ownership
    const product = await Product.findOne({
      _id: productId,
      userId: req.user.id,
    })

    if (!product) {
      return res.status(404).json({ message: 'Product not found' })
    }

    // Generate description using OpenAI
    const description = await aiService.generateProductDescription({
      name: product.name,
      category: product.category,
      currentDescription: product.description,
    })

    // Optionally save to product
    product.aiDescription = description
    await product.save()

    res.json({ description })
  } catch (error) {
    console.error('Description generation error:', error)
    res.status(500).json({
      message: error.message || 'Failed to generate description',
    })
  }
})

// @route POST /api/ai/generate-tags
// @desc Generate SEO tags using OpenAI
// @access Private
router.post('/generate-tags', async (req, res) => {
  try {
    const { productId } = req.body

    if (!productId) {
      return res.status(400).json({ message: 'Product ID is required' })
    }

    // Verify product ownership
    const product = await Product.findOne({
      _id: productId,
      userId: req.user.id,
    })

    if (!product) {
      return res.status(404).json({ message: 'Product not found' })
    }

    // Generate tags using OpenAI
    const tags = await aiService.generateSEOTags(
      product.name,
      product.aiDescription || product.description
    )

    // Save tags to product
    product.tags = tags
    product.seoKeywords = tags
    await product.save()

    res.json({ tags })
  } catch (error) {
    console.error('Tags generation error:', error)
    res.status(500).json({
      message: error.message || 'Failed to generate tags',
    })
  }
})

// @route POST /api/ai/generate-caption
// @desc Generate marketing caption using OpenAI
// @access Private
router.post('/generate-caption', async (req, res) => {
  try {
    const { productId } = req.body

    if (!productId) {
      return res.status(400).json({ message: 'Product ID is required' })
    }

    // Verify product ownership
    const product = await Product.findOne({
      _id: productId,
      userId: req.user.id,
    })

    if (!product) {
      return res.status(404).json({ message: 'Product not found' })
    }

    // Generate caption using OpenAI
    const caption = await aiService.generateMarketingCaption(
      product.name,
      product.aiDescription || product.description
    )

    // Save caption to product
    product.marketingCaption = caption
    await product.save()

    res.json({ caption })
  } catch (error) {
    console.error('Caption generation error:', error)
    res.status(500).json({
      message: error.message || 'Failed to generate caption',
    })
  }
})

// @route POST /api/ai/generate-pricing
// @desc Generate pricing recommendations using OpenAI
// @access Private
router.post('/generate-pricing', async (req, res) => {
  try {
    const { productId } = req.body

    if (!productId) {
      return res.status(400).json({ message: 'Product ID is required' })
    }

    // Verify product ownership
    const product = await Product.findOne({
      _id: productId,
      userId: req.user.id,
    })

    if (!product) {
      return res.status(404).json({ message: 'Product not found' })
    }

    // Generate pricing using OpenAI
    const pricing = await aiService.generatePricingRecommendation({
      name: product.name,
      price: product.price,
      category: product.category,
      salesCount: product.salesCount,
    })

    res.json(pricing)
  } catch (error) {
    console.error('Pricing generation error:', error)
    res.status(500).json({
      message: error.message || 'Failed to generate pricing recommendation',
    })
  }
})

// @route POST /api/ai/generate-insights
// @desc Generate sales insights using OpenAI
// @access Private
router.post('/generate-insights', async (req, res) => {
  try {
    // Get top products for user
    const topProducts = await Product.find({ userId: req.user.id })
      .sort({ revenue: -1 })
      .limit(5)

    if (topProducts.length === 0) {
      return res.json({
        insights: 'Add products and sales data to see insights',
        trending: 'No sales data available yet',
        suggestions: [],
      })
    }

    // Generate insights using OpenAI
    const insights = await aiService.generateSalesInsights(topProducts)

    res.json(insights)
  } catch (error) {
    console.error('Insights generation error:', error)
    res.status(500).json({
      message: error.message || 'Failed to generate insights',
    })
  }
})

export default router
