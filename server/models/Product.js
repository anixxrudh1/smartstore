import mongoose from 'mongoose'

const productSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      default: '',
    },
    aiDescription: {
      type: String,
      default: '',
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    stock: {
      type: Number,
      required: true,
      min: 0,
      default: 0,
    },
    category: {
      type: String,
      trim: true,
      default: 'Uncategorized',
    },
    sku: {
      type: String,
      unique: true,
      sparse: true,
    },
    tags: [String],
    marketingCaption: {
      type: String,
      default: '',
    },
    seoKeywords: [String],
    salesCount: {
      type: Number,
      default: 0,
    },
    revenue: {
      type: Number,
      default: 0,
    },
    image: {
      type: String,
      default: null,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
)

// Index for user queries
productSchema.index({ userId: 1 })
productSchema.index({ category: 1 })

export default mongoose.model('Product', productSchema)
