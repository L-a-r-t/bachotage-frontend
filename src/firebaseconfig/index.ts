// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app"
import { getAuth } from "firebase/auth"
import { getFirestore } from "firebase/firestore"
import { getFunctions } from "firebase/functions"
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
export const firebaseConfig =
  process.env.APP_ENV == "production"
    ? {
        apiKey: "AIzaSyAEONmJg_Kq-qBI0Z4wr9zbKY0eV9SU_ZE",
        authDomain: "qoat-app.firebaseapp.com",
        projectId: "qoat-app",
        storageBucket: "qoat-app.appspot.com",
        messagingSenderId: "52019349467",
        appId: "1:52019349467:web:bd355f344391981bc6c9fe",
        measurementId: "G-BJKE2GYM03",
      }
    : {
        apiKey: "AIzaSyC-doB1uIeNe8UsZiHri1jOrtjBeidPUJg",
        authDomain: "staging-bachotage.firebaseapp.com",
        projectId: "staging-bachotage",
        storageBucket: "staging-bachotage.appspot.com",
        messagingSenderId: "905539945097",
        appId: "1:905539945097:web:caee44465bf5b46bf7fc58",
        measurementId: "G-FVJNTLXFQT",
      }

// Initialize Firebase
const app = initializeApp(firebaseConfig)
// const analytics = getAnalytics(app)
const db = getFirestore(app)
const auth = getAuth(app)
const functions = getFunctions(app)

export { auth, db, functions }
