# SmartStore AI - Quick Start Guide

## 🎯 Project Overview

Your AI-powered store management platform is now fully set up! This platform enables store owners to:
- Manage products efficiently
- Generate AI-powered product descriptions, tags, and captions
- Track sales with advanced analytics
- Get AI-powered sales insights and pricing recommendations
- Monitor inventory with low-stock alerts

## 🚀 Quick Start

### Step 1: Open Two Terminals

**Terminal 1 - Frontend Server:**
```bash
npm run dev
```
✅ Runs on: http://localhost:5173

**Terminal 2 - Backend Server:**
```bash
npm run dev-server
```
✅ Runs on: http://localhost:5000

### Step 2: Access the Application

Open your browser and go to: **http://localhost:5173**

### Step 3: Login with Demo Account

```
Email: demo@example.com
Password: demo123
```

## 📋 Available Features

### 1. **Dashboard** (Home)
   - View total revenue
   - Monitor total products
   - Track top-performing products
   - Inventory alerts for low stock items

### 2. **Products** (Product Management)
   - Add new products with name, price, stock, category, SKU
   - Edit existing products
   - Delete products
   - View all products in a table format

### 3. **AI Content** (AI Generation)
   - Generate compelling product descriptions
   - Create SEO-optimized tags
   - Generate marketing captions
   - Copy generated content to clipboard

### 4. **Sales** (Analytics Dashboard)
   - View revenue trends with line charts
   - See top products with bar charts
   - Revenue distribution with doughnut charts
   - Get AI-powered sales insights
   - Receive pricing recommendations

## 🛠 Project Structure

```
smartstore/
├── src/                          # Frontend React code
│   ├── pages/
│   │   ├── auth/
│   │   │   ├── Login.jsx        # Login page
│   │   │   └── Signup.jsx       # Registration page
│   │   ├── Dashboard.jsx        # Overview dashboard
│   │   ├── Products.jsx         # Product management
│   │   ├── AIContent.jsx        # AI generation interface
│   │   └── Sales.jsx            # Analytics dashboard
│   ├── components/
│   │   ├── Navbar.jsx           # Navigation bar
│   │   └── ProductForm.jsx      # Product form modal
│   ├── store/                   # Zustand state management
│   │   ├── authStore.js
│   │   ├── productStore.js
│   │   └── salesStore.js
│   ├── services/
│   │   └── api.js               # Axios API client
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
├── server/                       # Backend Node.js code
│   ├── routes/
│   │   ├── auth.js              # Authentication routes
│   │   ├── products.js          # Product CRUD routes
│   │   ├── ai.js                # AI generation routes
│   │   └── sales.js             # Sales analytics routes
│   ├── middleware/
│   │   └── auth.js              # JWT authentication
│   └── index.js                 # Express server setup
├── package.json
├── vite.config.js
├── tailwind.config.js
└── README.md
```

## 🔐 Authentication Flow

1. **Signup**: Create a new store account
2. **Login**: Authenticate with email and password
3. **JWT Token**: Automatically stored in localStorage
4. **Protected Routes**: All dashboard pages require authentication

## 📊 Sample Data

The application comes with sample data:
- **2 Sample Products**: Wireless Headphones, USB-C Cable
- **7 Days of Sales Data**: Revenue and order tracking
- **Top Products**: Pre-populated with sample metrics

## 🤖 AI Features (Mock Implementation)

Currently, the AI features use mock data. To integrate real AI:

1. **OpenAI Integration**:
   ```javascript
   // In server/routes/ai.js
   import OpenAI from 'openai'
   
   const openai = new OpenAI({
     apiKey: process.env.OPENAI_API_KEY
   })
   ```

2. **Add to .env**:
   ```
   OPENAI_API_KEY=your-api-key-here
   ```

## 📈 Next Steps & Enhancements

### Immediate Improvements:
- [ ] Integrate real AI API (OpenAI, Anthropic, etc.)
- [ ] Add database (MongoDB, PostgreSQL)
- [ ] Implement password hashing (bcrypt)
- [ ] Add email verification
- [ ] Create product images support

### Medium-term:
- [ ] Advanced search and filtering
- [ ] Bulk product import/export (CSV)
- [ ] Customer reviews system
- [ ] Email notifications
- [ ] Export reports (PDF, Excel)

### Long-term:
- [ ] Mobile app (React Native)
- [ ] Multi-store management
- [ ] Advanced inventory forecasting
- [ ] Customer analytics
- [ ] Payment integration
- [ ] Order management system

## 🔌 API Endpoints Reference

### Auth
- `POST /api/auth/signup` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/verify` - Verify token

### Products
- `GET /api/products` - List all products
- `GET /api/products/:id` - Get single product
- `POST /api/products` - Create product
- `PUT /api/products/:id` - Update product
- `DELETE /api/products/:id` - Delete product

### AI Content
- `POST /api/ai/generate-description` - Generate description
- `POST /api/ai/generate-tags` - Generate SEO tags
- `POST /api/ai/generate-caption` - Generate caption
- `POST /api/ai/generate-pricing` - Pricing recommendations
- `POST /api/ai/generate-insights` - Sales insights

### Sales
- `GET /api/sales/revenue` - Revenue data
- `GET /api/sales/data` - Sales timeline
- `GET /api/sales/top-products` - Top products
- `GET /api/sales/low-stock` - Low stock alerts

## 🛑 Stopping the Servers

**Frontend (Terminal 1)**: `Ctrl + C`
**Backend (Terminal 2)**: `Ctrl + C`

## 📱 Tech Stack Summary

| Layer | Technology |
|-------|-----------|
| Frontend Framework | React 18 + Vite |
| Styling | Tailwind CSS |
| State Management | Zustand |
| Charts | Chart.js + React ChartJS 2 |
| HTTP Client | Axios |
| Routing | React Router v6 |
| Backend | Node.js + Express |
| Authentication | JWT |
| Icons | Lucide React |

## ⚠️ Important Notes

1. **Development Only**: Current authentication uses plain text passwords
   - Never use in production without hashing
   
2. **CORS Configuration**: Backend allows all origins
   - Restrict in production
   
3. **Mock Data**: Sales and AI responses are mocked
   - Replace with real API calls

4. **Secret Key**: Change JWT_SECRET in production
   - Use environment variables

## 🐛 Troubleshooting

**Port Already in Use?**
```bash
# Change port in vite.config.js (frontend)
# Change port in server/index.js (backend)
```

**Module Not Found?**
```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

**Build Fails?**
```bash
# Clear dist folder and rebuild
rm -rf dist
npm run build
```

## 📞 Support

For issues or feature requests, refer to the main README.md file.

---

**Happy selling with SmartStore AI! 🚀**
