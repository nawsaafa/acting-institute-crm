# 🚀 Deploy to Vercel - Step by Step

## Prerequisites
- GitHub account
- Vercel account (free at vercel.com)
- Supabase Anon Key

## Step 1: Create GitHub Repository

1. Go to https://github.com/new
2. Repository name: `acting-institute-crm`
3. Description: "Student management and payment tracking dashboard"
4. Set to **Public**
5. Click "Create repository"

## Step 2: Push Code to GitHub

Run these commands in the terminal:

```bash
cd /root/ai-consults/acting-institute-crm
git remote set-url origin https://github.com/YOUR_USERNAME/acting-institute-crm.git
git push -u origin master
```

Replace `YOUR_USERNAME` with your GitHub username.

## Step 3: Deploy to Vercel

1. Go to https://vercel.com
2. Click "Add New Project"
3. Import your GitHub repository
4. Vercel will auto-detect the settings
5. Click "Deploy"

## Step 4: Access Your Dashboard

1. Vercel will give you a URL like: `acting-institute-crm.vercel.app`
2. Visit the URL
3. Enter your Supabase Anon Key:
   ```
   eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNxY2dubHd2bmNibHhmeXp0dnRwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTE5Mzk4NDgsImV4cCI6MjA2NzUxNTg0OH0.vBT_jVPj1u7V5BNaFFXiS_Z2JxpowWFGEtdQCt7o2WY
   ```
4. Click "Connect to Database"

## Custom Domain (Optional)

1. In Vercel dashboard, go to Settings → Domains
2. Add your custom domain
3. Follow DNS configuration instructions

## Environment Variables (Optional)

If you want to pre-configure the Anon Key:

1. In Vercel dashboard, go to Settings → Environment Variables
2. Add:
   - Name: `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - Value: Your anon key
3. Redeploy

## Troubleshooting

**"Connection failed" error?**
- Check if the Anon Key is copied correctly
- Verify the Acting Institute schema exists in Supabase
- Try refreshing the page

**No data showing?**
- Run this SQL in Supabase to verify:
  ```sql
  SET search_path TO acting_institute;
  SELECT COUNT(*) FROM contacts;
  ```
  Should return: 94

## Success! 

Your dashboard should now show:
- 94 students
- €39,450 in pending payments
- 17 students with pending amounts
- 70 students missing phone numbers

Focus on collecting those missing phone numbers!