import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

export const firebaseConfig = {
  apiKey: "AIzaSyAllsPFyXuM8f9FbfZaMBAptSIrDInsph8",
  authDomain: "localtool-2dda5.firebaseapp.com",
  projectId: "localtool-2dda5",
  storageBucket: "localtool-2dda5.firebasestorage.app",
  messagingSenderId: "265243036042",
  appId: "1:265243036042:web:6d4b4364c248a8fbcfe073",
  measurementId: "G-XKF57KYR59"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
