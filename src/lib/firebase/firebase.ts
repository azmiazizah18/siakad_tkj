// Import the functions you need from the SDKs you need
import { initializeApp, getApps } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  "projectId": "educentral-l8ke1",
  "appId": "1:774334856106:web:011bb35027656571e989d3",
  "storageBucket": "educentral-l8ke1.firebasestorage.app",
  "apiKey": "AIzaSyAFSH_gMJBL6_fje4y9MLyS68BIdCCfq0I",
  "authDomain": "educentral-l8ke1.firebaseapp.com",
  "measurementId": "",
  "messagingSenderId": "774334856106"
};

// Initialize Firebase
let app;
if (!getApps().length) {
  app = initializeApp(firebaseConfig);
} else {
  app = getApps()[0];
}

const db = getFirestore(app);

export { app, db };
