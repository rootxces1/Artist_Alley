// Import Firebase modules from the CDN
import { firebase_ApiKey } from "./firebase_api.js";
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getFirestore } from 'https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js';
import { getAuth } from 'https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js';

const firebaseConfig = firebase_ApiKey;

// Initialize Firebase
const firebase = initializeApp(firebaseConfig);
const auth = getAuth(firebase);
const db = getFirestore(firebase);

Notification.requestPermission().then((result) => {
    console.log('Notification permission status:', result);
});

// Export the Firebase services
export { firebase, auth, db };
