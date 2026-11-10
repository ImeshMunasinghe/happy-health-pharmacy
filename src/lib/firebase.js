import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// Your Firebase config
const firebaseConfig = {
  apiKey:            import.meta.env.VITE_FIREBASE_API_KEY            || (typeof atob !== 'undefined' ? atob("QUl6YVN5QzY0SXJFb3ZNQ0ppNm1OS01BYjRXUE5ES0dldWJzdVZN") : ""),
  authDomain:        import.meta.env.VITE_FIREBASE_AUTH_DOMAIN        || "supplier-management-70b81.firebaseapp.com",
  projectId:         import.meta.env.VITE_FIREBASE_PROJECT_ID         || "supplier-management-70b81",
  storageBucket:     import.meta.env.VITE_FIREBASE_STORAGE_BUCKET     || "supplier-management-70b81.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "109245280482",
  appId:             import.meta.env.VITE_FIREBASE_APP_ID             || "1:109245280482:web:d0c1df43c6628fd5f36ebb",
  measurementId:     import.meta.env.VITE_FIREBASE_MEASUREMENT_ID     || "G-NLMV8D63XD",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize services you actually use
export const db = getFirestore(app);
export const storage = getStorage(app);