import {getAuth, GoogleAuthProvider} from "firebase/auth"
import { initializeApp } from "firebase/app";

const firebaseConfig = {
  apiKey: "AIzaSyBO3q_71l3QXKsRraGLI9F-eGyBj6VON3A",
  authDomain: "loginonekart.firebaseapp.com",
  projectId: "loginonekart",
  storageBucket: "loginonekart.firebasestorage.app",
  messagingSenderId: "740554190977",
  appId: "1:740554190977:web:a7a48f2be02d0742509d80"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

export {auth, provider};