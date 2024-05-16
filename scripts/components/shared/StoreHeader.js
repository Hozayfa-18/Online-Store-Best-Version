import {cart} from '../../data/cart.js';
import {WindowUtils} from '../../utils/WindowUtils.js';
import {ComponentV2} from '../ComponentV2.js';

import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.1/firebase-app.js";
import {getDatabase, set, ref, update, get, child, onValue } from "https://www.gstatic.com/firebasejs/9.22.1/firebase-database.js";
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

export class StoreHeader extends ComponentV2 {
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

    onAuthStateChanged(auth, async (user) => {
      if (user) {
        // User is signed in, see docs for a list of available properties
        // https://firebase.google.com/docs/reference/js/auth.user
        const uid = user.uid;
        const arr = [];
        let fname ='';
        let discordname ='';
        let email ='';
        get(child (dbRef, `users/` + uid )).then((snapshot) => {
          if (snapshot.exists()) {
            arr.push(snapshot.val());
              fname = arr[0].first_name;
              discordname = arr[0].last_name;
              email = arr[0].email;
          

        let storeHeaderHTML='';
        
        storeHeaderHTML= `
          <section class="left-section">
            <a href="." class="header-link">
              <p class="store-logo">Home</p>
              <p class="store-mobile-logo">Home</p>
            </a>
            <a href="logInRegister.html" class="header-link">
            <p class="logIn-text">Login</p>
            </a>
            
          </section>
          
          <section class="middle-section">
            <input class="js-search-bar search-bar" type="search"
              placeholder="Search" value="${searchText}"
              data-testid="search-input">

            <button class="js-search-button search-button"
              data-testid="search-button">
              <img class="search-icon" src="icons/search-icon.png">
            </button>
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
            <button class="header-link">
              <img src="icons/profile-icon.png" class="user-pic 
                js-profile-toggle" data-testid="profile-dropdown">
            </button>
            <div class="sub-menu-wrap js-profile-dropdown">
              <div class="sub-menu"> 
              <h3 style="color:black;">${fname} ${discordname}</h3>
              <a href="../../../profile.html" class="sub-menu-link">
                <img src="icons/profile.png">
                <p>Profile</p>
                <span>></span>
              </a>
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
                      
                <button class="sub-menu-btn logout" ">
                  <img src="icons/logout.png">
                  <p>Logout</p>
                  <span> --> </span>
                </button>
              </div>
            </div>
          </nav>

          </section>

          <button class="right-section-mobile">
            <img class="js-hamburger-menu-toggle hamburger-menu-toggle"
              src="icons/hamburger-menu.png"
              data-testid="hamburger-menu-toggle">
          </button>

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

        this.element.innerHTML = storeHeaderHTML;  
      
        const userPicButton = this.element.querySelector('.js-profile-toggle');
        userPicButton.addEventListener('click', this.#toggleProfileMenu.bind(this));

        const searchButton = this.element.querySelector('.js-search-button');
        searchButton.addEventListener('click', this.#handleSearchClick.bind(this));

        
        const logoutButton = this.element.querySelector('.logout');
        logoutButton.addEventListener('click', this.#logout.bind(this));

        const hamburgerMenuButton = this.element.querySelector('.right-section-mobile');
        hamburgerMenuButton.addEventListener('click', this.#toggleDropdownMenu.bind(this));

        } else {
          console.log("No data available");
          }
          }).catch((error) => {
            console.error(error);
          });
        // ...
      } 
      else {
        // User is signed out
        let storeHeaderHTML='';
        
        storeHeaderHTML= `
          <section class="left-section">
            <a href="." class="header-link">
              <p class="store-logo">Home</p>
              <p class="store-mobile-logo">Home</p>
            </a>
            <a href="logInRegister.html" class="header-link">
            <p class="logIn-text">Login</p>
            </a>
            
          </section>
          
          <section class="middle-section">
            <input class="js-search-bar search-bar" type="text"
              placeholder="Search" value="${searchText}"
              data-testid="search-input">

            <button class="js-search-button search-button"
              data-testid="search-button">
              <img class="search-icon" src="icons/search-icon.png">
            </button>
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
            <button class="header-link">
              <img src="icons/profile-icon.png" class="user-pic 
                js-profile-toggle" data-testid="profile-dropdown">
            </button>
            <div class="sub-menu-wrap js-profile-dropdown">
              <div class="sub-menu"> 
              <a href="../../../profile.html" class="sub-menu-link">
                <img src="icons/profile.png">
                <p>Profile</p>
                <span>></span>
              </a>
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

                <a style="text-decoration:none;" href="logInRegister.html">      
                <button class="sub-menu-btn" ">
                  <img src="icons/logout.png">
                  <p>Login</p>
                  <span> --> </span>
                </button>
                </a>
              </div>
            </div>
          </nav>

          </section>

          <button class="right-section-mobile">
            <img class="js-hamburger-menu-toggle hamburger-menu-toggle"
              src="icons/hamburger-menu.png"
              data-testid="hamburger-menu-toggle">
          </button>

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

        this.element.innerHTML = storeHeaderHTML;  
      
        const userPicButton = this.element.querySelector('.js-profile-toggle');
        userPicButton.addEventListener('click', this.#toggleProfileMenu.bind(this));

        const searchButton = this.element.querySelector('.js-search-button');
        searchButton.addEventListener('click', this.#handleSearchClick.bind(this));


        const hamburgerMenuButton = this.element.querySelector('.right-section-mobile');
        hamburgerMenuButton.addEventListener('click', this.#toggleDropdownMenu.bind(this));

        // ...
        // ...
        }
    });
    

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

