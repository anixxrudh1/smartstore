import { useEffect, useState } from 'react'
import { useProductStore } from '../store/productStore'
import { useSalesStore } from '../store/salesStore'
import { salesAPI, productAPI } from '../services/api'
import { TrendingUp, Package, AlertTriangle, DollarSign, Store } from 'lucide-react'

export default function Dashboard() {
  const [loading, setLoading] = useState(true)
  const { products, setProducts } = useProductStore()
  const { revenue, setRevenue, topProducts, setTopProducts } = useSalesStore()
  const [lowStock, setLowStock] = useState([])

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    try {
      const [productsRes, revenueRes, topRes, lowStockRes] = await Promise.all([
        productAPI.getAll(),
        salesAPI.getRevenue(),
        salesAPI.getTopProducts(),
        salesAPI.getLowStockProducts(),
      ])

      setProducts(productsRes.data)
      setRevenue(revenueRes.data.total)
      setTopProducts(topRes.data)
      setLowStock(lowStockRes.data)
    } catch (err) {
      console.error('Failed to load dashboard data:', err)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[80vh]">
        <div className="relative w-24 h-24">
          <div className="absolute inset-0 border-4 border-blue-200 rounded-full animate-ping"></div>
          <div className="absolute inset-0 border-4 border-t-blue-600 rounded-full animate-spin"></div>
        </div>
      </div>
    )
  }

  const stats = [
    {
      label: 'Total Revenue',
      value: `$${(revenue || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
      icon: DollarSign,
      gradient: 'from-emerald-400 to-teal-500',
      textColor: 'text-emerald-50'
    },
    {
      label: 'Total Products',
      value: products.length,
      icon: Package,
      gradient: 'from-blue-500 to-indigo-600',
      textColor: 'text-blue-50'
    },
    {
      label: 'Top Products',
      value: topProducts.length,
      icon: TrendingUp,
      gradient: 'from-purple-500 to-fuchsia-600',
      textColor: 'text-purple-50'
    },
    {
      label: 'Low Stock Alerts',
      value: lowStock.length,
      icon: AlertTriangle,
      gradient: 'from-orange-400 to-rose-500',
      textColor: 'text-orange-50'
    },
  ]

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-gray-900 to-gray-800 rounded-2xl p-8 mb-8 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 opacity-10 transform translate-x-1/4 -translate-y-1/4">
          <Store className="w-64 h-64 text-white" />
        </div>
        <div className="relative z-10">
          <h1 className="text-4xl font-extrabold text-white mb-2">Welcome to SmartStore AI 👋</h1>
          <p className="text-gray-300 text-lg">Here's what's happening in your store today.</p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        {stats.map((stat, idx) => {
          const Icon = stat.icon
          return (
            <div 
              key={idx} 
              className={`bg-gradient-to-br ${stat.gradient} p-6 rounded-2xl shadow-lg hover:-translate-y-1 hover:shadow-2xl transition-all duration-300 group`}
            >
              <div className="flex justify-between items-start">
                <div>
                  <p className={`text-sm font-medium ${stat.textColor} mb-1 opacity-90`}>{stat.label}</p>
                  <h3 className="text-3xl font-bold text-white">{stat.value}</h3>
                </div>
                <div className="p-3 bg-white/20 rounded-xl group-hover:scale-110 transition-transform duration-300 backdrop-blur-sm">
                  <Icon className="w-6 h-6 text-white" />
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Bottom Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Top Products */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-xl transition-shadow duration-300">
          <div className="p-6 border-b border-gray-50 bg-gray-50/50">
            <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-blue-600" />
              Top Selling Products
            </h2>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {topProducts.slice(0, 5).map((product, idx) => (
                <div key={idx} className="flex justify-between items-center p-4 rounded-xl hover:bg-blue-50/50 transition-colors duration-200 border border-transparent hover:border-blue-100">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-sm">
                      #{idx + 1}
                    </div>
                    <div>
                      <span className="text-gray-800 font-medium block">{product.name}</span>
                      <span className="text-gray-400 text-sm">{product.salesCount} sold</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="font-bold text-gray-900 block">${product.price}</span>
                    <span className="text-emerald-500 text-sm font-medium">+${product.revenue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                  </div>
                </div>
              ))}
              {topProducts.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  <Package className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                  <p>No products sold yet.</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Low Stock Alerts */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-xl transition-shadow duration-300">
          <div className="p-6 border-b border-gray-50 bg-gray-50/50">
            <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-orange-500" />
              Inventory Alerts
            </h2>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {lowStock.length > 0 ? (
                lowStock.slice(0, 5).map((product, idx) => (
                  <div key={idx} className="flex justify-between items-center p-4 rounded-xl bg-orange-50/50 border border-orange-100">
                    <div className="flex items-center gap-3">
                      <div className="relative">
                        <div className="w-2 h-2 rounded-full bg-orange-500"></div>
                        <div className="absolute inset-0 rounded-full bg-orange-500 animate-ping opacity-75"></div>
                      </div>
                      <span className="text-gray-800 font-medium">{product.name}</span>
                    </div>
                    <span className="bg-orange-100 text-orange-700 py-1 px-3 rounded-full text-sm font-bold shadow-sm">
                      Only {product.stock} left
                    </span>
                  </div>
                ))
              ) : (
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-emerald-100 text-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Package className="w-8 h-8" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-1">Stock is looking good!</h3>
                  <p className="text-gray-500 text-sm">All your products have sufficient inventory.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
