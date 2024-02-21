import { initializeApp } from "firebase/app";
import { getFirestore } from "@firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyCyfrEZ_13gX5cF5xIXWH29cgWEStDQJHc",
  authDomain: "calendar-f50c9.firebaseapp.com",
  projectId: "calendar-f50c9",
  storageBucket: "calendar-f50c9.appspot.com",
  messagingSenderId: "338071301770",
  appId: "1:338071301770:web:a6736166d909511153c773",
};

const app = initializeApp(firebaseConfig);
export const database = getAuth(app);

export const db = getFirestore(app);
