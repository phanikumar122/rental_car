import dotenv from 'dotenv';
import path from 'path';
import admin from 'firebase-admin';
import nodemailer from 'nodemailer';

dotenv.config();

async function test() {
  console.log('--- Firebase Test ---');
  const projectId   = process.env['FIREBASE_PROJECT_ID'];
  const clientEmail = process.env['FIREBASE_CLIENT_EMAIL'];
  const privateKey  = process.env['FIREBASE_PRIVATE_KEY'];

  if (!projectId || !clientEmail || !privateKey) {
    console.log('❌ Missing Firebase env variables');
  } else {
    try {
      let cleanKey = privateKey;
      if (cleanKey.startsWith('"') && cleanKey.endsWith('"')) {
        try {
          cleanKey = JSON.parse(cleanKey);
        } catch {
          cleanKey = cleanKey.replace(/^"(.*)"$/, '$1').replace(/\\n/g, '\n');
        }
      } else {
        cleanKey = cleanKey.replace(/\\n/g, '\n');
      }
      console.log('Project ID:', projectId);
      console.log('Client Email:', clientEmail);
      console.log('Private Key Start:', cleanKey.substring(0, 30));
      
      admin.initializeApp({
        credential: admin.credential.cert({
          projectId,
          clientEmail,
          privateKey: cleanKey,
        }),
      });
      console.log('✅ Firebase initialized successfully!');
    } catch (err: any) {
      console.error('❌ Firebase failed:', err.message);
    }
  }

  console.log('\n--- Email Test ---');
  const user = process.env['SMTP_USER'];
  const pass = process.env['SMTP_PASS'];
  const from = process.env['SMTP_FROM'];

  if (!user || !pass) {
    console.log('❌ Missing SMTP env variables');
  } else {
    console.log('User:', user);
    console.log('Pass:', '****');
    console.log('From:', from);

    const transporter = nodemailer.createTransport({
      host:   process.env['SMTP_HOST'] || 'smtp.gmail.com',
      port:   Number(process.env['SMTP_PORT']) || 587,
      secure: false,
      auth: { user, pass },
    });

    try {
      await transporter.verify();
      console.log('✅ SMTP connection verified!');
    } catch (err: any) {
      console.error('❌ SMTP failed:', err.message);
    }
  }
}

test();
