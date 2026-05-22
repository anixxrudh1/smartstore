# SmartStore - AI-Powered Store Management Platform

An intelligent e-commerce platform for store owners to manage products and leverage AI for generating descriptions, tags, and sales insights.

## 🌟 Features

### 🔐 User Authentication
- Secure signup and login
- JWT-based authentication
- Session persistence

### 📦 Product Management
- Add, edit, and delete products
- Organize by categories
- Track inventory levels
- SKU management

### 🤖 AI Content Generation
- **AI Product Descriptions**: Automatically generate compelling product descriptions
- **SEO Tags**: Generate relevant tags for better search visibility
- **Marketing Captions**: Create engaging captions for social media

### 📊 Sales Dashboard
- Revenue analytics with charts
- Top-performing products
- Sales trends visualization
- Revenue distribution

### 💡 AI Sales Suggestions
- Pricing recommendations based on market analysis
- Trending product insights
- Sales optimization suggestions
- Inventory alerts for low stock

## 🚀 Getting Started

### Prerequisites
- Node.js (v16+)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd smartstore
```

2. Install dependencies:
```bash
npm install
```

3. Create environment file:
```bash
cp .env.example .env
```

4. **Configure Backend** (IMPORTANT):
   - Set up MongoDB (local or Atlas): `MONGODB_URI`
   - Get OpenAI API key: `OPENAI_API_KEY`
   - Set secure JWT secret: `JWT_SECRET`
   
   See [BACKEND_SETUP.md](./BACKEND_SETUP.md) for detailed setup instructions

### Running the Application

**Option 1: Run frontend and backend separately**

Terminal 1 - Frontend:
```bash
npm run dev
```

Terminal 2 - Backend:
```bash
npm run dev-server
```

**Option 2: Run both concurrently**
```bash
npm run dev:all
```

The application will be available at:
- Frontend: http://localhost:5173
- Backend: http://localhost:5000

### Demo Credentials

```
Email: demo@example.com
Password: demo123
```

## 📁 Project Structure

```
smartstore/
├── src/
│   ├── pages/
│   │   ├── auth/
│   │   │   ├── Login.jsx
│   │   │   └── Signup.jsx
│   │   ├── Dashboard.jsx
│   │   ├── Products.jsx
│   │   ├── AIContent.jsx
│   │   └── Sales.jsx
│   ├── components/
│   │   ├── Navbar.jsx
│   │   └── ProductForm.jsx
│   ├── store/
│   │   ├── authStore.js
│   │   ├── productStore.js
│   │   └── salesStore.js
│   ├── services/
│   │   └── api.js
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
├── server/
│   ├── middleware/
│   │   └── auth.js
│   ├── routes/
│   │   ├── auth.js
│   │   ├── products.js
│   │   ├── ai.js
│   │   └── sales.js
│   └── index.js
├── index.html
├── vite.config.js
├── tailwind.config.js
├── postcss.config.js
└── package.json
```

## 🛠 Technology Stack

### Frontend
- **React 18**: UI library
- **Vite**: Build tool and dev server
- **React Router**: Client-side routing
- **Tailwind CSS**: Styling
- **Chart.js**: Data visualization
- **Zustand**: State management
- **Lucide React**: Icon library
- **Axios**: HTTP client

### Backend
- **Node.js**: Runtime
- **Express**: Web framework
- **MongoDB**: NoSQL database
- **Mongoose**: ODM
- **JWT**: Authentication
- **Bcryptjs**: Password hashing
- **OpenAI**: AI API for content generation
- **CORS**: Cross-origin support

## 📚 API Endpoints

### Authentication
- `POST /api/auth/signup` - Create new account
- `POST /api/auth/login` - Login user
- `GET /api/auth/verify` - Verify token

### Products
- `GET /api/products` - Get all products
- `GET /api/products/:id` - Get product by ID
- `POST /api/products` - Create product
- `PUT /api/products/:id` - Update product
- `DELETE /api/products/:id` - Delete product

### AI Content
- `POST /api/ai/generate-description` - Generate product description
- `POST /api/ai/generate-tags` - Generate SEO tags
- `POST /api/ai/generate-caption` - Generate marketing caption
- `POST /api/ai/generate-pricing` - Generate pricing recommendations
- `POST /api/ai/generate-insights` - Generate sales insights

### Sales
- `GET /api/sales/revenue` - Get revenue data
- `GET /api/sales/data` - Get sales data
- `GET /api/sales/top-products` - Get top products
- `GET /api/sales/low-stock` - Get low stock alerts

## 🎨 UI Components

- **Navbar**: Navigation with links to all sections
- **ProductForm**: Modal form for adding/editing products
- **Dashboard**: Overview with key metrics
- **Products**: Table with CRUD operations
- **AIContent**: AI generation interface with copy-to-clipboard
- **Sales**: Analytics dashboard with charts

## 🚀 Future Enhancements

- [ ] Integration with real AI APIs (OpenAI, Anthropic)
- [ ] Advanced analytics and reporting
- [ ] Multi-store support
- [ ] Inventory management system
- [ ] Customer reviews and ratings
- [ ] Email notifications
- [ ] Mobile app
- [ ] Advanced search and filtering
- [ ] Bulk product import/export
- [ ] Customer management

## 🔒 Security Notes

- Replace `JWT_SECRET` in production
- Implement proper password hashing (bcrypt)
- Add rate limiting
- Implement HTTPS
- Add input validation and sanitization
- Use environment variables for sensitive data

## 📝 License

This project is licensed under the MIT License.

## 💬 Support

For issues or questions, please create an issue in the repository.

---

**Made with ❤️ for store owners**
