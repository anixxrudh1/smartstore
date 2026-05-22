@echo off
REM Script to update commit messages

cd /d d:\CODES\smartstore

REM Create a temporary directory for message mapping
setlocal enabledelayedexpansion

echo Starting commit message updates...

REM Use git filter-branch with conditional message replacement
set "FILTER_BRANCH_SQUELCH_WARNING=1"

REM Message mapping - old to new
set "msg1=commit 2: Frontend structure - React components, pages, services"
set "newmsg1=Feat(frontend): Initialize React with Vite, Tailwind CSS, and routing structure"

set "msg2=commit 3: Backend structure - Express routes, models, middleware"
set "newmsg2=Feat(backend): Setup Express.js server with middleware and route handlers"

set "msg3=commit 4: Auth implementation - signup, login, JWT, Bcryptjs"
set "newmsg3=Feat(auth): Implement secure authentication with JWT and password hashing"

set "msg4=commit 5: Product management - CRUD operations, ProductForm, validation"
set "newmsg4=Feat(products): Build product management system with full CRUD operations"

set "msg5=commit 6: AI features - description, tags, caption generation with OpenAI"
set "newmsg5=Feat(ai): Integrate OpenAI API for content generation and product insights"

set "msg6=commit 7: Sales tracking - analytics, charts, dashboard with Chart.js"
set "newmsg6=Feat(analytics): Add sales tracking and visualization with Chart.js"

set "msg7=commit 8: Zustand stores - auth, products, sales state management"
set "newmsg7=Feat(state): Implement Zustand stores for global state management"

set "msg8=commit 9: UI components - navigation, responsive design, Tailwind CSS"
set "newmsg8=Feat(ui): Build responsive UI components and navigation system"

set "msg9=commit 10: API client - axios, JWT interceptor, all endpoints"
set "newmsg9=Feat(api): Create API client layer with request interceptors"

set "msg10=commit 11: Documentation - README, features, bulk product script, verification"
set "newmsg10=Docs: Add comprehensive documentation and deployment guides"

echo ✓ Commit messages ready for update
echo Run: git filter-branch -f --msg-filter 'sed ...' -- --all
