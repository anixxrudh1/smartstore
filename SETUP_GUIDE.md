# Quick Setup Guide - MongoDB & OpenAI

## 🚀 Getting Started with Backend

### Prerequisites
- Node.js v16+ installed
- MongoDB running locally OR MongoDB Atlas account
- OpenAI API account with credits

---

## 1️⃣ MongoDB Setup

### Option A: Local MongoDB (Recommended for Development)

#### Windows
1. Download: https://www.mongodb.com/try/download/community
2. Run installer and follow setup wizard
3. MongoDB will start automatically
4. Verify: `mongosh` in terminal should connect

#### Mac
```bash
brew tap mongodb/brew
brew install mongodb-community
brew services start mongodb-community
```

#### Linux (Ubuntu/Debian)
```bash
sudo apt-get update
sudo apt-get install -y mongodb
sudo systemctl start mongodb
```

#### Docker (Easiest)
```bash
docker run -d -p 27017:27017 --name mongodb mongo:latest
```

**Test Connection:**
```bash
mongosh  # Should connect to localhost:27017
> show dbs
> exit
```

### Option B: MongoDB Atlas (Cloud - Free)

1. Go to https://www.mongodb.com/cloud/atlas
2. Sign up (free account)
3. Create a cluster (M0 tier is free)
4. Get connection string from "Connect" button
5. Format: `mongodb+srv://username:password@cluster.mongodb.net/smartstore`
6. Update `.env`:
```
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/smartstore
```

---

## 2️⃣ OpenAI API Setup

### Get Your API Key

1. Go to https://platform.openai.com/account/api-keys
2. Sign up or login to OpenAI account
3. Click "Create new secret key"
4. Copy the key (you won't see it again!)
5. Add to `.env`:
```
OPENAI_API_KEY=sk-your-copied-key-here
```

### Check Your Quota

1. Visit https://platform.openai.com/account/billing/overview
2. Check remaining credits or subscription status
3. Monitor usage to avoid unexpected charges

### Pricing (Approximate)

```
gpt-3.5-turbo:
- Input: $0.50 per 1M tokens
- Output: $1.50 per 1M tokens

gpt-4:
- Input: $30 per 1M tokens
- Output: $60 per 1M tokens
```

---

## 3️⃣ Environment Setup

### Create `.env` File

**Location**: Root directory of project

**Content:**
```bash
# Server
PORT=5000
NODE_ENV=development

# JWT
JWT_SECRET=your-secret-key-32-chars-min-change-this
JWT_EXPIRE=7d

# MongoDB
MONGODB_URI=mongodb://localhost:27017/smartstore

# OpenAI
OPENAI_API_KEY=sk-your-api-key-here
OPENAI_MODEL=gpt-3.5-turbo

# Frontend
FRONTEND_URL=http://localhost:5173
```

### Important Security Notes

⚠️ **Never commit `.env` to Git!**
- `.env` is already in `.gitignore`
- Always use environment variables for secrets
- Generate strong `JWT_SECRET` (use online generator for 32+ chars)
- Rotate API keys periodically

---

## 4️⃣ Run the Application

### Install Dependencies
```bash
npm install
```

### Start Backend Server
```bash
# Terminal 1
npm run dev-server
```

Output should show:
```
MongoDB Connected: localhost
Server running on port 5000
```

### Start Frontend Server
```bash
# Terminal 2
npm run dev
```

Output should show:
```
VITE v5.4.21  ready in 300 ms
➜  Local:   http://localhost:5173/
```

### Test the Setup

**Create a test account:**
1. Open http://localhost:5173
2. Click "Sign up"
3. Enter:
   - Store Name: "Test Store"
   - Email: "test@example.com"
   - Password: "password123"
4. Submit

**Check MongoDB:**
```bash
mongosh
> use smartstore
> db.users.findOne()
```

You should see your user document!

---

## 5️⃣ Test AI Features

### Add a Product

1. Login with your account
2. Go to "Products" → "Add Product"
3. Fill in:
   - Name: "Wireless Headphones"
   - Price: "79.99"
   - Stock: "50"
   - Category: "Electronics"
4. Click "Save Product"

### Generate Content

1. Go to "AI Content"
2. Select your product
3. Click "Generate" buttons
4. Watch AI create descriptions, tags, and captions!

---

## 🔧 Troubleshooting

### MongoDB Connection Failed
```
Error: MongooseError: Cannot connect to MongoDB
```

**Solution:**
- Check if MongoDB is running: `mongosh`
- If using Atlas, verify connection string in `.env`
- Check network firewall settings
- Ensure MongoDB user has correct permissions (Atlas)

### OpenAI API Error
```
Error: 401 Unauthorized - Invalid API Key
```

**Solution:**
- Verify `OPENAI_API_KEY` starts with `sk-`
- Check key is not expired in platform settings
- Account has available credits
- Regenerate key if needed

### Port Already in Use
```
Error: listen EADDRINUSE: address already in use :::5000
```

**Solution:**
```bash
# Find and kill process
netstat -ano | findstr :5000        # Windows
lsof -i :5000                        # Mac/Linux
kill -9 <PID>                        # Kill process
```

Or change port in `.env`:
```
PORT=5001
```

### Database Errors After Restart
```
Error: Collection already exists
```

**Solution:**
```bash
# Clear MongoDB
mongosh
> use smartstore
> db.dropDatabase()
> exit
```

---

## 📱 Common Tasks

### View Database
```bash
mongosh
> show dbs
> use smartstore
> show collections
> db.users.find()
> db.products.find()
> db.sales.find()
```

### Reset Everything
```bash
# Stop servers (Ctrl+C in terminals)
npm install  # Reinstall dependencies
rm .env      # Remove config
cp .env.example .env  # Create new config
# Update .env with credentials
npm run dev-server   # Restart
```

### Monitor API Calls
Backend logs are shown in terminal where `npm run dev-server` is running.

---

## 🚀 Next Steps

1. ✅ Install dependencies
2. ✅ Set up MongoDB
3. ✅ Get OpenAI API key
4. ✅ Configure `.env`
5. ✅ Start servers
6. ✅ Create account and test

### After Basic Setup:
- [ ] Read [BACKEND_SETUP.md](./BACKEND_SETUP.md) for detailed info
- [ ] Customize JWT_SECRET in production
- [ ] Set up MongoDB backups
- [ ] Monitor OpenAI usage
- [ ] Deploy to production server

---

## 📞 Help & Resources

- MongoDB Docs: https://docs.mongodb.com
- OpenAI Docs: https://platform.openai.com/docs
- Express.js: https://expressjs.com
- Mongoose: https://mongoosejs.com

---

**Everything set up? Start using SmartStore AI! 🎉**
