import { useEffect, useState } from 'react'
import { useProductStore } from '../store/productStore'
import { productAPI, aiAPI } from '../services/api'
import { Zap, Copy, AlertCircle, Loader } from 'lucide-react'

export default function AIContent() {
  const { products, setProducts } = useProductStore()
  const [selectedProductId, setSelectedProductId] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [aiResults, setAiResults] = useState({
    description: '',
    tags: [],
    caption: '',
  })

  useEffect(() => {
    if (products.length === 0) {
      fetchProducts()
    }
  }, [])

  const fetchProducts = async () => {
    try {
      const response = await productAPI.getAll()
      setProducts(response.data)
    } catch (err) {
      setError('Failed to load products')
    }
  }

  const selectedProduct = products.find((p) => p.id === selectedProductId)

  const handleGenerateDescription = async () => {
    if (!selectedProduct) return

    setLoading(true)
    setError('')

    try {
      const response = await aiAPI.generateDescription(selectedProduct.id)
      setAiResults((prev) => ({
        ...prev,
        description: response.data.description,
      }))
    } catch (err) {
      setError('Failed to generate description')
    } finally {
      setLoading(false)
    }
  }

  const handleGenerateTags = async () => {
    if (!selectedProduct) return

    setLoading(true)
    setError('')

    try {
      const response = await aiAPI.generateTags(selectedProduct.id)
      setAiResults((prev) => ({
        ...prev,
        tags: response.data.tags,
      }))
    } catch (err) {
      setError('Failed to generate tags')
    } finally {
      setLoading(false)
    }
  }

  const handleGenerateCaption = async () => {
    if (!selectedProduct) return

    setLoading(true)
    setError('')

    try {
      const response = await aiAPI.generateCaption(selectedProduct.id)
      setAiResults((prev) => ({
        ...prev,
        caption: response.data.caption,
      }))
    } catch (err) {
      setError('Failed to generate caption')
    } finally {
      setLoading(false)
    }
  }

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text)
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold text-secondary mb-2">AI Content Generation</h1>
      <p className="text-gray-600 mb-8">
        Generate product descriptions, SEO tags, and marketing captions powered by AI
      </p>

      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg flex gap-2 items-center">
          <AlertCircle className="w-5 h-5 text-red-600" />
          <p className="text-red-700">{error}</p>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-bold text-secondary mb-4">Select Product</h2>
            <select
              value={selectedProductId}
              onChange={(e) => setSelectedProductId(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary mb-4"
            >
              <option value="">Choose a product...</option>
              {products.map((product) => (
                <option key={product.id} value={product.id}>
                  {product.name}
                </option>
              ))}
            </select>

            {selectedProduct && (
              <div className="space-y-4">
                <div>
                  <p className="text-sm font-medium text-gray-600">Price</p>
                  <p className="text-2xl font-bold text-primary">${selectedProduct.price}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Category</p>
                  <p className="text-gray-800">{selectedProduct.category}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Stock</p>
                  <p className="text-gray-800">{selectedProduct.stock} units</p>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="lg:col-span-2 space-y-6">
          {/* Description Generation */}
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-secondary flex items-center gap-2">
                <Zap className="w-5 h-5 text-accent" />
                Product Description
              </h3>
              <button
                onClick={handleGenerateDescription}
                disabled={!selectedProduct || loading}
                className="flex items-center gap-2 bg-accent hover:bg-amber-600 text-white px-4 py-2 rounded-lg transition disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <Loader className="w-4 h-4 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Zap className="w-4 h-4" />
                    Generate
                  </>
                )}
              </button>
            </div>

            {aiResults.description && (
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="flex justify-between items-start mb-3">
                  <p className="text-gray-700 text-sm">{aiResults.description}</p>
                  <button
                    onClick={() => copyToClipboard(aiResults.description)}
                    className="text-primary hover:text-blue-600 ml-2"
                  >
                    <Copy className="w-5 h-5" />
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Tags Generation */}
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-secondary flex items-center gap-2">
                <Zap className="w-5 h-5 text-accent" />
                SEO Tags
              </h3>
              <button
                onClick={handleGenerateTags}
                disabled={!selectedProduct || loading}
                className="flex items-center gap-2 bg-accent hover:bg-amber-600 text-white px-4 py-2 rounded-lg transition disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <Loader className="w-4 h-4 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Zap className="w-4 h-4" />
                    Generate
                  </>
                )}
              </button>
            </div>

            {aiResults.tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {aiResults.tags.map((tag, idx) => (
                  <span
                    key={idx}
                    className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Caption Generation */}
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-secondary flex items-center gap-2">
                <Zap className="w-5 h-5 text-accent" />
                Marketing Caption
              </h3>
              <button
                onClick={handleGenerateCaption}
                disabled={!selectedProduct || loading}
                className="flex items-center gap-2 bg-accent hover:bg-amber-600 text-white px-4 py-2 rounded-lg transition disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <Loader className="w-4 h-4 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Zap className="w-4 h-4" />
                    Generate
                  </>
                )}
              </button>
            </div>

            {aiResults.caption && (
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="flex justify-between items-start mb-3">
                  <p className="text-gray-700 text-sm italic">{aiResults.caption}</p>
                  <button
                    onClick={() => copyToClipboard(aiResults.caption)}
                    className="text-primary hover:text-blue-600 ml-2"
                  >
                    <Copy className="w-5 h-5" />
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
