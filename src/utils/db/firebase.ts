import { initializeApp } from "firebase/app";
import { enableIndexedDbPersistence, getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_PROJECTID,
  storageBucket: process.env.NEXT_PUBLIC_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_MSG_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_MEASURMENT_ID,
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

enableIndexedDbPersistence(db).catch((err) => {
  console.error("Firebase persistence error:", err.code);
});

export default db;
