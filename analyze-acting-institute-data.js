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

// Files to analyze
const FILES_TO_ANALYZE = [
  { id: '1io6CEbcysLe5686GBTpUJQFw7i-_1-agjx-7lduQH_Y', name: 'LISTE ACTING INSTITUTE' },
  { id: '1y7vVCrVQ-8D55pnVJehFDL-AU_giu9PTDGQqlm0-hP4', name: 'COMPTABILITÉ 2023' },
  { id: '1hgL1dCyOwwHgGvkuafhvl24Ef-jKnRLO2gFxaufRO1Q', name: 'Acting Institute Financial Tracker' },
  { id: '1kLvPi_Q9C8mQ4r66b6ehHufR1F6xpYL7-bkGtRjDx3s', name: 'INSCRIPTIONS 2024-2025 (réponses)' },
  { id: '1uDMzlS12jMP0jVQid36pbr7vxoUaAU-u7Ki_E3ewDHs', name: 'COMPTABILITÉ 24-25' },
  { id: '1FH0dbG81-7UkNa_pMhT_qn7Gji32vaqmk1HaJC1A4pE', name: 'COMPTA 2025' },
  { id: '15w9neuA5FKkY6JeqNj8i-H7BJwHqpJ3DN7Aic_AY8vY', name: 'Rencontre - Histoires de talents (réponses)' },
  { id: '17yArSpw-omX3If5uU-Z5VNsbZnqiambZ0EUFpobgtBY', name: 'COURS' }
];

// Forms to analyze
const FORMS_TO_ANALYZE = [
  { id: '11L2fb9uBBZef1yRLsHC0C8sBSBsibhYxLxfybzAhCmU', name: 'SARAB IF - ACTING INSTITUTE' },
  { id: '1JrmmWXJYFXJ4GxZuKRSe1UnVhD78rAVmHUvEsjEUPMY', name: 'INSCRIPTIONS 2024-2025' },
  { id: '13sIlfTyC4XVFA-3Zh4yuhJf32Nt4XrMnHhyGbPZbfGU', name: 'LISTE ACTING INSTITUTE (form)' },
  { id: '12_qP4gNIkxEgaRQ6ut8KI7fGeRi1WMr8Fi0uKaqrmzA', name: 'CASTING 2024-2025' }
];

