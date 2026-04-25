const admin = require('firebase-admin');
const path = require('path');
const fs = require('fs');
const bcrypt = require('bcryptjs');

// Load environment variables
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

  console.log('Fetching all users...');
  const usersSnap = await db.collection('users').get();
  
  if (usersSnap.empty) {
    console.log('No users found.');
    process.exit(0);
  }

  console.log(`Found ${usersSnap.size} users. Starting migration...`);
  
  let updatedCount = 0;
  let skippedCount = 0;

  for (const doc of usersSnap.docs) {
    const userData = doc.data();
    const password = userData.password;

    if (!password) {
      console.log(`Skipping user ${userData.username || doc.id} (no password field)`);
      skippedCount++;
      continue;
    }

    // Basic heuristic to check if password is already hashed with bcrypt
    // bcrypt hashes usually start with $2a$, $2b$, or $2y$ and are 60 characters long
    const isHashed = typeof password === 'string' && 
                     password.length === 60 && 
                     (password.startsWith('$2a$') || password.startsWith('$2b$') || password.startsWith('$2y$'));

    if (isHashed) {
      console.log(`Skipping user ${userData.username || doc.id} (already hashed)`);
      skippedCount++;
      continue;
    }

    console.log(`Hashing password for user ${userData.username || doc.id}...`);
    const hashedPassword = await bcrypt.hash(password, 10);
    
    await doc.ref.update({
      password: hashedPassword,
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
      passwordMigratedAt: admin.firestore.FieldValue.serverTimestamp()
    });

    updatedCount++;
  }

  console.log('Migration complete!');
  console.log(`Total users: ${usersSnap.size}`);
  console.log(`Updated: ${updatedCount}`);
  console.log(`Skipped: ${skippedCount}`);
  
  process.exit(0);
}

run().catch(err => {
  console.error('Migration failed:', err);
  process.exit(1);
});
