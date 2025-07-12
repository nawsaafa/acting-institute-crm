# 🔧 Fix OAuth Configuration

## The Problem
The error "redirect_uri_mismatch" means the OAuth app needs to be configured with the correct redirect URI.

## Quick Fix Steps

### 1. Go to Google Cloud Console
1. Visit: https://console.cloud.google.com
2. Select the "Acting Institute Company" project

### 2. Configure OAuth Consent Screen
1. Go to: **APIs & Services** → **OAuth consent screen**
2. Make sure it's configured with:
   - App name: Acting Institute MCP
   - User type: Internal (if using Workspace) or External
   - Add test users if needed

### 3. Update OAuth Client Settings
1. Go to: **APIs & Services** → **Credentials**
2. Click on your OAuth 2.0 Client ID
3. Under **Authorized redirect URIs**, add these URIs:
   ```
   http://localhost
   http://localhost:8080
   http://localhost:3000
   urn:ietf:wg:oauth:2.0:oob
   ```
4. Click **Save**

### 4. Alternative: Use OOB Flow
If localhost doesn't work, try this URL instead:

https://accounts.google.com/o/oauth2/v2/auth?access_type=offline&scope=https%3A%2F%2Fwww.googleapis.com%2Fauth%2Fdrive.readonly%20https%3A%2F%2Fwww.googleapis.com%2Fauth%2Fspreadsheets%20https%3A%2F%2Fwww.googleapis.com%2Fauth%2Fdocuments.readonly&response_type=code&client_id=785753337107-0lfr6d12qd6iblurk651uoldjlkh1gf8.apps.googleusercontent.com&redirect_uri=urn:ietf:wg:oauth:2.0:oob

This will display the code directly in the browser instead of redirecting.

## 🎯 What to Add in Google Cloud Console

In the OAuth 2.0 Client ID configuration, make sure you have:

### Application Type: Desktop App
### Authorized redirect URIs:
- `http://localhost`
- `http://localhost:8080`
- `http://localhost:3000`
- `urn:ietf:wg:oauth:2.0:oob`

## 📝 After Fixing

1. Try the authorization again
2. You should either:
   - Get redirected to localhost with the code in the URL
   - See the code displayed directly in the browser (if using oob)
3. Copy the code and provide it to complete setup

## 🔍 To Check Current Settings

1. Go to: https://console.cloud.google.com/apis/credentials
2. Look for your OAuth 2.0 Client ID
3. Click on it to see current redirect URIs
4. Add any missing URIs from the list above