import { useEffect, useState, useRef } from 'react'
import { useProductStore } from '../store/productStore'
import { useSalesStore } from '../store/salesStore'
import { salesAPI, productAPI } from '../services/api'
import { TrendingUp, Package, AlertTriangle, DollarSign, Store } from 'lucide-react'
import RevenueChart from '../components/RevenueChart'
import Sparkline from '../components/Sparkline'

export default function Dashboard() {
  const [loading, setLoading] = useState(true)
  const { products, setProducts } = useProductStore()
  const { revenue, setRevenue, topProducts, setTopProducts } = useSalesStore()
  const [revenueHistory, setRevenueHistory] = useState([])
  const [productHistories, setProductHistories] = useState({})
  const revenueChartRef = useRef(null)
  const [lowStock, setLowStock] = useState([])

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    try {
      const [productsRes, revenueRes, topRes, lowStockRes, salesDataRes] = await Promise.all([
        productAPI.getAll(),
        salesAPI.getRevenue(),
        salesAPI.getTopProducts(),
        salesAPI.getLowStockProducts(),
        salesAPI.getSalesData(),
      ])

      setProducts(productsRes.data)
      setRevenue(revenueRes.data.total)
      setTopProducts(topRes.data)
      setLowStock(lowStockRes.data)

      // Format revenue history for chart (salesData returns [{ _id: 'YYYY-MM-DD', revenue }])
      const hist = Array.isArray(salesDataRes.data)
        ? salesDataRes.data
            .slice()
            .reverse()
            .map((d) => ({ label: d._id, value: d.revenue }))
        : []

      setRevenueHistory(hist)

      // Fetch per-product small histories for sparklines (limit to first 6)
      const topList = topRes.data || []
      const slice = topList.slice(0, 6)
      const productHistoryPromises = slice.map((p) =>
        salesAPI.getProductHistory(p._id).then((res) => ({ id: p._id, data: res.data })).catch(() => ({ id: p._id, data: [] }))
      )

      const histories = await Promise.all(productHistoryPromises)
      const histMap = {}
      histories.forEach((h) => {
        histMap[h.id] = Array.isArray(h.data) ? h.data.map((d) => d.revenue) : []
      })
      setProductHistories(histMap)
    } catch (err) {
      console.error('Failed to load dashboard data:', err)
    } finally {
      setLoading(false)
    }
  }

  // Export CSV of revenueHistory
  const exportCSV = () => {
    const rows = [['date', 'revenue']]
    revenueHistory.forEach((r) => rows.push([r.label, r.value]))
    const csvContent = rows.map((r) => r.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(',')).join('\n')
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'revenue-30days.csv'
    a.click()
    URL.revokeObjectURL(url)
  }

  // Export PDF via print - captures chart image and table in a new window
  const exportPDF = () => {
    try {
      const chartInstance = revenueChartRef.current
      let img = null
      if (chartInstance && chartInstance.toBase64Image) {
        img = chartInstance.toBase64Image()
      } else if (chartInstance && chartInstance.chart && chartInstance.chart.toBase64Image) {
        img = chartInstance.chart.toBase64Image()
      }

      const html = `
        <html>
          <head>
            <title>Revenue (30 days)</title>
            <style>body{font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial; padding:24px;}</style>
          </head>
          <body>
            <h2>Revenue (30 days)</h2>
            ${img ? `<img src="${img}" style="max-width:720px;width:100%;height:auto;display:block;margin-bottom:16px;"/>` : ''}
            <table border="1" cellpadding="6" cellspacing="0" style="border-collapse:collapse;width:100%;max-width:720px;">
              <thead><tr><th>Date</th><th>Revenue</th></tr></thead>
              <tbody>
                ${revenueHistory.map((r) => `<tr><td>${r.label}</td><td>${r.value}</td></tr>`).join('')}
              </tbody>
            </table>
            <script>setTimeout(()=>window.print(),300)</script>
          </body>
        </html>
      `

      const w = window.open('', '_blank')
      if (!w) return alert('Popup blocked — allow popups to export PDF')
      w.document.write(html)
      w.document.close()
    } catch (e) {
      console.error('Export PDF failed', e)
      alert('Failed to export PDF')
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

  const inventoryHealth = (() => {
    const total = products.length
    const alerts = lowStock.length
    if (total === 0) return { label: 'No inventory yet', tone: 'bg-gray-100 text-gray-700', percent: '—' }
    const healthy = Math.max(total - alerts, 0)
    const percent = Math.round((healthy / total) * 100)
    if (alerts === 0) return { label: 'Healthy inventory', tone: 'bg-emerald-100 text-emerald-700', percent: `${percent}% healthy` }
    if (percent >= 70) return { label: 'Mostly healthy', tone: 'bg-blue-100 text-blue-700', percent: `${percent}% healthy` }
    return { label: 'Needs attention', tone: 'bg-amber-100 text-amber-700', percent: `${percent}% healthy` }
  })()

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
          <div className="relative">
            <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">
              SmartStore Dashboard
            </h1>
            <p className="text-gray-500 text-lg mt-2">A quick, professional snapshot of revenue and inventory.</p>

            <div className="absolute -right-12 -top-10 hidden lg:block opacity-10">
              <Store className="w-64 h-64" />
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="px-4 py-2 rounded-xl border border-gray-100 bg-white shadow-sm">
              <div className="text-xs text-gray-500 font-medium">Inventory health</div>
              <div className="mt-1 font-bold text-gray-900">{inventoryHealth.label}</div>
            </div>
            <span className={`px-3 py-2 rounded-xl text-sm font-bold shadow-sm ${inventoryHealth.tone}`}>
              {inventoryHealth.percent}
            </span>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, idx) => {
          const Icon = stat.icon
          return (
            <div
              key={idx}
              className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow duration-200"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-sm font-semibold text-gray-500 mb-1">{stat.label}</p>
                  <h3 className="text-3xl font-bold text-gray-900">{stat.value}</h3>
                </div>
                <div
                  className={`shrink-0 w-12 h-12 rounded-2xl bg-gradient-to-br ${stat.gradient} flex items-center justify-center`}
                >
                  <Icon className="w-6 h-6 text-white" />
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Revenue + Top Products (2 columns on lg) */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-6 flex items-center justify-between border-b border-gray-50 bg-gradient-to-r from-emerald-50 to-white">
              <div>
                <h3 className="text-lg font-bold text-gray-900">Revenue (30 days)</h3>
                <p className="text-sm text-gray-500 mt-1">Performance trend for the last 30 days</p>
              </div>
              <div className="flex items-center gap-3">
                <button onClick={() => exportCSV()} className="px-4 py-2 rounded-lg bg-emerald-600 text-white text-sm font-semibold shadow hover:bg-emerald-700 transition">Export CSV</button>
                <button onClick={() => exportPDF()} className="px-4 py-2 rounded-lg bg-slate-700 text-white text-sm font-semibold shadow hover:bg-slate-800 transition">Export PDF</button>
                <button className="px-3 py-2 rounded-lg border border-gray-200 bg-white text-sm">Last 30 days</button>
              </div>
            </div>
            <div className="p-6">
              <RevenueChart chartRef={revenueChartRef} data={revenueHistory.length ? revenueHistory : [
                { label: 'Day 1', value: 0 },
                { label: 'Day 7', value: revenue || 0 },
                { label: 'Day 15', value: revenue || 0 },
                { label: 'Day 23', value: revenue || 0 },
                { label: 'Day 30', value: revenue || 0 },
              ]} />
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-6 border-b border-gray-50 bg-gray-50/50">
              <div className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-blue-600" />
                <h2 className="text-xl font-bold text-gray-800">Top Selling Products</h2>
              </div>
              <p className="text-gray-500 text-sm mt-2">Based on sales count and revenue impact.</p>
            </div>

            <div className="p-6">
              <div className="space-y-4">
                {topProducts.length > 0 ? (
                  topProducts.slice(0, 7).map((product, idx) => (
                    <div
                      key={idx}
                      className="flex justify-between items-center p-4 rounded-xl hover:bg-gray-50/80 transition-colors duration-150 border border-gray-50"
                    >
                      <div className="flex items-center gap-4 min-w-0">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center text-blue-700 font-extrabold text-sm border border-blue-100">
                          #{idx + 1}
                        </div>
                        <div className="min-w-0">
                          <span className="text-gray-900 font-semibold block truncate">{product.name}</span>
                          <span className="text-gray-500 text-sm">{product.salesCount} sold</span>
                          <div className="mt-1">
                            <Sparkline values={productHistories[product._id] || []} color="#60a5fa" />
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="font-bold text-gray-900 block">${product.price}</span>
                        <span className="text-emerald-600 text-sm font-semibold">
                          +${product.revenue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </span>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-14 text-gray-500">
                    <Package className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                    <p className="font-medium">No sales data yet.</p>
                    <p className="text-sm mt-1">Once customers start purchasing, top sellers will appear here.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Inventory Alerts + Recent */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-6 border-b border-gray-50 bg-gray-50/50">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-orange-500" />
              <h2 className="text-xl font-bold text-gray-800">Inventory Alerts</h2>
            </div>
            <p className="text-gray-500 text-sm mt-2">Low-stock items that may need restocking.</p>
          </div>

          <div className="p-6">
            {lowStock.length > 0 ? (
              <div className="space-y-3">
                {lowStock.slice(0, 6).map((product, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between gap-3 p-4 rounded-xl bg-orange-50/70 border border-orange-100"
                  >
                    <div className="min-w-0">
                      <div className="flex items-center gap-3">
                        <span className="relative flex h-3 w-3">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75"></span>
                          <span className="relative inline-flex h-3 w-3 rounded-full bg-orange-500"></span>
                        </span>
                        <span className="text-gray-900 font-semibold truncate">{product.name}</span>
                      </div>
                      <div className="text-gray-600 text-sm mt-1">Current stock: <span className="font-bold">{product.stock}</span></div>
                    </div>
                    <span className="shrink-0 bg-orange-100 text-orange-800 py-1 px-3 rounded-full text-xs font-extrabold">
                      Only {product.stock} left
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-10">
                <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4 border border-emerald-200">
                  <Package className="w-8 h-8" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-1">Stock is looking good</h3>
                <p className="text-gray-500 text-sm">All your products have sufficient inventory.</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Footer hint */}
      <div className="mt-8 text-center text-sm text-gray-500">
        Tip: Keep an eye on inventory alerts and review top sellers in Sales for deeper analytics.
      </div>
    </div>
  )
}
