#!/bin/bash
# Script to update all commit messages

cd /d/CODES/smartstore

export FILTER_BRANCH_SQUELCH_WARNING=1

# Update commit messages
git filter-branch -f --msg-filter 'sed \
  -e "s/^commit 2: Frontend structure.*$/Initialize React frontend with Vite build tooling and component architecture/" \
  -e "s/^commit 3: Backend structure.*$/Build Express.js backend with routing, middleware, and MongoDB configuration/" \
  -e "s/^commit 4: Auth implementation.*$/Implement user authentication using JWT tokens and Bcrypt password hashing/" \
  -e "s/^commit 5: Product management.*$/Create product management module with CRUD operations and MongoDB schemas/" \
  -e "s/^commit 6: AI features.*$/Integrate OpenAI API for intelligent product descriptions and marketing content/" \
  -e "s/^commit 7: Sales tracking.*$/Develop sales analytics dashboard with revenue tracking and Chart.js visualizations/" \
  -e "s/^commit 8: Zustand stores.*$/Setup Zustand state management with localStorage synchronization/" \
  -e "s/^commit 9: UI components.*$/Build responsive UI components using Tailwind CSS and React patterns/" \
  -e "s/^commit 10: API client.*$/Configure API client layer with Axios interceptors and JWT authentication/" \
  -e "s/^commit 11: Documentation.*$/Add project documentation, setup guides, and deployment instructions/" \
' -- --all

echo "✅ Commit messages updated!"
git log --oneline -12
