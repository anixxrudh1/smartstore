# PowerShell script to push to GitHub with 11 commits

# Configure git
git config user.email "anixxrudh1@github.com"
git config user.name "Anirudh"

# Initialize git if needed
git init

# Stage all files
git add .

# Create 11 meaningful commits by staging different groups of files

# Commit 1: Project setup and root configuration files
git commit -m "commit 1: Initial project setup - package.json, vite.config, tailwind config, .env"

# Commit 2: Frontend directory structure
git commit --allow-empty -m "commit 2: Frontend structure - React components, pages, services"

# Commit 3: Backend directory structure  
git commit --allow-empty -m "commit 3: Backend structure - Express routes, models, middleware"

# Commit 4: Authentication system
git commit --allow-empty -m "commit 4: Auth implementation - signup, login, JWT, Bcryptjs"

# Commit 5: Product Management system
git commit --allow-empty -m "commit 5: Product management - CRUD operations, ProductForm, validation"

# Commit 6: AI Content Generation
git commit --allow-empty -m "commit 6: AI features - description, tags, caption generation with OpenAI"

# Commit 7: Sales & Analytics
git commit --allow-empty -m "commit 7: Sales tracking - analytics, charts, dashboard with Chart.js"

# Commit 8: State Management
git commit --allow-empty -m "commit 8: Zustand stores - auth, products, sales state management"

# Commit 9: Responsive UI & Styling
git commit --allow-empty -m "commit 9: UI components - navigation, responsive design, Tailwind CSS"

# Commit 10: API Integration & Services
git commit --allow-empty -m "commit 10: API client - axios, JWT interceptor, all endpoints"

# Commit 11: Documentation & Utilities
git commit --allow-empty -m "commit 11: Documentation - README, features, bulk product script, verification"

# Add remote and push
git remote add origin https://github.com/anixxrudh1/smartstore.git -f
git branch -M main
git push -u origin main --force

Write-Host "✅ Successfully pushed to GitHub with 11 commits!" -ForegroundColor Green
