# Acting Institute CRM Dashboard

A modern student management and payment tracking system for Acting Institute, built with Supabase.

## Features

- 📊 Real-time student metrics and analytics
- 💰 Payment tracking and management
- 📱 Phone number coverage monitoring
- 🔴 Urgent payment alerts
- 🎨 Beautiful, responsive UI

## Quick Start

### Option 1: Use the Live Dashboard
Visit the deployed dashboard and enter your Supabase credentials to connect.

### Option 2: Deploy Your Own

1. Fork this repository
2. Deploy to Vercel with one click:
   [![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/YOUR_USERNAME/acting-institute-crm)
3. Access your dashboard and enter your Supabase credentials

## Configuration

The dashboard requires:
- **Supabase Project URL**: Your Supabase project URL
- **Supabase Anon Key**: Your project's anonymous key (safe for client-side use)

Get these from your Supabase dashboard under Settings → API.

## Data Overview

The system currently manages:
- 94 student records
- €39,450 in pending payments
- 24 students with phone numbers (25.5% coverage)
- 17 students with pending payment amounts

## Security

- No credentials are stored in the code
- Uses Supabase Row Level Security (RLS)
- Client-side authentication with anonymous keys
- Read-only access to data

## Support

For questions or issues, please open a GitHub issue.

---

Built with ❤️ for Acting Institute by AI Consults