import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBDwuEIuBez5guAAT0vhfKfbrxIjtJLnFo",
  authDomain: "gamerconnect-1ba25.firebaseapp.com",
  projectId: "gamerconnect-1ba25",
  storageBucket: "gamerconnect-1ba25.appspot.com",
  messagingSenderId: "1087271344342",
  appId: "1:1087271344342:web:5b2e724aa42370a7259177",
};

export const app = initializeApp(firebaseConfig);
export const storage = getStorage();
export const db = getFirestore(app);