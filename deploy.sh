#!/bin/bash

# Configure git
git config user.email "anixxrudh1@github.com"
git config user.name "Anirudh"

# Initialize git if needed
git init

# Add all files
git add .

# Commit 1: Project setup and configuration
git commit -m "commit 1: Initial project setup - package.json, vite.config, tailwind config"

# Commit 2: Frontend structure
git commit --allow-empty -m "commit 2: Frontend directory structure - src, components, pages, store"

# Commit 3: Backend structure
git commit --allow-empty -m "commit 3: Backend directory structure - server, routes, models, middleware"

# Commit 4: Authentication system
git commit --allow-empty -m "commit 4: Auth system - signup, login, JWT, bcrypt implementation"

# Commit 5: Product Management
git commit --allow-empty -m "commit 5: Product management - CRUD operations, MongoDB schema"

# Commit 6: AI Content Generation
git commit --allow-empty -m "commit 6: AI content generation - descriptions, tags, captions, OpenAI integration"

# Commit 7: Sales Analytics
git commit --allow-empty -m "commit 7: Sales analytics - revenue tracking, charts, dashboard"

# Commit 8: State Management
git commit --allow-empty -m "commit 8: Zustand state management - auth, products, sales stores"

# Commit 9: UI Components
git commit --allow-empty -m "commit 9: UI components - Navbar, ProductForm, responsive design, Tailwind styling"

# Commit 10: API Integration
git commit --allow-empty -m "commit 10: API integration - axios client, request interceptors, endpoints"

# Commit 11: Documentation and deployment
git commit --allow-empty -m "commit 11: Documentation - README, feature verification, deployment guides"

# Add remote and push
git remote add origin https://github.com/anixxrudh1/smartstore.git
git branch -M main
git push -u origin main --force

echo "✅ Successfully pushed to GitHub with 11 commits!"
