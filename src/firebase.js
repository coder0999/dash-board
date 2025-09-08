import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
    apiKey: "AIzaSyBvROuv4CkJyfUby87owjFAmYvpyf8UU_c",
    authDomain: "test-3054c.firebaseapp.com",
    projectId: "test-3054c",
    storageBucket: "test-3054c.firebasestorage.app",
    messagingSenderId: "536496457232",
    appId: "1:536496457232:web:ad63fed147ce0f53f92c95",
    measurementId: "G-ZHT05S70E5"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

export { db, auth, GEMINI_API_KEY, firebaseConfig };