async function analyzeActingInstituteData() {
  try {
    // Load credentials and token
    const credentials = JSON.parse(fs.readFileSync(CREDENTIALS_PATH, 'utf8'));
    const token = JSON.parse(fs.readFileSync(TOKEN_PATH, 'utf8'));
    
    const { client_secret, client_id, redirect_uris } = credentials.installed;
    const oAuth2Client = new OAuth2Client(client_id, client_secret, redirect_uris[0]);
    oAuth2Client.setCredentials(token);

    const drive = google.drive({ version: 'v3', auth: oAuth2Client });
    const sheets = google.sheets({ version: 'v4', auth: oAuth2Client });
    const forms = google.forms({ version: 'v1', auth: oAuth2Client });
    
    console.log('🎭 ACTING INSTITUTE DATA ANALYSIS\n');
    console.log('=' .repeat(80));
    
    const analysisResults = {
      sheets: [],
      forms: [],
      relationships: [],
      entities: new Set(),
      metrics: {}
    };

    // Analyze each spreadsheet
    console.log('\n📊 ANALYZING SPREADSHEETS\n');
    
    for (const file of FILES_TO_ANALYZE) {
      console.log(`\n📄 Analyzing: ${file.name}`);
      console.log('-'.repeat(60));
      
      try {
        // Get spreadsheet metadata
        const spreadsheet = await sheets.spreadsheets.get({
          spreadsheetId: file.id,
          includeGridData: false
        });
        
        const sheetAnalysis = {
          name: file.name,
          id: file.id,
          sheets: [],
          totalRows: 0,
          totalColumns: 0,
          lastModified: spreadsheet.data.properties.timeZone
        };
        
        console.log(`📋 Sheets in workbook: ${spreadsheet.data.sheets.length}`);
        
        // Analyze each sheet
        for (const sheet of spreadsheet.data.sheets) {
          const sheetName = sheet.properties.title;
          const sheetId = sheet.properties.sheetId;
          
          console.log(`\n  🔍 Sheet: ${sheetName}`);
          
          try {
            // Get data from the sheet
            const range = `${sheetName}!A1:Z100`; // Get first 100 rows
            const response = await sheets.spreadsheets.values.get({
              spreadsheetId: file.id,
              range: range,
            });
            
            const values = response.data.values || [];
            
            if (values.length > 0) {
              const headers = values[0];
              const dataRows = values.slice(1);
              
              console.log(`     Headers: ${headers.join(', ')}`);
              console.log(`     Data rows: ${dataRows.length}`);
              console.log(`     Columns: ${headers.length}`);
              
              // Analyze data types and patterns
              const columnAnalysis = headers.map((header, idx) => {
                const columnData = dataRows.map(row => row[idx]).filter(v => v);
                const sampleValues = columnData.slice(0, 5);
                
                return {
                  name: header,
                  nonEmptyCount: columnData.length,
                  sampleValues: sampleValues,
                  hasEmail: columnData.some(v => v && v.includes('@')),
                  hasPhone: columnData.some(v => v && /^\+?\d{9,}$/.test(v.replace(/\s/g, ''))),
                  hasAmount: columnData.some(v => v && /^\d+([.,]\d+)?$/.test(v.toString())),
                  hasDate: columnData.some(v => v && /\d{1,2}[/-]\d{1,2}[/-]\d{2,4}/.test(v))
                };
              });
              
              sheetAnalysis.sheets.push({
                name: sheetName,
                headers: headers,
                rowCount: dataRows.length,
                columnCount: headers.length,
                columnAnalysis: columnAnalysis
              });
              
              sheetAnalysis.totalRows += dataRows.length;
              sheetAnalysis.totalColumns = Math.max(sheetAnalysis.totalColumns, headers.length);
              
              // Identify entities
              headers.forEach(header => {
                const normalized = header.toLowerCase();
                if (normalized.includes('nom') || normalized.includes('name')) {
                  analysisResults.entities.add('students');
                }
                if (normalized.includes('cours') || normalized.includes('course')) {
                  analysisResults.entities.add('courses');
                }
                if (normalized.includes('payment') || normalized.includes('montant') || normalized.includes('amount')) {
                  analysisResults.entities.add('payments');
                }
                if (normalized.includes('prof') || normalized.includes('teacher')) {
                  analysisResults.entities.add('teachers');
                }
              });
            }
          } catch (err) {
            console.log(`     ⚠️  Error reading sheet: ${err.message}`);
          }
        }
        
        analysisResults.sheets.push(sheetAnalysis);
        
      } catch (err) {
        console.log(`❌ Error analyzing spreadsheet: ${err.message}`);
      }
    }
    
    // Analyze forms
    console.log('\n\n📝 ANALYZING FORMS\n');
    
    for (const form of FORMS_TO_ANALYZE) {
      console.log(`\n📋 Analyzing form: ${form.name}`);
      console.log('-'.repeat(60));
      
      try {
        const formData = await forms.forms.get({
          formId: form.id
        });
        
        const formAnalysis = {
          name: form.name,
          id: form.id,
          title: formData.data.info.title,
          description: formData.data.info.description,
          questions: [],
          responseSheet: formData.data.linkedSheetId
        };
        
        console.log(`   Title: ${formData.data.info.title}`);
        console.log(`   Questions: ${formData.data.items?.length || 0}`);
        
        if (formData.data.items) {
          formData.data.items.forEach((item, idx) => {
            if (item.title) {
              console.log(`   Q${idx + 1}: ${item.title}`);
              formAnalysis.questions.push({
                title: item.title,
                type: item.questionItem?.question?.required ? 'required' : 'optional',
                questionType: Object.keys(item.questionItem?.question || {})[0]
              });
            }
          });
        }
        
        analysisResults.forms.push(formAnalysis);
        
      } catch (err) {
        console.log(`   ⚠️  Error analyzing form: ${err.message}`);
      }
    }
    
    // Generate comprehensive report
    console.log('\n\n📊 ANALYSIS SUMMARY');
    console.log('='.repeat(80));
    
    console.log('\n🏢 Identified Entities:');
    analysisResults.entities.forEach(entity => {
      console.log(`   - ${entity}`);
    });
    
    console.log('\n📈 Key Metrics:');
    let totalStudents = 0;
    let totalPaymentRecords = 0;
    
    analysisResults.sheets.forEach(sheet => {
      if (sheet.name.includes('LISTE') || sheet.name.includes('INSCRIPTIONS')) {
        totalStudents += sheet.totalRows;
      }
      if (sheet.name.includes('COMPT')) {
        totalPaymentRecords += sheet.totalRows;
      }
    });
    
    console.log(`   - Total student records across sheets: ~${totalStudents}`);
    console.log(`   - Total payment records: ~${totalPaymentRecords}`);
    console.log(`   - Active forms: ${analysisResults.forms.length}`);
    
    // Save detailed analysis
    const reportPath = path.join(__dirname, 'acting-institute-analysis.json');
    fs.writeFileSync(reportPath, JSON.stringify(analysisResults, null, 2));
    console.log(`\n💾 Detailed analysis saved to: ${reportPath}`);
    
    return analysisResults;
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

// Run the analysis
analyzeActingInstituteData();