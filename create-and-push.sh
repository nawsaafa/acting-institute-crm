#!/bin/bash

# Acting Institute CRM - GitHub Repository Creation and Push Script

echo "🎭 Acting Institute CRM - GitHub Setup"
echo "====================================="
echo ""

# Check if gh CLI is available
if ! command -v gh &> /dev/null; then
    echo "❌ GitHub CLI (gh) not found. Installing..."
    curl -fsSL https://cli.github.com/packages/githubcli-archive-keyring.gpg | sudo dd of=/usr/share/keyrings/githubcli-archive-keyring.gpg
    echo "deb [arch=$(dpkg --print-architecture) signed-by=/usr/share/keyrings/githubcli-archive-keyring.gpg] https://cli.github.com/packages stable main" | sudo tee /etc/apt/sources.list.d/github-cli.list > /dev/null
    sudo apt update
    sudo apt install gh -y
fi

# Create the repository
echo "📦 Creating GitHub repository..."
gh repo create acting-institute-crm \
    --public \
    --description "Student management and payment tracking dashboard for Acting Institute" \
    --source=. \
    --remote=origin \
    --push

if [ $? -eq 0 ]; then
    echo "✅ Repository created and code pushed successfully!"
    echo ""
    echo "🔗 Repository URL: https://github.com/$(gh api user -q .login)/acting-institute-crm"
    echo ""
    echo "📋 Next Steps:"
    echo "1. Go to https://vercel.com/new"
    echo "2. Import the 'acting-institute-crm' repository"
    echo "3. Deploy with default settings"
    echo "4. Use this Anon Key when accessing the dashboard:"
    echo ""
    echo "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNxY2dubHd2bmNibHhmeXp0dnRwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTE5Mzk4NDgsImV4cCI6MjA2NzUxNTg0OH0.vBT_jVPj1u7V5BNaFFXiS_Z2JxpowWFGEtdQCt7o2WY"
    echo ""
else
    echo "❌ Failed to create repository. Trying alternative method..."
    
    # Alternative: Manual push after you create the repo
    echo ""
    echo "📝 Please create the repository manually:"
    echo "1. Go to https://github.com/new"
    echo "2. Name: acting-institute-crm"
    echo "3. Make it public"
    echo "4. Don't initialize with README"
    echo ""
    echo "Then run these commands:"
    echo ""
    echo "git remote set-url origin https://github.com/YOUR_USERNAME/acting-institute-crm.git"
    echo "git push -u origin master"
fi