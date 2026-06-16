import { initializeApp, getApps } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyAlMFiaQrnw_DXjOFkQiJSXXdZSMsmsSJk",
  authDomain: "prueba-dde32.firebaseapp.com",
  projectId: "prueba-dde32",
  storageBucket: "prueba-dde32.firebasestorage.app",
  messagingSenderId: "1046067172558",
  appId: "1:1046067172558:web:57a725db961cb44578ac9f",
  measurementId: "G-68LE4467P3"
};

// Initialize Firebase (prevent duplicate initialization in dev with HMR)
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];

export const db = getFirestore(app);
export default app;
