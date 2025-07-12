import { OAuth2Client } from 'google-auth-library';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables
dotenv.config();

const SCOPES = [
  'https://www.googleapis.com/auth/drive.readonly',
  'https://www.googleapis.com/auth/spreadsheets',
  'https://www.googleapis.com/auth/documents.readonly'
];

const TOKEN_PATH = path.join(process.env.GDRIVE_CREDS_DIR || './config', 'token.json');
const CREDENTIALS_PATH = path.join(process.env.GDRIVE_CREDS_DIR || './config', 'gcp-oauth.keys.json');

// The authorization code from the user
const AUTH_CODE = '4/0AVMBsJhcFAm57MK1kp5BeFgKvXzKjnFx4iwYfMCXCF6lOc0ThquuiSskbxbc_haTpFYAfA';

async function completeAuth() {
  try {
    // Load client secrets
    const credentials = JSON.parse(fs.readFileSync(CREDENTIALS_PATH, 'utf8'));
    const { client_secret, client_id, redirect_uris } = credentials.installed;
    
    const oAuth2Client = new OAuth2Client(client_id, client_secret, redirect_uris[0]);

    console.log('🔐 Exchanging authorization code for token...');
    
    // Exchange code for token
    const { tokens } = await oAuth2Client.getToken(AUTH_CODE);
    oAuth2Client.setCredentials(tokens);
    
    // Store the token
    fs.writeFileSync(TOKEN_PATH, JSON.stringify(tokens));
    
    console.log('✅ Authentication successful!');
    console.log('📁 Token saved to:', TOKEN_PATH);
    console.log('🎉 Google Drive MCP server is now ready to use!');
    
    // Test the connection
    console.log('\n🧪 Testing connection...');
    const { google } = await import('googleapis');
    const drive = google.drive({ version: 'v3', auth: oAuth2Client });
    
    const res = await drive.files.list({
      pageSize: 5,
      fields: 'files(id, name, mimeType)',
    });
    
    console.log('\n📂 Found files:');
    res.data.files.forEach(file => {
      console.log(`  - ${file.name} (${file.mimeType})`);
    });
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    if (error.message.includes('invalid_grant')) {
      console.log('\n⚠️  The authorization code may have expired or already been used.');
      console.log('Please run the authorization process again.');
    }
  }
}

completeAuth();