import { initializeApp } from "firebase/app";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "blog-app-mern-72e0e.firebaseapp.com",
  projectId: "blog-app-mern-72e0e",
  storageBucket: "blog-app-mern-72e0e.appspot.com",
  messagingSenderId: "949048749238",
  appId: "1:949048749238:web:6adcad80e85a54f57a4a17",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
