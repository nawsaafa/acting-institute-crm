const { OAuth2Client } = require('google-auth-library');
const fs = require('fs');
const path = require('path');

// Load environment variables
require('dotenv').config();

const CREDENTIALS_PATH = path.join(process.env.GDRIVE_CREDS_DIR || './config', 'gcp-oauth.keys.json');

console.log('🔍 Checking OAuth configuration...\n');

try {
    // Load credentials
    const credentials = JSON.parse(fs.readFileSync(CREDENTIALS_PATH, 'utf8'));
    const { client_secret, client_id, redirect_uris } = credentials.installed;
    
    console.log('✅ OAuth Credentials Found:');
    console.log(`   Client ID: ${client_id}`);
    console.log(`   Client Secret: ${client_secret.substring(0, 10)}...`);
    console.log(`   Redirect URIs: ${redirect_uris.join(', ')}`);
    
    const oAuth2Client = new OAuth2Client(client_id, client_secret, redirect_uris[0]);
    
    // Generate auth URL for manual process
    const SCOPES = [
        'https://www.googleapis.com/auth/drive.readonly',
        'https://www.googleapis.com/auth/spreadsheets',
        'https://www.googleapis.com/auth/documents.readonly'
    ];
    
    const authUrl = oAuth2Client.generateAuthUrl({
        access_type: 'offline',
        scope: SCOPES,
    });
    
    console.log('\n📋 Authorization URL:');
    console.log(authUrl);
    
    console.log('\n❓ Current Status:');
    console.log('   - OAuth app is configured');
    console.log('   - Waiting for authorization code');
    console.log('   - No saved token found');
    
    console.log('\n💡 Next Steps:');
    console.log('1. The user needs to visit the authorization URL');
    console.log('2. Complete the authorization flow');
    console.log('3. Copy the authorization code from the redirect URL');
    console.log('4. Run: node authenticate.js');
    console.log('5. Paste the authorization code when prompted');
    
} catch (error) {
    console.error('❌ Error:', error.message);
}