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

login.addEventListener('click', (e) => {
  let email = document.getElementById('email').value;
  let password = document.getElementById('password').value;
  
  
  signInWithEmailAndPassword(auth, email, password)
    .then(async (userCredential) => {
      // Signed in 
      const user = userCredential.user;

      const dt = new Date();
      update(ref(database, 'users/' + user.uid),{
        last_login :dt
      })

      if(user.emailVerified){   
        alert('good');
        await delay(1000);
        location.href = "index.html";
      }
      else{
        alert('verify your email');
        return;
      }
      
      alert('You are logged in');  
      // ...
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      alert(errorMessage);
    });
  
  
});

const user = auth.currentUser;
onAuthStateChanged(auth, (user) => {
  if (user) {
    // User is signed in, see docs for a list of available properties
    // https://firebase.google.com/docs/reference/js/auth.user
    const uid = user.uid;
    // ...
    } else {
      // User is signed out
      
      // ...
    }
});
  
  
function delay(milliseconds){
  return new Promise(resolve => {
      setTimeout(resolve, milliseconds);
  });
}  
  
// Validate Functions
function validate_email(email) {
  expression = /^[^@]+@\w+(\.\w+)+\w$/
  if (expression.test(email) == true) {
    // Email is good
    return true
  } else {
    // Email is not good
    return false
  }
}
  
function validate_password(password) {
  // Firebase only accepts lengths greater than 6
  if (password < 6) {
    return false
  } else {
    return true
  }
}



