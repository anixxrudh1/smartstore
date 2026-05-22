import { useEffect, useState } from 'react'
import { useProductStore } from '../store/productStore'
import { useSalesStore } from '../store/salesStore'
import { salesAPI, productAPI } from '../services/api'
import { TrendingUp, Package, AlertTriangle, DollarSign } from 'lucide-react'

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
      <div className="flex items-center justify-center h-screen">
        <div className="text-gray-500">Loading dashboard...</div>
      </div>
    )
  }

  const stats = [
    {
      label: 'Total Revenue',
      value: `$${(revenue || 0).toLocaleString()}`,
      icon: DollarSign,
      color: 'bg-green-100 text-green-600',
    },
    {
      label: 'Total Products',
      value: products.length,
      icon: Package,
      color: 'bg-blue-100 text-blue-600',
    },
    {
      label: 'Top Products',
      value: topProducts.length,
      icon: TrendingUp,
      color: 'bg-purple-100 text-purple-600',
    },
    {
      label: 'Low Stock Alerts',
      value: lowStock.length,
      icon: AlertTriangle,
      color: 'bg-red-100 text-red-600',
    },
  ]

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold text-secondary mb-8">Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, idx) => {
          const Icon = stat.icon
          return (
            <div key={idx} className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition">
              <div className={`${stat.color} w-12 h-12 rounded-lg flex items-center justify-center mb-4`}>
                <Icon className="w-6 h-6" />
              </div>
              <p className="text-gray-600 text-sm mb-2">{stat.label}</p>
              <p className="text-3xl font-bold text-secondary">{stat.value}</p>
            </div>
          )
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-bold text-secondary mb-4">Top Products</h2>
          <div className="space-y-3">
            {topProducts.slice(0, 5).map((product, idx) => (
              <div key={idx} className="flex justify-between items-center pb-3 border-b last:border-b-0">
                <span className="text-gray-700">{product.name}</span>
                <span className="font-bold text-primary">${product.price}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-bold text-secondary mb-4">Inventory Alerts</h2>
          <div className="space-y-3">
            {lowStock.length > 0 ? (
              lowStock.slice(0, 5).map((product, idx) => (
                <div key={idx} className="flex justify-between items-center pb-3 border-b last:border-b-0">
                  <span className="text-gray-700">{product.name}</span>
                  <span className="text-red-600 font-bold">{product.stock} left</span>
                </div>
              ))
            ) : (
              <p className="text-gray-500">All products have sufficient stock</p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
