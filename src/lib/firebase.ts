import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBmt0xTpNe4lLbPcGxRQ4HuBWZxgIve3r0",
  authDomain: "khidmanow-e6c63.firebaseapp.com",
  projectId: "khidmanow-e6c63",
  storageBucket: "khidmanow-e6c63.firebasestorage.app",
  messagingSenderId: "771104615194",
  appId: "1:771104615194:web:6fe79bf12566da60d95aa3",
  measurementId: "G-VTP3YS7VVH"
};


const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);
const db = getFirestore(app);
const googleProvider = new GoogleAuthProvider();

export { app, auth, db, googleProvider };
