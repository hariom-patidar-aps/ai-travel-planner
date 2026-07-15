import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBX1oqi2Vjv2hRt_LCWxhBGsGyWvdu_Xbs",
  authDomain: "ai-travel-planner-63e68.firebaseapp.com",
  projectId: "ai-travel-planner-63e68",
  storageBucket: "ai-travel-planner-63e68.firebasestorage.app",
  messagingSenderId: "643811036240",
  appId: "1:643811036240:web:0e396eda0e36a304211555",
};

const app = initializeApp(firebaseConfig);

// Firebase Authentication
export const auth = getAuth(app);

// Firestore Database
export const db = getFirestore(app);

export default app;