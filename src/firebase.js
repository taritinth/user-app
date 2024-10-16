// firebase.js
import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyCjXVFc6h-s1UJ5DyUxlmnF3moIG9K6aAc",
  authDomain: "thainads-speed-dating.firebaseapp.com",
  databaseURL:
    "https://thainads-speed-dating-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "thainads-speed-dating",
  storageBucket: "thainads-speed-dating.appspot.com",
  messagingSenderId: "753163570473",
  appId: "1:753163570473:web:132c525e1875d70f3a7b38",
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);
const auth = getAuth(app);

export { db, auth };
