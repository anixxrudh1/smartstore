import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { authAPI, adminAPI } from '../services/api'
import { useAuthStore } from '../store/authStore'

export default function Landing() {
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()
  const { login } = useAuthStore()

  const handleDemo = async () => {
    setLoading(true)
    try {
      const res = await authAPI.login('demo@example.com', 'password123')
      const { user, token } = res.data
      login(user, token)
      navigate('/')
    } catch (err) {
      alert('Demo login failed')
    } finally {
      setLoading(false)
    }
  }

  const handleSeed = async () => {
    if (!confirm('This will populate demo data in the database. Continue?')) return
    setLoading(true)
    try {
      await adminAPI.seedDemo()
      alert('Demo data populated. Logging into demo account...')
      await handleDemo()
    } catch (err) {
      alert('Seeding failed: ' + (err.response?.data?.message || err.message))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary to-secondary">
      <div className="max-w-4xl mx-auto p-8 bg-white rounded-2xl shadow-lg flex flex-col md:flex-row gap-8 items-center">
        <div className="flex-1">
          <h1 className="text-4xl font-extrabold text-gray-900 mb-4">SmartStore</h1>
          <p className="text-gray-600 mb-6">An AI-powered product management demo. Populate demo data, explore analytics, and try features quickly.</p>
          <div className="flex gap-3">
            <button onClick={handleDemo} disabled={loading} className="px-4 py-2 bg-emerald-600 text-white rounded-lg">Use Demo Account</button>
            <button onClick={handleSeed} disabled={loading} className="px-4 py-2 border border-gray-200 rounded-lg">Populate Demo</button>
            <a href="/signup" className="px-4 py-2 border border-gray-200 rounded-lg">Sign up</a>
          </div>
        </div>
        <div className="w-80 grid grid-cols-1 gap-3">
          <img loading="lazy" src="/src/assets/hero-1.jpg" alt="hero product 1" className="rounded-lg w-full h-40 object-cover shadow" />
          <img loading="lazy" src="/src/assets/hero-2.jpg" alt="hero product 2" className="rounded-lg w-full h-40 object-cover shadow" />
        </div>
      </div>
    </div>
  )
}
