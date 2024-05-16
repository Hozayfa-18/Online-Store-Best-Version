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


signUp.addEventListener('click', (e) => {

  let email = document.getElementById('email').value;
  let password = document.getElementById('password').value;
  let first_name = document.getElementById('first_name').value;
  let last_name = document.getElementById('last_name').value;
  //let termsAndConditionsCheckbox = document.getElementById('terms_and-condition_checkbox');

  if(validate_email(email) == false || validate_password(password) == false){
    alert('Email or password is invalid')
    return;
  }
  if(validate_field(first_name) == false || validate_field(last_name) ==false){
    alert("You have to fill all fields")
    return;
  }
  /** 
  if(validate_checkbox(termsAndConditionsCheckbox) == false){
    alert("You have to agree to the terms and conditions")
    return;
  }
    */
  createUserWithEmailAndPassword(auth, email, password)
    .then(async (userCredential) => {
      sendEmailVerification(auth.currentUser)
        .then(() => {
          alert('Email verfication link sent to:' + email);
        })
        // Signed in 
        const user = userCredential.user;
        set(ref(database, 'users/' + user.uid),{
          first_name : first_name,
          last_name : last_name,
          email : email,
          termsAndConditionsCheckbox : true
        });

        await delay(1000);
        alert('user created'); 
        location.href = "login.html"; 
        // ...
        })
        .catch((error) => {
          const errorCode = error.code;
          const errorMessage = error.message;
          alert(errorMessage);
          // ..
        });
});
/** 
login.addEventListener('keydown', (e) =>{
  if(e.keydown == 13){
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
  }
})
*/

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
onAuthStateChanged(auth, async (user) => {
  if (user) {
    // User is signed in, see docs for a list of available properties
    // https://firebase.google.com/docs/reference/js/auth.user
    const uid = user.uid;
    alert('oh yes');
    if(user.emailVerified){   
      alert('good');
      await delay(1000);
      location.href = "index.html";
    }
    else{
      await delay(1000);
      location.href = "login.html";
      alert('verify your email');
      return;
    }
    // ...
    } 
  else {
    // User is signed out
    alert('oh no');
    // ...
    }
});
 
 
  
  
  
// Validate Functions
function validate_email(email) {
  const expression = /^[^@]+@\w+(\.\w+)+\w$/;
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
  
function validate_field(field) {
  if (field == null) {
    return false
  }
  
  if (field.length <= 0) {
    return false
  } else {
    return true
  }
}
/** 
function validate_checkbox(checkbox) {
  if (checkbox.checked) {
    return true;
  }
  else{
    return false;
  }
}
*/
document.getElementById('login').disabled = true;

function delay(milliseconds){
      return new Promise(resolve => {
          setTimeout(resolve, milliseconds);
      });
}
let header = document.getElementById("form_header");

createAccount.onclick = () => {
  first_name.style.maxHeight = "60px";
  last_name.style.maxHeight = "60px";
  //terms_and_condition_checkbox.style.maxHeight = "20px";
  //terms_and_condition_text.hidden = false;
  header.innerHTML='Register';
  signUp.classList.remove("disable");
  login.classList.add("disable");
  hasAccount.classList.remove('disable');
  createAccount.classList.add('disable');
  document.getElementById('login').disabled = true;
  document.getElementById('signUp').disabled = false;
}

hasAccount.onclick = () => {
  first_name.style.maxHeight = "0";
  last_name.style.maxHeight = "0";
  //terms_and_condition_checkbox.style.maxHeight = "0";
  //terms_and_condition_text.hidden = true;
  header.innerHTML='Log In';
  signUp.classList.add("disable");
  login.classList.remove("disable");
  hasAccount.classList.add('disable');
  createAccount.classList.remove('disable');
  document.getElementById('signUp').disabled = true;
  document.getElementById('login').disabled = false;
  document.getElementById('first_name').value = '';
  document.getElementById('last_name').value = '';
}



