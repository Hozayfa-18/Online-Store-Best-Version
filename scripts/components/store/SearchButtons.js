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

export class SearchButtons extends ComponentV2 {
  events = {
    'click .js-all-category':
      (event) => this.#allCategory(event),
    'click .js-id-category':
      (event) => this.#idCategory(event),
    'click .js-package-category':
      (event) => this.#packageCatgory(event),
    'click .js-menu-category':
      (event) => this.#menuCatgory(event),
    'click .js-car-category':
      (event) => this.#carCatgory(event),
    'click .js-superHeroes-category':
      (event) => this.#superHeroesCatgory(event),
    'click .js-advertisement-category':
      (event) => this.#advertisementCatgory(event),
    'click .js-others-category':
      (event) => this.#othersCatgory(event)
  };

  render() {
    const searchParams = new URLSearchParams(WindowUtils.getSearch());
    const searchText = searchParams.get('search') || '';
    const totalCartQuantity = cart.calculateTotalQuantity();
    const randomNum = Math.random().toFixed(10) * 10000000000;
  
    this.element.innerHTML = `
      <div class="js-others-category search-buttons">
        <input class="category" type="button" value="Others" />
      </div>
      <div class="js-id-category search-buttons">
        <input class="category" type="button" value="Sport" />
      </div>
      <div class="js-advertisement-category search-buttons">
        <input class="category" type="button" value="Kitchen" />
      </div>
      <div class="js-superHeroes-category search-buttons">
        <input class="category" type="button" value="Electronics" />
      </div>
      <div class="js-car-category search-buttons">
        <input class="category" type="button" value="Bathroom" />
      </div>
      <div class="js-menu-category search-buttons">
        <input class="category" type="button" value="Cleaning" />
      </div>
      <div class="js-package-category search-buttons">
        <input class="category" type="button" value="Clothes" />
      </div>
      <div class="js-all-category search-buttons">
        <input class="category" type="button" value="All Products" />
      </div>
    `;

  }
  #allCategory(){
    WindowUtils.setHref(`.`);
  }
  #idCategory(){
    WindowUtils.setHref(`./?search=Sport`);
  }
  #packageCatgory(){
    WindowUtils.setHref(`./?search=Clothes`)
  }
  #menuCatgory(){
    WindowUtils.setHref(`./?search=Cleaning`)
  }
  #carCatgory(){
    WindowUtils.setHref(`./?search=Bathroom`)
  }
  #superHeroesCatgory(){
    WindowUtils.setHref(`./?search=Electronics`)
  }
  #advertisementCatgory(){
    WindowUtils.setHref(`./?search=Kitchen`)
  }
  #othersCatgory(){
    WindowUtils.setHref(`./?search=Others`)
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

