import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyCQ1M2NvWFnrhsES9P0iRBkCksxNc_4n2Q",
  authDomain: "verde-chain.firebaseapp.com",
  projectId: "verde-chain",
  storageBucket: "verde-chain.firebasestorage.app",
  messagingSenderId: "311078521873",
  appId: "1:311078521873:web:85488d89540ecb6d3035b0",
  measurementId: "G-ZT9LR7VPGH"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and Firestore
export const auth = getAuth(app);
export const db = getFirestore(app);
