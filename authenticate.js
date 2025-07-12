const { google } = require('googleapis');
const { OAuth2Client } = require('google-auth-library');
const fs = require('fs');
const path = require('path');
const readline = require('readline');

// Load environment variables
require('dotenv').config();

const SCOPES = [
  'https://www.googleapis.com/auth/drive.readonly',
  'https://www.googleapis.com/auth/spreadsheets',
  'https://www.googleapis.com/auth/documents.readonly'
];

const TOKEN_PATH = path.join(process.env.GDRIVE_CREDS_DIR || './config', 'token.json');
const CREDENTIALS_PATH = path.join(process.env.GDRIVE_CREDS_DIR || './config', 'gcp-oauth.keys.json');

async function authenticate() {
  try {
    // Load client secrets
    const credentials = JSON.parse(fs.readFileSync(CREDENTIALS_PATH, 'utf8'));
    const { client_secret, client_id, redirect_uris } = credentials.installed;
    
    const oAuth2Client = new OAuth2Client(client_id, client_secret, redirect_uris[0]);

    // Check if we have a token already
    if (fs.existsSync(TOKEN_PATH)) {
      const token = JSON.parse(fs.readFileSync(TOKEN_PATH, 'utf8'));
      oAuth2Client.setCredentials(token);
      console.log('✅ Already authenticated! Token found at:', TOKEN_PATH);
      return;
    }

    // Get authorization URL
    const authUrl = oAuth2Client.generateAuthUrl({
      access_type: 'offline',
      scope: SCOPES,
    });

    console.log('🔗 Authorize this app by visiting this URL:');
    console.log(authUrl);
    console.log('');
    
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });

    rl.question('Enter the code from that page here: ', async (code) => {
      rl.close();
      
      try {
        const { tokens } = await oAuth2Client.getToken(code);
        oAuth2Client.setCredentials(tokens);
        
        // Store the token
        fs.writeFileSync(TOKEN_PATH, JSON.stringify(tokens));
        console.log('✅ Token stored to', TOKEN_PATH);
        console.log('🎉 Authentication successful! You can now use the Google Drive MCP server.');
      } catch (err) {
        console.error('❌ Error retrieving access token:', err);
      }
    });
  } catch (error) {
    console.error('❌ Error during authentication:', error);
  }
}

// Run authentication
authenticate();