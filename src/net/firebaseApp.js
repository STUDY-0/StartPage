import { initializeApp } from "firebase/app";

const firebaseConfig = {
  apiKey: "AIzaSyAtsC52zBNvuSkjU7zuvTdErBDcwbF-3QQ",
  authDomain: "study-0-c5302.firebaseapp.com",
  projectId: "study-0-c5302",
  storageBucket: "study-0-c5302.appspot.com",
  messagingSenderId: "816317935442",
  appId: "1:816317935442:web:08d0855201cbd6a82bd48b",
  measurementId: "G-QTPMEEX0J5"
};

// Initialize Firebase
const firebaseApp = initializeApp(firebaseConfig);

export default firebaseApp;
