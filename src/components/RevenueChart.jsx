import { Line } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Filler,
  Legend,
} from 'chart.js'
import { useEffect, useState } from 'react'

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Filler, Legend)

export default function RevenueChart({ data = [], chartRef = null }) {
  const [chartData, setChartData] = useState({ labels: [], datasets: [] })

  useEffect(() => {
    const safeData = Array.isArray(data) ? data : []
    const labels = safeData.map((d) => (d && d.label ? d.label : ''))
    const values = safeData.map((d) => (d && typeof d.value === 'number' ? d.value : 0))

    setChartData({
      labels,
      datasets: [
        {
          label: 'Revenue',
          data: values,
          fill: true,
          backgroundColor: 'rgba(34,197,94,0.12)',
          borderColor: 'rgba(16,185,129,0.9)',
          tension: 0.3,
          pointRadius: 3,
          pointBackgroundColor: 'rgba(34,197,94,0.9)'
        },
      ],
    })
  }, [data])

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: { mode: 'index', intersect: false },
    },
    scales: {
      x: { grid: { display: false }, ticks: { color: '#6b7280' } },
      y: { grid: { color: '#f3f4f6' }, ticks: { color: '#6b7280' } },
    },
  }

  return (
    <div className="w-full h-56">
      <Line ref={chartRef} data={chartData} options={options} />
    </div>
  )
}
