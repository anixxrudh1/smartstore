import { useEffect, useState } from 'react'
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
} from 'chart.js'
import { useSalesStore } from '../store/salesStore'
import { salesAPI, aiAPI } from '../services/api'
import { TrendingUp, Lightbulb, AlertCircle } from 'lucide-react'

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
)

export default function Sales() {
  const { revenue, topProducts } = useSalesStore()
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
      const [dataRes, insightsRes] = await Promise.all([
        salesAPI.getSalesData(),
        aiAPI.generateInsights({ topProducts }),
      ])

      setSalesData(dataRes.data)
      setInsights(insightsRes.data.insights)
      setPricing(insightsRes.data.pricing)
    } catch (err) {
      setError('Failed to load sales data')
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-gray-500">Loading sales data...</div>
      </div>
    )
  }

  const lineChartData = {
    labels: salesData.map((d) => d.date) || ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
    datasets: [
      {
        label: 'Daily Revenue',
        data: salesData.map((d) => d.revenue) || [0, 0, 0, 0, 0],
        borderColor: '#3b82f6',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        tension: 0.4,
        fill: true,
      },
    ],
  }

  const barChartData = {
    labels: topProducts.slice(0, 5).map((p) => p.name) || ['Product 1', 'Product 2'],
    datasets: [
      {
        label: 'Sales Count',
        data: topProducts.slice(0, 5).map((p) => p.sales) || [0, 0],
        backgroundColor: ['#3b82f6', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981'],
      },
    ],
  }

  const doughnutData = {
    labels: topProducts.slice(0, 4).map((p) => p.name) || ['Category A', 'Category B'],
    datasets: [
      {
        data: topProducts.slice(0, 4).map((p) => p.revenue) || [0, 0],
        backgroundColor: ['#3b82f6', '#8b5cf6', '#ec4899', '#f59e0b'],
      },
    ],
  }

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: true,
    plugins: {
      legend: {
        position: 'bottom',
      },
    },
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold text-secondary mb-2">Sales Analytics</h1>
      <p className="text-gray-600 mb-8">Track revenue and get AI-powered sales insights</p>

      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg flex gap-2 items-center">
          <AlertCircle className="w-5 h-5 text-red-600" />
          <p className="text-red-700">{error}</p>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-white p-6 rounded-lg shadow">
          <p className="text-gray-600 text-sm mb-2">Total Revenue</p>
          <p className="text-3xl font-bold text-primary">${(revenue || 0).toLocaleString()}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <p className="text-gray-600 text-sm mb-2">Top Products</p>
          <p className="text-3xl font-bold text-purple-600">{topProducts.length}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <p className="text-gray-600 text-sm mb-2">Avg Order Value</p>
          <p className="text-3xl font-bold text-green-600">
            ${topProducts.length > 0 ? (revenue / topProducts.length).toFixed(2) : 0}
          </p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <p className="text-gray-600 text-sm mb-2">Total Sales</p>
          <p className="text-3xl font-bold text-orange-600">
            {topProducts.reduce((sum, p) => sum + p.sales, 0)}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-bold text-secondary mb-4">Revenue Trend</h2>
          <Line data={lineChartData} options={chartOptions} />
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-bold text-secondary mb-4">Top Products Sales</h2>
          <Bar data={barChartData} options={chartOptions} />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-bold text-secondary mb-4 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-accent" />
            Revenue Distribution
          </h2>
          <div className="flex justify-center">
            <Doughnut data={doughnutData} options={chartOptions} />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow space-y-4">
          <h2 className="text-xl font-bold text-secondary flex items-center gap-2">
            <Lightbulb className="w-5 h-5 text-accent" />
            AI Sales Insights
          </h2>

          {insights && (
            <div className="bg-blue-50 p-4 rounded-lg border-l-4 border-blue-500">
              <p className="text-gray-700 text-sm">{insights}</p>
            </div>
          )}

          {pricing && (
            <div className="bg-green-50 p-4 rounded-lg border-l-4 border-green-500">
              <h3 className="font-bold text-green-900 mb-2">Pricing Recommendations</h3>
              <p className="text-gray-700 text-sm">{pricing}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
