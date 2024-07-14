// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAkqddl3XxrPWh1Bw1PNKmXp4YewQj4uU4",
  authDomain: "fourplay-c429c.firebaseapp.com",
  databaseURL:
    "https://fourplay-c429c-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "fourplay-c429c",
  storageBucket: "fourplay-c429c.appspot.com",
  messagingSenderId: "262754524588",
  appId: "1:262754524588:web:867b8e2be45ec81396ee09",
  measurementId: "G-00FBVDBPKR",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
// const analytics = getAnalytics(app);
