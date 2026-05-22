import { Link, useNavigate } from 'react-router-dom'
import { LogOut, Home, Package, Zap, TrendingUp } from 'lucide-react'
import { useAuthStore } from '../store/authStore'

export default function Navbar() {
  const navigate = useNavigate()
  const { logout, user } = useAuthStore()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <nav className="bg-secondary text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-8">
            <Link to="/" className="flex items-center gap-2 font-bold text-xl">
              <Package className="w-6 h-6 text-accent" />
              SmartStore
            </Link>
            <div className="flex gap-6">
              <Link
                to="/"
                className="flex items-center gap-2 hover:text-accent transition"
              >
                <Home className="w-4 h-4" />
                Dashboard
              </Link>
              <Link
                to="/products"
                className="flex items-center gap-2 hover:text-accent transition"
              >
                <Package className="w-4 h-4" />
                Products
              </Link>
              <Link
                to="/ai-content"
                className="flex items-center gap-2 hover:text-accent transition"
              >
                <Zap className="w-4 h-4" />
                AI Content
              </Link>
              <Link
                to="/sales"
                className="flex items-center gap-2 hover:text-accent transition"
              >
                <TrendingUp className="w-4 h-4" />
                Sales
              </Link>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm">{user?.storeName}</span>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 bg-red-600 hover:bg-red-700 px-4 py-2 rounded-lg transition"
            >
              <LogOut className="w-4 h-4" />
              Logout
            </button>
          </div>
        </div>
      </div>
    </nav>
  )
}
