import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { initializeAppCheck, ReCaptchaV3Provider } from "firebase/app-check";

// TODO: Replace with your actual Firebase project configuration
const firebaseConfig = {
  apiKey: "AIzaSyBOGV8mG0A_QzDQ_q2DtwaDE6UilYjSgJQ",
  authDomain: "xinlong-d2.firebaseapp.com",
  projectId: "xinlong-d2",
  storageBucket: "xinlong-d2.firebasestorage.app",
  messagingSenderId: "132162351467",
  appId: "1:132162351467:web:ab007fec08845fad4f1c2e",
  measurementId: "G-9QYF7YEC7J",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize App Check
initializeAppCheck(app, {
  provider: new ReCaptchaV3Provider("6LdYro4rAAAAABcgjLMXMElT9M-yuBhgQpqGuenq"),
  isTokenAutoRefreshEnabled: true,
});

// Initialize Cloud Firestore and get a reference to the service
const db = getFirestore(app);

// Initialize Firebase Authentication and get a reference to the service
const auth = getAuth(app);

export { db, auth };
