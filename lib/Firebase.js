// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyDf00k5SOjGC6h9av67TYN5Bouec36iEl4",
    authDomain: "practicefirebase-web.firebaseapp.com",
    projectId: "practicefirebase-web",
    storageBucket: "practicefirebase-web.firebasestorage.app",
    messagingSenderId: "948398862636",
    appId: "1:948398862636:web:db9bb2a7e05a1e406a3c89",
    measurementId: "G-L88LKVJTY5"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);

export const db = getFirestore(app);





