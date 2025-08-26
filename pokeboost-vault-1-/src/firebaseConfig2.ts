import { initializeApp } from 'firebase/app';
import { getDatabase } from 'firebase/database';

const firebaseConfig2 = {
  apiKey: import.meta.env.VITE_FIREBASE2_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE2_AUTH_DOMAIN,
  databaseURL: import.meta.env.VITE_FIREBASE2_DATABASE_URL,
  projectId: import.meta.env.VITE_FIREBASE2_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE2_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE2_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE2_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE2_MEASUREMENT_ID,
};

const app2 = initializeApp(firebaseConfig2, 'secondary');

export const database2 = getDatabase(app2);