const admin = require('firebase-admin');
const path = require('path');
const fs = require('fs');

// Load environment variables manually if helpful, or assume they are passed/set
// Looking at the existing server.js logic:
require('dotenv').config({ path: path.join(__dirname, '../.env') });

async function run() {
  let credential;
  const envKey = process.env.FIREBASE_SERVICE_ACCOUNT;

  if (envKey) {
    try {
      const parsed = JSON.parse(envKey);
      credential = admin.credential.cert(parsed);
    } catch (e) {
      console.error('Failed to parse FIREBASE_SERVICE_ACCOUNT env var:', e);
      process.exit(1);
    }
  } else {
    // Fallback if env var is missing but file exists
    const localKeyPath = path.join(__dirname, '../serviceAccountKey.json');
    if (fs.existsSync(localKeyPath)) {
      credential = admin.credential.cert(require(localKeyPath));
    } else {
      console.error('No Firebase credentials found (env or file)');
      process.exit(1);
    }
  }

  admin.initializeApp({ credential });
  const db = admin.firestore();

  const username = 'admin';
  const password = 'admin123';

  console.log(`Checking if user '${username}' exists...`);
  const snapshot = await db.collection('users').where('username', '==', username).get();

  if (!snapshot.empty) {
    console.log(`User '${username}' already exists. Skipping creation.`);
    process.exit(0);
  }

  const bcrypt = require('bcryptjs');
  const hashedPassword = await bcrypt.hash(password, 10);

  console.log(`Creating user '${username}'...`);
  await db.collection('users').add({
    username,
    password: hashedPassword,
    role: 'admin',
    firstName: 'System',
    lastName: 'Admin',
    email: 'admin@attendict.com',
    position: 'Administrator',
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
    updatedAt: admin.firestore.FieldValue.serverTimestamp(),
  });

  console.log('Admin user created successfully!');
  process.exit(0);
}

run().catch(err => {
  console.error('Error:', err);
  process.exit(1);
});
