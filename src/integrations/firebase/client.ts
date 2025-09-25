// Firebase initialization for the web app
import { initializeApp, type FirebaseApp } from "firebase/app";
import { getFirestore, type Firestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyD6IfMW_ejWFIvE2StPuQzWSC4Ngj9BUKY",
  authDomain: "bits-whispers.firebaseapp.com",
  projectId: "bits-whispers",
  storageBucket: "bits-whispers.firebasestorage.app",
  messagingSenderId: "792088603965",
  appId: "1:792088603965:web:c95614a147ed883ba32954",
  measurementId: "G-DNEZX9H782",
};

export const app: FirebaseApp = initializeApp(firebaseConfig);

export const db: Firestore = getFirestore(app);


