// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";
import { getFirestore } from "firebase/firestore";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional

const firebaseConfig = {
  apiKey: "AIzaSyCLUmwKkFtGUe1SORXjVXY1JItma6YhJEI",
  authDomain: "goit-react-native-13d86.firebaseapp.com",
  projectId: "goit-react-native-13d86",
  storageBucket: "goit-react-native-13d86.appspot.com",
  messagingSenderId: "435610938280",
  appId: "1:435610938280:web:e2c2a3034b5e4535fe4b9d",
  measurementId: "G-LQ4WWCCXQ3",
};

export const app = initializeApp(firebaseConfig);

//Init authorization
export const auth = getAuth(app);

//Init storage
export const storage = getStorage(app);

//Init Firestore database
export const db = getFirestore(app);
