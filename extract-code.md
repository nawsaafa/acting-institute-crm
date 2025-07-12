# 🔍 How to Get Your Authorization Code

When you authorized the app, one of these things happened:

## Option 1: Redirected to localhost
After clicking "Allow", you were redirected to a URL like:
```
http://localhost/?code=4/0AeanS0ZT8x9...&scope=https://www.googleapis.com/auth/drive.readonly...
```

**To get the code:**
1. Look at your browser's address bar
2. Find the `code=` parameter
3. Copy everything after `code=` until you see `&` or the URL ends
4. Example: `4/0AeanS0ZT8x9...`

## Option 2: Error page on localhost
If you saw "This site can't be reached" or similar:
1. Look at the URL anyway - it still contains the code!
2. Copy the code from the URL as described above

## Option 3: No redirect happened
If you stayed on Google's page after authorizing:
1. The OAuth app might need different settings
2. Try this direct URL:

```
https://accounts.google.com/o/oauth2/v2/auth?client_id=785753337107-0lfr6d12qd6iblurk651uoldjlkh1gf8.apps.googleusercontent.com&redirect_uri=urn:ietf:wg:oauth:2.0:oob&response_type=code&scope=https://www.googleapis.com/auth/drive.readonly%20https://www.googleapis.com/auth/spreadsheets%20https://www.googleapis.com/auth/documents.readonly&access_type=offline
```

This will show the code directly on the page.

## 📝 Once You Have the Code

Give me the authorization code and I'll complete the setup. The code usually looks like:
- `4/0AeanS0ZT...` (starts with 4/0)
- About 40-80 characters long
- Contains letters, numbers, and sometimes underscores or hyphens