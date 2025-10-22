// Import the functions you need from the SDKs you need
import { initializeApp, getApps } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBlV-av_xPsrLFi9b9vP4a6m4x4m07Ey3Y",
  authDomain: "travelly-bc87d.firebaseapp.com",
  projectId: "travelly-bc87d",
  storageBucket: "travelly-bc87d.appspot.com",
  messagingSenderId: "270887831373",
  appId: "1:270887831373:web:22d3346ec15489dd7e1904",
};

// Initialize Firebase
let app;
if (getApps().length === 0) {
  app = initializeApp(firebaseConfig);
} else {
  app = getApps()[0];
}

// Initialize Firebase Auth and Firestore
const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db, app };

