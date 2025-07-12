const { google } = require('googleapis');
const { OAuth2Client } = require('google-auth-library');
const fs = require('fs');
const path = require('path');

// Load environment variables
require('dotenv').config();

const TOKEN_PATH = path.join(process.env.GDRIVE_CREDS_DIR || './config', 'token.json');
const CREDENTIALS_PATH = path.join(process.env.GDRIVE_CREDS_DIR || './config', 'gcp-oauth.keys.json');

async function testConnection() {
  try {
    // Load credentials and token
    const credentials = JSON.parse(fs.readFileSync(CREDENTIALS_PATH, 'utf8'));
    const token = JSON.parse(fs.readFileSync(TOKEN_PATH, 'utf8'));
    
    const { client_secret, client_id, redirect_uris } = credentials.installed;
    const oAuth2Client = new OAuth2Client(client_id, client_secret, redirect_uris[0]);
    oAuth2Client.setCredentials(token);

    // Initialize Google Drive API
    const drive = google.drive({ version: 'v3', auth: oAuth2Client });
    
    console.log('🔍 Testing Google Drive connection...\n');

    // List files
    const res = await drive.files.list({
      pageSize: 10,
      fields: 'nextPageToken, files(id, name, mimeType, modifiedTime)',
    });

    const files = res.data.files;
    if (files.length) {
      console.log('✅ Connection successful! Found files:');
      files.forEach((file) => {
        console.log(`- ${file.name} (${file.mimeType})`);
      });
    } else {
      console.log('✅ Connection successful! No files found.');
    }

    // Test Sheets API
    const sheets = google.sheets({ version: 'v4', auth: oAuth2Client });
    console.log('\n✅ Google Sheets API is ready');

    // Test Docs API
    const docs = google.docs({ version: 'v1', auth: oAuth2Client });
    console.log('✅ Google Docs API is ready');

    console.log('\n🎉 All APIs are working correctly!');
  } catch (error) {
    console.error('❌ Error:', error.message);
    if (!fs.existsSync(TOKEN_PATH)) {
      console.log('\n⚠️  No authentication token found. Please run: node authenticate.js');
    }
  }
}

testConnection();