// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.1/firebase-app.js";
import { getDatabase, set, ref, update } from "https://www.gstatic.com/firebasejs/9.22.1/firebase-database.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword,onAuthStateChanged,signOut,sendEmailVerification } from "https://www.gstatic.com/firebasejs/9.22.1/firebase-auth.js";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
      
// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyCbxLdLqlUU5odWaPSAU5kQXzlPacm40ig",
    authDomain: "login-with-firebase-data-cfd71.firebaseapp.com",
    databaseURL: "https://login-with-firebase-data-cfd71-default-rtdb.europe-west1.firebasedatabase.app",
    projectId: "login-with-firebase-data-cfd71",
    storageBucket: "login-with-firebase-data-cfd71.appspot.com",
    messagingSenderId: "391244779936",
    appId: "1:391244779936:web:a62fa3495790268d4d14c5"
};
      
// Initialize Firebase
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);
const auth = getAuth();

onAuthStateChanged(auth,async (user) => {
if (user) {
  // User is signed in, see docs for a list of available properties
  // https://firebase.google.com/docs/reference/js/auth.user
  const uid = user.uid;
  // ...
  } 
else {
  // User is signed out
  alert('oh no');
  location.href ="logIn-Register.html";
  // ...
  }
});

logout.addEventListener('click', (e) => {
  signOut(auth).then(() => {
      alert('You are logged out')
  }).catch((error) => {
      // An error happened.
      const errorCode = error.code;
      const errorMessage = error.message;
      alert(errorMessage);
  });
});

function delay(milliseconds){
return new Promise(resolve => {
  setTimeout(resolve, milliseconds);
});
}