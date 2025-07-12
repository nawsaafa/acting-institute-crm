import { google } from 'googleapis';
import { OAuth2Client } from 'google-auth-library';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();

const TOKEN_PATH = path.join(process.env.GDRIVE_CREDS_DIR || './config', 'token.json');
const CREDENTIALS_PATH = path.join(process.env.GDRIVE_CREDS_DIR || './config', 'gcp-oauth.keys.json');

async function searchStudentFiles() {
  try {
    // Load credentials and token
    const credentials = JSON.parse(fs.readFileSync(CREDENTIALS_PATH, 'utf8'));
    const token = JSON.parse(fs.readFileSync(TOKEN_PATH, 'utf8'));
    
    const { client_secret, client_id, redirect_uris } = credentials.installed;
    const oAuth2Client = new OAuth2Client(client_id, client_secret, redirect_uris[0]);
    oAuth2Client.setCredentials(token);

    const drive = google.drive({ version: 'v3', auth: oAuth2Client });
    
    console.log('🔍 Searching for student-related files...\n');

    // Search for files with keywords
    const searchQueries = [
      "name contains 'COMPTABILITÉ'",
      "name contains 'Acting Institute'",
      "name contains 'students'",
      "name contains 'élèves'",
      "name contains '2023'",
      "name contains '2024'",
      "mimeType = 'application/vnd.google-apps.spreadsheet'"
    ];

    for (const query of searchQueries) {
      console.log(`📋 Searching: ${query}`);
      
      try {
        const res = await drive.files.list({
          q: query,
          pageSize: 10,
          fields: 'files(id, name, mimeType, modifiedTime, webViewLink)',
        });

        if (res.data.files && res.data.files.length > 0) {
          res.data.files.forEach(file => {
            console.log(`  ✅ ${file.name}`);
            console.log(`     ID: ${file.id}`);
            console.log(`     Type: ${file.mimeType}`);
            console.log(`     Modified: ${new Date(file.modifiedTime).toLocaleDateString()}`);
            console.log(`     Link: ${file.webViewLink}`);
            console.log('');
          });
        }
      } catch (err) {
        console.log(`  ❌ Search failed: ${err.message}`);
      }
    }

  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

searchStudentFiles();