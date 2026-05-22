import { useEffect, useState, useRef } from 'react'
import { Line, Bar, Doughnut } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js'
import { useSalesStore } from '../store/salesStore'
import { salesAPI, aiAPI } from '../services/api'
import { TrendingUp, Lightbulb, AlertCircle, ShoppingBag, CreditCard, BarChart3, Activity, DollarSign } from 'lucide-react'

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
)

export default function Sales() {
  const { revenue, topProducts, setRevenue, setTopProducts } = useSalesStore()
  const [loading, setLoading] = useState(true)
  const [salesData, setSalesData] = useState([])
  const [insights, setInsights] = useState('')
  const [pricing, setPricing] = useState('')
  const [error, setError] = useState('')

  useEffect(() => {
    fetchSalesData()
  }, [])

  const fetchSalesData = async () => {
    try {
      const [dataRes, insightsRes, revenueRes, topProductsRes] = await Promise.all([
        salesAPI.getSalesData(),
        aiAPI.generateInsights(),
        salesAPI.getRevenue(),
        salesAPI.getTopProducts()
      ])

      const sortedData = dataRes.data.sort((a, b) => new Date(a._id) - new Date(b._id))

      setSalesData(sortedData)
      setInsights(insightsRes.data.insights)
      setPricing(insightsRes.data.suggestions ? insightsRes.data.suggestions.join(' • ') : '')
      
      // Update global store so data is always present even on hard reload
      if (revenueRes.data && revenueRes.data.total !== undefined) {
        setRevenue(revenueRes.data.total)
      }
      if (topProductsRes.data) {
        setTopProducts(topProductsRes.data)
      }
    } catch (err) {
      setError('Failed to load sales data')
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[80vh]">
        <div className="relative w-24 h-24">
          <div className="absolute inset-0 border-4 border-purple-200 rounded-full animate-ping"></div>
          <div className="absolute inset-0 border-4 border-t-purple-600 rounded-full animate-spin"></div>
        </div>
      </div>
    )
  }

  const lineChartData = {
    labels: salesData.map((d) => {
      const date = new Date(d._id)
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
    }) || ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
    datasets: [
      {
        label: 'Daily Revenue ($)',
        data: salesData.map((d) => d.revenue) || [0, 0, 0, 0, 0],
        borderColor: '#6366f1',
        backgroundColor: 'rgba(99, 102, 241, 0.2)',
        borderWidth: 3,
        pointBackgroundColor: '#fff',
        pointBorderColor: '#6366f1',
        pointBorderWidth: 2,
        pointRadius: 4,
        pointHoverRadius: 6,
        tension: 0.4,
        fill: true,
      },
    ],
  }

  const chartColors = ['#8b5cf6', '#ec4899', '#f43f5e', '#f59e0b', '#10b981', '#3b82f6'];

  const barChartData = {
    labels: topProducts.slice(0, 5).map((p) => p.name) || ['Product 1', 'Product 2'],
    datasets: [
      {
        label: 'Units Sold',
        data: topProducts.slice(0, 5).map((p) => p.salesCount) || [0, 0],
        backgroundColor: chartColors,
        borderRadius: 6,
      },
    ],
  }

  const doughnutData = {
    labels: topProducts.slice(0, 5).map((p) => p.name) || ['Category A', 'Category B'],
    datasets: [
      {
        data: topProducts.slice(0, 5).map((p) => p.revenue) || [0, 0],
        backgroundColor: chartColors,
        borderWidth: 0,
        hoverOffset: 4
      },
    ],
  }

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          padding: 20,
          font: { family: "'Inter', sans-serif", size: 12 }
        }
      },
      tooltip: {
        backgroundColor: 'rgba(17, 24, 39, 0.9)',
        titleFont: { size: 14, family: "'Inter', sans-serif" },
        bodyFont: { size: 13, family: "'Inter', sans-serif" },
        padding: 12,
        cornerRadius: 8,
        displayColors: true
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: { color: 'rgba(243, 244, 246, 1)' },
        border: { display: false }
      },
      x: {
        grid: { display: false },
        border: { display: false }
      }
    }
  }

  const doughnutOptions = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: '70%',
    plugins: {
      legend: { position: 'bottom' }
    }
  }

  const totalSales = topProducts.reduce((sum, p) => sum + p.salesCount, 0)
  const avgOrderValue = totalSales > 0 ? (revenue / totalSales).toFixed(2) : 0

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 animate-fade-in">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-4xl font-extrabold text-gray-900 mb-2 tracking-tight">Sales Analytics</h1>
          <p className="text-gray-500 text-lg">Track revenue and discover AI-powered sales insights.</p>
        </div>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex gap-3 items-center shadow-sm">
          <AlertCircle className="w-5 h-5 text-red-600" />
          <p className="text-red-700 font-medium">{error}</p>
        </div>
      )}

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-5 hover:shadow-md transition-shadow">
          <div className="w-14 h-14 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600">
            <DollarSign className="w-7 h-7" />
          </div>
          <div>
            <p className="text-gray-500 text-sm font-medium mb-1">Total Revenue</p>
            <p className="text-2xl font-bold text-gray-900">${(revenue || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-5 hover:shadow-md transition-shadow">
          <div className="w-14 h-14 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
            <ShoppingBag className="w-7 h-7" />
          </div>
          <div>
            <p className="text-gray-500 text-sm font-medium mb-1">Total Units Sold</p>
            <p className="text-2xl font-bold text-gray-900">{totalSales.toLocaleString()}</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-5 hover:shadow-md transition-shadow">
          <div className="w-14 h-14 rounded-full bg-purple-100 flex items-center justify-center text-purple-600">
            <CreditCard className="w-7 h-7" />
          </div>
          <div>
            <p className="text-gray-500 text-sm font-medium mb-1">Avg Item Value</p>
            <p className="text-2xl font-bold text-gray-900">${avgOrderValue}</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-5 hover:shadow-md transition-shadow">
          <div className="w-14 h-14 rounded-full bg-orange-100 flex items-center justify-center text-orange-600">
            <TrendingUp className="w-7 h-7" />
          </div>
          <div>
            <p className="text-gray-500 text-sm font-medium mb-1">Active Products</p>
            <p className="text-2xl font-bold text-gray-900">{topProducts.length}</p>
          </div>
        </div>
      </div>

      {/* Main Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <div className="flex items-center gap-2 mb-6">
            <Activity className="w-5 h-5 text-indigo-500" />
            <h2 className="text-xl font-bold text-gray-800">30-Day Revenue Trend</h2>
          </div>
          <div className="h-[300px]">
            <Line data={lineChartData} options={chartOptions} />
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <div className="flex items-center gap-2 mb-6">
            <BarChart3 className="w-5 h-5 text-pink-500" />
            <h2 className="text-xl font-bold text-gray-800">Top Sellers</h2>
          </div>
          <div className="h-[300px]">
            <Bar data={barChartData} options={{...chartOptions, scales: { x: { display: false }}}} />
          </div>
        </div>
      </div>

      {/* AI Insights & Doughnut */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-fuchsia-500" />
            Revenue by Product
          </h2>
          <div className="h-[250px] flex justify-center relative">
            <Doughnut data={doughnutData} options={doughnutOptions} />
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none mt-4">
              <span className="text-gray-400 text-sm font-medium">Total</span>
              <span className="text-2xl font-bold text-gray-800">${revenue > 1000 ? (revenue / 1000).toFixed(1) + 'k' : revenue}</span>
            </div>
          </div>
        </div>

        <div className="lg:col-span-2 relative rounded-2xl overflow-hidden shadow-lg">
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-900 via-purple-900 to-fuchsia-900 opacity-95"></div>
          <div className="absolute top-0 right-0 p-8 opacity-20">
            <Lightbulb className="w-48 h-48 text-white" />
          </div>
          
          <div className="relative z-10 p-8 h-full flex flex-col justify-center">
            <h2 className="text-2xl font-bold text-white flex items-center gap-3 mb-6">
              <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
                <Lightbulb className="w-6 h-6 text-yellow-300" />
              </div>
              AI Sales Insights
            </h2>

            <div className="space-y-6">
              {insights ? (
                <div className="bg-white/10 backdrop-blur-md p-5 rounded-xl border border-white/20 hover:bg-white/20 transition-colors">
                  <p className="text-blue-50 text-lg leading-relaxed">{insights}</p>
                </div>
              ) : (
                <p className="text-white/60 italic">Generating insights from your sales data...</p>
              )}

              {pricing && (
                <div className="bg-emerald-500/20 backdrop-blur-md p-5 rounded-xl border border-emerald-500/30">
                  <h3 className="font-bold text-emerald-300 mb-2 uppercase tracking-wider text-sm flex items-center gap-2">
                    <TrendingUp className="w-4 h-4" /> Recommended Actions
                  </h3>
                  <p className="text-emerald-50 leading-relaxed">{pricing}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
