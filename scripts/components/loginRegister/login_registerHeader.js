import {cart} from '../../data/cart.js';
import {WindowUtils} from '../../utils/WindowUtils.js';
import {ComponentV2} from '../ComponentV2.js';

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

export class login_registerHeader extends ComponentV2 {
  events = {
    'click .js-hamburger-menu-toggle':
      (event) => this.#toggleDropdownMenu(event),
    'keyup .js-search-bar':
      (event) => this.#handleSearchBarInput(event),
    'click .js-search-button':
      (event) => this.#handleSearchClick(event),
    'click .js-profile-toggle':
      (event) => this.#toggleProfileMenu(event),
    'click .logout':
      (event) => this.#logout(event),
    'click .saveButton':
      (event) => this.#changeProfileName(event)
  };

  render() {
    const searchParams = new URLSearchParams(WindowUtils.getSearch());
    const searchText = searchParams.get('search') || '';
    const totalCartQuantity = cart.calculateTotalQuantity();
    const randomNum = Math.random().toFixed(10) * 10000000000;
  
    this.element.innerHTML = `
      <section class="left-section">
        <a href="." class="header-link">
          <p class="store-logo">Home</p>
          <p class="store-mobile-logo">Home</p>
        </a>
        
        
      </section>
      
     

      <section class="right-section">
        <a class="orders-link header-link" href="orders.html">
          <span class="orders-text">Orders</span>
        </a>
      

      <a class="cart-link header-link" href="checkout.html">
        <img class="cart-icon" src="icons/cart-icon.png">
        <div class="js-cart-quantity cart-quantity"
          data-testid="cart-quantity">
          ${totalCartQuantity}
        </div>
        <div class="cart-text">Cart</div>
      </a> 
      <nav>
        <div class="header-link">
          <img src="icons/profile-icon.png" class="user-pic 
            js-profile-toggle" data-testid="profile-dropdown">
        </div>
        <div class="sub-menu-wrap js-profile-dropdown">
          <div class="sub-menu"> 
            <a href="#" class="sub-menu-link">
              <img src="icons/setting.png">
              <p>Settings & Privacy</p>
              <span>></span>
            </a>

            <a href="#" class="sub-menu-link">
              <img src="icons/help.png">
              <p>Help & Support</p>
              <span>></span>
            </a>
                  
            
          </div>
        </div>
      </nav>

      </section>

      <section class="right-section-mobile">
        <img class="js-hamburger-menu-toggle hamburger-menu-toggle"
          src="icons/hamburger-menu.png"
          data-testid="hamburger-menu-toggle">
      </section>

      <div class="js-hamburger-menu-dropdown hamburger-menu-dropdown"
        data-testid="hamburger-menu-dropdown">
        <a class="hamburger-menu-link" href="orders.html">
          Returns & Orders
        </a>
        <a class="hamburger-menu-link" href="checkout.html">
          Cart (<span class="js-cart-quantity-mobile cart-quantity-mobile"
            data-testid="cart-quantity-mobile">${totalCartQuantity}</span>)
        </a>
      </div>
      
    `;
  }
  updateCartCount() {
    
    const totalCartQuantity = cart.calculateTotalQuantity();
    this.element.querySelector('.js-cart-quantity').textContent = totalCartQuantity;
    this.element.querySelector('.js-cart-quantity-mobile').textContent = totalCartQuantity;
  }

  #toggleProfileMenu(){
    const dropdownMenu = this.element.querySelector('.js-profile-dropdown');
    
    dropdownMenu.classList.toggle('profile-opened')
  }
  
  #toggleDropdownMenu() {
    const dropdownMenu = this.element.querySelector('.js-hamburger-menu-dropdown');
    const isOpened = dropdownMenu.classList.contains('hamburger-menu-opened');

    if (!isOpened) {
      dropdownMenu.classList.add('hamburger-menu-opened');
    } else {
      dropdownMenu.classList.remove('hamburger-menu-opened');
    }
  }

  #handleSearchBarInput(event) {
    if (event.key === 'Enter') {
      this.#searchProducts(
        this.element.querySelector('.js-search-bar').value
      );
    }
  }

  #handleSearchClick() {
    this.#searchProducts(
      this.element.querySelector('.js-search-bar').value
    );
  }

  #searchProducts(searchText) {
    if (!searchText) {
      WindowUtils.setHref('./');
      return;
    }

    WindowUtils.setHref(`./?search=${searchText}`);
  }

  #logout(){
    if(confirm('are u sure you want to log out') == false){
      return;
    }else{

      signOut(auth).then(() => {
          alert('You are logged out')
      }).catch((error) => {
          // An error happened.
          const errorCode = error.code;
          const errorMessage = error.message;
          alert(errorMessage);
      });

      onAuthStateChanged(auth, async (user) => {
        if (user) {
          // User is signed in, see docs for a list of available properties
          // https://firebase.google.com/docs/reference/js/auth.user
          const uid = user.uid;
          alert('oh yes');
          document.querySelector('.logout').disabled = false;
          // ...
        } 
        else {
          // User is signed out
          alert('oh no');
          document.querySelector('.logout').disabled = true;
          // ...
          }
      });
    }
  }

  #changeProfileName(){
    var oldNameElement = document.getElementById("oldName");
    var newNameInput = document.getElementById("newName");
    var saveButton = document.querySelector("saveButton");

    // Load the saved profile name from local storage
    var savedName = localStorage.getItem("profileName");
    if (savedName) {
      oldNameElement.textContent = savedName;
      newNameInput.value = savedName;
    }

    // Update the profile name dynamically as the user types
    newNameInput.addEventListener("input", function() {
      oldNameElement.textContent = newNameInput.value;
    });

    // Save the new profile name to local storage when the "Save" button is clicked
      var newName = newNameInput.value;
      updateProfileName(newName);

    function updateProfileName(newName) {
      oldNameElement.textContent = newName;
      localStorage.setItem("profileName", newName);
      alert("Profile name updated!");
    }
}
}

