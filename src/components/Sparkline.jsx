import React from 'react'

// Simple SVG sparkline. Accepts `values` array of numbers and optional color.
export default function Sparkline({ values = [], color = '#60a5fa' }) {
  if (!values || values.length === 0) return <div className="w-28 h-6" />

  const width = 80
  const height = 28
  const max = Math.max(...values)
  const min = Math.min(...values)
  const range = max - min || 1

  const points = values.map((v, i) => {
    const x = (i / (values.length - 1)) * width
    const y = height - ((v - min) / range) * height
    return `${x},${y}`
  }).join(' ')

  return (
    <svg className="w-20 h-6" viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="none">
      <polyline
        fill="none"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        points={points}
      />
    </svg>
  )
}
