import {cart} from '../../data/cart.js';
import {WindowUtils} from '../../utils/WindowUtils.js';
import {ComponentV2} from '../ComponentV2.js';

import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.1/firebase-app.js";
import { getDatabase, set, ref, update, get, child, onValue } from "https://www.gstatic.com/firebasejs/9.22.1/firebase-database.js";
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
const dbRef = ref(database);

export class ProfileGrid extends ComponentV2 {
    render(){
        onAuthStateChanged(auth, async (user) => {
            if (user) {
              // User is signed in, see docs for a list of available properties
              // https://firebase.google.com/docs/reference/js/auth.user
              const uid = user.uid;
              const arr = [];
              get(child (dbRef, `users/` + uid )).then((snapshot) => {
                if (snapshot.exists()) {
                  arr.push(snapshot.val());
                  const fname = arr[0].first_name;
                  const discordname = arr[0].last_name;
                  const email = arr[0].email;
                  const trackingNumber = arr[0].trackingNumber;

                  let profileGridHTML = '';
                  
                  profileGridHTML +=`
                  <div class="profile">
                  <div class="name profile-info">
                      <p class="first-name">First name: ${fname}</p>
                  </div>
                  <div class="last-name profile-info">
                      <p class="last-name">Last name: ${discordname}</p>
                  </div>
                  <div class="email profile-info">
                      <p class="email">Email: ${email}</p>
                  </div>
                  
              </div>
                  `
                  this.element.innerHTML = profileGridHTML;

                } else {
                    console.log("No data available");
                }
                }).catch((error) => {
                    console.error(error);
                });
            } 
            else {
                // User is signed out
                alert('Please Sign-in/Log-in to see your Profile');
            }
        });
    }
}