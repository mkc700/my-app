// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBdZmZ1UIvhHn9p-UKPAN-JYXfkMEEU3QM",
  authDomain: "tinder-tec.firebaseapp.com",
  projectId: "tinder-tec",
  storageBucket: "tinder-tec.firebasestorage.app",
  messagingSenderId: "569000532527",
  appId: "1:569000532527:web:1a3c009101ea841a9fc4da"
};

// Initialize Firebase
const appFirebase = initializeApp(firebaseConfig);

export default appFirebase;