// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBgLBKbMYCsq-eMjnFH3xYYRw4kuU5N1jk",
  authDomain: "listings-7fe02.firebaseapp.com",
  projectId: "listings-7fe02",
  storageBucket: "listings-7fe02.appspot.com",
  messagingSenderId: "393379954993",
  appId: "1:393379954993:web:0fa7e1887e42f948a1b010",
  measurementId: "G-37LRLR4W65"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const db=getFirestore(app);
