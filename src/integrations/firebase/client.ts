// Firebase initialization for the web app
import { initializeApp, type FirebaseApp } from "firebase/app";
import { getFirestore, type Firestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAG0yclocQgFFZtBGSHS3whx4MaY7om2Oc",
  authDomain: "bits-cloak.firebaseapp.com",
  projectId: "bits-cloak",
  storageBucket: "bits-cloak.firebasestorage.app",
  messagingSenderId: "91495503277",
  appId: "1:91495503277:web:783fc9a7d71a11c6fcfd24",
  measurementId: "G-0NN4BVTDR0",
};

export const app: FirebaseApp = initializeApp(firebaseConfig);

export const db: Firestore = getFirestore(app);


