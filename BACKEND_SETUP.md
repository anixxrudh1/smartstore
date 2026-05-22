# Backend Enhancement - MongoDB, JWT+Bcrypt, and OpenAI Integration

## 🚀 New Backend Features

### 1. **MongoDB Integration**
- Persistent data storage with Mongoose ODM
- User authentication data storage
- Product catalog management
- Sales history and analytics
- Automatic indexing for optimal queries

### 2. **Enhanced Security**
- Bcrypt password hashing (10 salt rounds)
- JWT token-based authentication
- Token expiration (7 days default)
- Input validation and sanitization
- Password comparison for login verification

### 3. **OpenAI API Integration**
- Real AI-powered product description generation
- SEO tag generation using GPT
- Marketing caption creation
- Intelligent pricing recommendations
- Sales insights and analytics

---

## 📦 Installation & Setup

### Step 1: Install Dependencies

```bash
npm install
```

New packages added:
- `mongoose` - MongoDB ODM
- `bcryptjs` - Password hashing
- `openai` - OpenAI API client
- `validator` - Input validation

### Step 2: MongoDB Setup

#### Option A: Local MongoDB

**Windows:**
1. Download MongoDB Community Edition from [mongodb.com](https://www.mongodb.com/try/download/community)
2. Install and run MongoDB
3. Default connection: `mongodb://localhost:27017`

**Mac:**
```bash
brew tap mongodb/brew
brew install mongodb-community
brew services start mongodb-community
```

**Linux (Ubuntu):**
```bash
sudo apt-get install -y mongodb
sudo systemctl start mongodb
```

#### Option B: MongoDB Atlas (Cloud)

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a free account
3. Create a cluster
4. Get connection string: `mongodb+srv://username:password@cluster.mongodb.net/smartstore`

### Step 3: Configure Environment Variables

Create `.env` file in root directory:

```bash
# Server
PORT=5000
NODE_ENV=development

# JWT Configuration
JWT_SECRET=your-very-secure-secret-key-change-in-production
JWT_EXPIRE=7d

# MongoDB
MONGODB_URI=mongodb://localhost:27017/smartstore
# For MongoDB Atlas:
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/smartstore

# OpenAI Configuration
OPENAI_API_KEY=sk-your-openai-api-key-here
OPENAI_MODEL=gpt-3.5-turbo
# Options: gpt-3.5-turbo, gpt-4, gpt-4-turbo-preview

# Frontend URL (for CORS)
FRONTEND_URL=http://localhost:5173
```

### Step 4: Get OpenAI API Key

1. Go to [OpenAI Platform](https://platform.openai.com)
2. Sign up or login
3. Navigate to API keys section
4. Create new secret key
5. Copy and paste in `.env` file

**Cost Note**: OpenAI is a paid service. Free trial credits may be available. Monitor usage to avoid unexpected charges.

### Step 5: Seed Initial Data (Optional)

Create a seeding script to populate initial data:

```bash
# Create seed script in server/scripts/seed.js
node server/scripts/seed.js
```

---

## 🏗️ Project Structure

```
server/
├── config/
│   ├── database.js          # MongoDB connection
│   └── jwt.js               # JWT configuration
├── models/
│   ├── User.js              # User schema with bcrypt
│   ├── Product.js           # Product schema
│   └── Sales.js             # Sales records schema
├── services/
│   └── aiService.js         # OpenAI integration
├── middleware/
│   └── auth.js              # Authentication logic
├── routes/
│   ├── auth.js              # Auth endpoints
│   ├── products.js          # Product CRUD
│   ├── ai.js                # AI generation
│   └── sales.js             # Sales analytics
└── index.js                 # Server entry point
```

---

## 🔐 Authentication Flow

### Signup
1. User provides: email, password, store name
2. Password hashed with bcryptjs
3. User document created in MongoDB
4. JWT token generated
5. Token returned to client

### Login
1. User provides: email, password
2. User found in database
3. Password compared with hash using bcrypt
4. Token generated and returned
5. Token stored in frontend localStorage

### Token Verification
1. Client sends token in Authorization header: `Bearer {token}`
2. Server verifies JWT signature
3. User ID extracted from token
4. Request processed with user context

---

## 📊 MongoDB Collections

### Users Collection
```javascript
{
  _id: ObjectId,
  storeName: String,
  email: String (unique, indexed),
  password: String (hashed),
  createdAt: Date,
  updatedAt: Date
}
```

### Products Collection
```javascript
{
  _id: ObjectId,
  userId: ObjectId (ref to User),
  name: String,
  description: String,
  aiDescription: String,
  price: Number,
  stock: Number,
  category: String,
  sku: String (unique, sparse),
  tags: [String],
  marketingCaption: String,
  seoKeywords: [String],
  salesCount: Number,
  revenue: Number,
  image: String (URL),
  createdAt: Date,
  updatedAt: Date
}
```

### Sales Collection
```javascript
{
  _id: ObjectId,
  userId: ObjectId (ref to User),
  productId: ObjectId (ref to Product),
  quantity: Number,
  price: Number,
  totalRevenue: Number,
  date: Date,
  createdAt: Date,
  updatedAt: Date
}
```

---

## 🤖 OpenAI Integration

### Features

#### 1. Generate Product Description
```javascript
POST /api/ai/generate-description
Body: { productId: "..." }

// Uses GPT to create compelling product descriptions
```

#### 2. Generate SEO Tags
```javascript
POST /api/ai/generate-tags
Body: { productId: "..." }

// Returns 5-7 SEO-optimized keywords
```

#### 3. Generate Marketing Caption
```javascript
POST /api/ai/generate-caption
Body: { productId: "..." }

// Creates social media-ready captions with emojis
```

#### 4. Pricing Recommendations
```javascript
POST /api/ai/generate-pricing
Body: { productId: "..." }

// Analyzes market and suggests optimal pricing
```

#### 5. Sales Insights
```javascript
POST /api/ai/generate-insights
// Returns market insights and recommendations
```

### API Response Structure

All AI endpoints return standardized responses:

```javascript
// Success
{
  description: "Generated text...",
  tags: ["tag1", "tag2", ...],
  caption: "Marketing text...",
  pricing: { recommendedPrice, bulkDiscount, ... },
  insights: { insights, trending, suggestions }
}

// Error
{
  message: "Error description"
}
```

---

## 🛠️ API Endpoints

### Authentication
```
POST   /api/auth/signup          - Register new user
POST   /api/auth/login           - Login user
GET    /api/auth/verify          - Verify token
```

### Products
```
GET    /api/products             - List user's products
GET    /api/products/:id         - Get product details
POST   /api/products             - Create product
PUT    /api/products/:id         - Update product
DELETE /api/products/:id         - Delete product
```

### AI Services
```
POST   /api/ai/generate-description  - Generate description
POST   /api/ai/generate-tags         - Generate SEO tags
POST   /api/ai/generate-caption      - Generate caption
POST   /api/ai/generate-pricing      - Get pricing insights
POST   /api/ai/generate-insights     - Get sales insights
```

### Sales & Analytics
```
GET    /api/sales/revenue        - Total & average revenue
GET    /api/sales/data           - Sales data by date
GET    /api/sales/top-products   - Top-selling products
GET    /api/sales/low-stock      - Low stock alerts
POST   /api/sales/record-sale    - Record a sale
```

---

## 🔧 Configuration

### Environment Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `PORT` | Server port | 5000 |
| `MONGODB_URI` | Database connection | mongodb://localhost:27017/smartstore |
| `JWT_SECRET` | JWT signing key | complex-random-string |
| `JWT_EXPIRE` | Token expiration | 7d |
| `OPENAI_API_KEY` | OpenAI API key | sk-... |
| `OPENAI_MODEL` | GPT model | gpt-3.5-turbo |

### JWT Configuration

Default settings:
- **Algorithm**: HS256
- **Expiration**: 7 days
- **Issued At**: Automatically set

Change in `.env`:
```
JWT_EXPIRE=14d        # 14 days
JWT_SECRET=your-secret
```

### OpenAI Models

Available models (update in `.env`):
- `gpt-3.5-turbo` - Fast, cost-effective (recommended for demo)
- `gpt-4` - More powerful, higher cost
- `gpt-4-turbo-preview` - Latest GPT-4 features

---

## 📝 Usage Examples

### Record a Sale
```bash
curl -X POST http://localhost:5000/api/sales/record-sale \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "productId": "507f1f77bcf86cd799439011",
    "quantity": 2,
    "price": 49.99
  }'
```

### Generate Product Content
```bash
curl -X POST http://localhost:5000/api/ai/generate-description \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{ "productId": "507f1f77bcf86cd799439011" }'
```

---

## 🐛 Troubleshooting

### MongoDB Connection Failed
```
Error: connect ECONNREFUSED 127.0.0.1:27017
```
**Solution**: Ensure MongoDB is running. Start with:
```bash
mongod              # Linux/Mac
mongo.exe           # Windows
```

### OpenAI API Error
```
Error: 401 Unauthorized - Invalid API Key
```
**Solution**: Check `.env` file for correct `OPENAI_API_KEY`

### JWT Token Expired
```
Error: 401 Unauthorized - Token expired
```
**Solution**: User needs to login again to get new token

### CORS Errors
```
Error: Access-Control-Allow-Origin missing
```
**Solution**: Check `cors()` middleware in `server/index.js`

---

## 🔒 Security Best Practices

### Production Checklist
- [ ] Change `JWT_SECRET` to strong random string
- [ ] Use MongoDB Atlas for production database
- [ ] Set `NODE_ENV=production`
- [ ] Enable HTTPS
- [ ] Implement rate limiting
- [ ] Add request validation
- [ ] Set up error logging
- [ ] Use environment variables for all secrets
- [ ] Implement CORS properly (restrict origins)
- [ ] Set secure headers (helmet.js)

### Password Security
- Minimum 6 characters (enforce stronger in production)
- Bcrypt hashing with 10 salt rounds
- Never log passwords
- Use HTTPS for password transmission

### API Key Management
- Never commit `.env` to Git
- Rotate OpenAI keys regularly
- Monitor API usage for suspicious activity
- Use scoped API keys with minimal permissions

---

## 📈 Performance Optimization

### Database Indexing
Automatic indexes on:
- `userId` - For user queries
- `email` - For login lookups
- `sku` - For product lookup
- `date` - For sales analytics

### Aggregation Pipeline
Sales analytics uses MongoDB aggregation for efficient queries:
```javascript
// Example: Group sales by date
db.sales.aggregate([
  { $match: { userId: ObjectId(...) } },
  { $group: { _id: "$date", revenue: { $sum: "$totalRevenue" } } }
])
```

---

## 🚀 Deployment

### Deploy to Heroku
```bash
heroku login
heroku create smartstore-api
git push heroku main
heroku config:set MONGODB_URI=mongodb+srv://...
heroku config:set OPENAI_API_KEY=sk-...
```

### Deploy to AWS/Azure/DigitalOcean
- Use MongoDB Atlas for database
- Set environment variables in deployment platform
- Use PM2 or similar for process management
- Enable auto-scaling if needed

---

## 📞 Support & Resources

- [Mongoose Docs](https://mongoosejs.com)
- [OpenAI API Docs](https://platform.openai.com/docs)
- [JWT Best Practices](https://tools.ietf.org/html/rfc7519)
- [MongoDB Manual](https://docs.mongodb.com/manual)
- [Express.js Guide](https://expressjs.com)

---

**SmartStore AI Backend - Production Ready** ✨
