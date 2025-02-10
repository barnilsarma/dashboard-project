// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCHoBeKj1o1NyuCOi2SLTXPVD0gyU0P81s",
  authDomain: "dashboard-auth-1288a.firebaseapp.com",
  projectId: "dashboard-auth-1288a",
  storageBucket: "dashboard-auth-1288a.firebasestorage.app",
  messagingSenderId: "885918163903",
  appId: "1:885918163903:web:e82c967558808e6575770a"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();
export { auth, provider };