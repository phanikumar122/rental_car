import fs from 'fs';
import path from 'path';

const envPath = path.join(process.cwd(), '.env');
let content = fs.readFileSync(envPath, 'utf8');

// Find the line with FIREBASE_PRIVATE_KEY
const lines = content.split('\n');
const newLines = lines.map(line => {
  if (line.startsWith('FIREBASE_PRIVATE_KEY=')) {
    let val = line.substring('FIREBASE_PRIVATE_KEY='.length);
    // Remove quotes if present
    if (val.startsWith('"') && val.endsWith('"')) {
      val = val.substring(1, val.length - 1);
    }
    // Replace \n with actual newlines
    val = val.replace(/\\n/g, '\n');
    // Wrap in quotes again but as a multiline string
    return `FIREBASE_PRIVATE_KEY="${val}"`;
  }
  return line;
});

fs.writeFileSync(envPath, newLines.join('\n'));
console.log('✅ .env file updated with real newlines for Firebase key');
