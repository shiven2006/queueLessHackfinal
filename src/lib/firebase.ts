
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyC-nfNuyWV8Rfi5e5GB0KZp_Kr2sih0uJM",
  authDomain: "queue-society.firebaseapp.com",
  projectId: "queue-society",
  storageBucket: "queue-society.appspot.com",
  messagingSenderId: "845592664542",
  appId: "1:845592664542:web:aa5a6c5d7118c6ae13abe9"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);

export default app;
