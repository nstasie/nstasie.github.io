import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyCGN2EQzOG2re1jC-lGk6dEKytYxnPGF4c",
    authDomain: "food-order-85505.firebaseapp.com",
    projectId: "food-order-85505",
    storageBucket: "food-order-85505.firebasestorage.app",
    messagingSenderId: "837754365430",
    appId: "1:837754365430:web:48918ddbdd933af231d3d7",
    measurementId: "G-476PS9R306"
  };

// Ініціалізація Firebase
const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);