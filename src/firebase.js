import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyBX1oqi2Vjv2hRt_LCWxhBGsGyWvdu_Xbs",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "ai-travel-planner-63e68.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "ai-travel-planner-63e68",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "ai-travel-planner-63e68.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "643811036240",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:643811036240:web:0e396eda0e36a304211555",
};
const app = initializeApp(firebaseConfig);
// Firebase Authentication
export const auth = getAuth(app);
// Firestore Database
export const db = getFirestore(app);
export default app;
