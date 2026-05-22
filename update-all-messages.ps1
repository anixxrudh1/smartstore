# PowerShell script to update all commit messages with unique ones

cd d:\CODES\smartstore

# Define new messages for each commit
$messages = @{
    'b9edc70' = 'Initialize React frontend with Vite build tooling and component architecture'
    'f504119' = 'Build Express.js backend with routing, middleware, and MongoDB configuration'
    '6667af7' = 'Implement user authentication using JWT tokens and Bcrypt password hashing'
    'bdb6edd' = 'Create product management module with CRUD operations and MongoDB schemas'
    'c35fa1d' = 'Integrate OpenAI API for intelligent product descriptions and marketing content'
    '472354d' = 'Develop sales analytics dashboard with revenue tracking and Chart.js visualizations'
    '45958ab' = 'Setup Zustand state management with localStorage synchronization'
    'd8d6d01' = 'Build responsive UI components using Tailwind CSS and React patterns'
    'f28e584' = 'Configure API client layer with Axios interceptors and JWT authentication'
    'ced6985' = 'Add project documentation, setup guides, and deployment instructions'
    'eefc481' = 'Deploy SmartStore AI platform with all features and production configuration'
}

Write-Host "📝 Updating commit messages..." -ForegroundColor Green

# Create filter script
$filterScript = @'
import sys
import subprocess
import os

messages = {
    'b9edc70': 'Initialize React frontend with Vite build tooling and component architecture',
    'f504119': 'Build Express.js backend with routing, middleware, and MongoDB configuration',
    '6667af7': 'Implement user authentication using JWT tokens and Bcrypt password hashing',
    'bdb6edd': 'Create product management module with CRUD operations and MongoDB schemas',
    'c35fa1d': 'Integrate OpenAI API for intelligent product descriptions and marketing content',
    '472354d': 'Develop sales analytics dashboard with revenue tracking and Chart.js visualizations',
    '45958ab': 'Setup Zustand state management with localStorage synchronization',
    'd8d6d01': 'Build responsive UI components using Tailwind CSS and React patterns',
    'f28e584': 'Configure API client layer with Axios interceptors and JWT authentication',
    'ced6985': 'Add project documentation, setup guides, and deployment instructions',
    'eefc481': 'Deploy SmartStore AI platform with all features and production configuration'
}

commit_hash = os.environ.get('GIT_COMMIT', '')
current_msg = sys.stdin.read()

if commit_hash in messages:
    sys.stdout.write(messages[commit_hash])
else:
    sys.stdout.write(current_msg)
'@

# Write Python script
$filterScript | Out-File -Encoding UTF8 filter_messages.py

# Use git filter-branch
Write-Host "Running git filter-branch..." -ForegroundColor Yellow

# Note: Using Python filter won't work directly in PowerShell, so let's use a different approach
# Let's use git rebase instead

$env:FILTER_BRANCH_SQUELCH_WARNING = 1

# For each commit from oldest to newest, update message
$commits = @(
    ('b9edc70', 'Initialize React frontend with Vite build tooling and component architecture'),
    ('f504119', 'Build Express.js backend with routing, middleware, and MongoDB configuration'),
    ('6667af7', 'Implement user authentication using JWT tokens and Bcrypt password hashing'),
    ('bdb6edd', 'Create product management module with CRUD operations and MongoDB schemas'),
    ('c35fa1d', 'Integrate OpenAI API for intelligent product descriptions and marketing content'),
    ('472354d', 'Develop sales analytics dashboard with revenue tracking and Chart.js visualizations'),
    ('45958ab', 'Setup Zustand state management with localStorage synchronization'),
    ('d8d6d01', 'Build responsive UI components using Tailwind CSS and React patterns'),
    ('f28e584', 'Configure API client layer with Axios interceptors and JWT authentication'),
    ('ced6985', 'Add project documentation, setup guides, and deployment instructions'),
    ('eefc481', 'Deploy SmartStore AI platform with all features and production configuration')
)

Write-Host "✅ Message map created. Update will be applied via git filter-branch" -ForegroundColor Green
Write-Host ""
Write-Host "Messages to update:" -ForegroundColor Cyan
foreach ($commit in $commits) {
    Write-Host "  $($commit[0]): $($commit[1])" -ForegroundColor White
}
