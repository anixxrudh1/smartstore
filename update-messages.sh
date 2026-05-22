#!/bin/bash
# Script to update commit messages with unique ones

cd d:\CODES\smartstore

# Update commit 11 message
git filter-branch -f --msg-filter '
if [ "$GIT_COMMIT" = "ced6985" ]; then
  echo "commit 11: Add comprehensive documentation - README, setup guides, feature verification, and bulk product insertion script"
else
  cat
fi
' -- --all

git filter-branch -f --msg-filter '
if [ "$GIT_COMMIT" = "f28e584" ]; then
  echo "commit 10: Implement API client layer - Axios configuration, JWT interceptor, auth/product/sales/AI endpoints"
else
  cat
fi
' -- --all

git filter-branch -f --msg-filter '
if [ "$GIT_COMMIT" = "d8d6d01" ]; then
  echo "commit 9: Build responsive UI components - Navigation, ProductForm modal, Navbar, Tailwind styling"
else
  cat
fi
' -- --all

git filter-branch -f --msg-filter '
if [ "$GIT_COMMIT" = "45958ab" ]; then
  echo "commit 8: Setup Zustand state management - Create auth, product, and sales stores with localStorage persistence"
else
  cat
fi
' -- --all

git filter-branch -f --msg-filter '
if [ "$GIT_COMMIT" = "472354d" ]; then
  echo "commit 7: Develop sales analytics module - Revenue tracking, Chart.js integration, dashboard visualizations"
else
  cat
fi
' -- --all

git filter-branch -f --msg-filter '
if [ "$GIT_COMMIT" = "c35fa1d" ]; then
  echo "commit 6: Integrate OpenAI for AI content generation - Description, tags, caption, pricing, and insights endpoints"
else
  cat
fi
' -- --all

git filter-branch -f --msg-filter '
if [ "$GIT_COMMIT" = "bdb6edd" ]; then
  echo "commit 5: Implement product management system - Full CRUD operations, MongoDB schema, product form validation"
else
  cat
fi
' -- --all

git filter-branch -f --msg-filter '
if [ "$GIT_COMMIT" = "6667af7" ]; then
  echo "commit 4: Build authentication system - User signup/login, JWT token generation, Bcryptjs password hashing"
else
  cat
fi
' -- --all

git filter-branch -f --msg-filter '
if [ "$GIT_COMMIT" = "f504119" ]; then
  echo "commit 3: Create backend Express structure - Routes for auth, products, AI, sales; middleware setup"
else
  cat
fi
' -- --all

git filter-branch -f --msg-filter '
if [ "$GIT_COMMIT" = "b9edc70" ]; then
  echo "commit 2: Create frontend React/Vite structure - Component hierarchy, page layouts, CSS structure"
else
  cat
fi
' -- --all

echo "Done updating commit messages!"
