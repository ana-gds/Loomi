import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";


const firebaseConfig = {
    apiKey: "AIzaSyDyUS2Zo65nBPEKBeCvnqnXbyulGQOT76o",
    authDomain: "loomi-c996c.firebaseapp.com",
    projectId: "loomi-c996c",
    storageBucket: "loomi-c996c.firebasestorage.app",
    messagingSenderId: "67139657828",
    appId: "1:67139657828:web:44dd774a879f6415033f71",
    measurementId: "G-76MJE5HMN7"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Auth e Firestore
const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db };

