import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: 'AIzaSyC4f3shTFohCCpYQS2Ies3QSbdY9fXEzNg',
  authDomain: 'attendict-8f7ae.firebaseapp.com',
  projectId: 'attendict-8f7ae',
  storageBucket: 'attendict-8f7ae.firebasestorage.app',
  messagingSenderId: '983312728497',
  appId: '1:983312728497:web:acd7624a6673830e027d90',
  measurementId: 'G-SP4J5LCEZV'
};

const app = initializeApp(firebaseConfig);

const db = getFirestore(app);
const storage = getStorage(app);

export { app, db, storage };
