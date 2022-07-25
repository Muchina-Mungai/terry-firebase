// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {getFirestore} from '@firebase/firestore';
// import { getAnalytics } from "firebase/analytics";
import {default as cfg } from 'dotenv'
cfg.config();
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
// "AIzaSyD1V7KsVUKvS5fdin7-bOowF78Uoojz4u0"
const firebaseConfig = {
  apiKey: process.env.API_KEY_FIREBASE,
  authDomain: "firm-modem-312315.firebaseapp.com",
  projectId: "firm-modem-312315",
  storageBucket: "firm-modem-312315.appspot.com",
  messagingSenderId: "787435852287",
  appId: "1:787435852287:web:5bfb706a6277cf8b8b17ca",
  measurementId: "G-L3V0JZ5K4K"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db=getFirestore(app);