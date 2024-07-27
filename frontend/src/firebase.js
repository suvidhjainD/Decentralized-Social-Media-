// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDCvwi1q1-8UOLP4YNZaLRi9U3jBW5W-rI",
  authDomain: "web3-4ad63.firebaseapp.com",
  projectId: "web3-4ad63",
  storageBucket: "web3-4ad63.appspot.com",
  messagingSenderId: "983207448795",
  appId: "1:983207448795:web:8bf89edc7b634f5290fcfe",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const storage = getStorage(app);
