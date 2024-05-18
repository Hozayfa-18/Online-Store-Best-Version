import {cart} from '../../data/cart.js';
import {MoneyUtils} from '../../utils/MoneyUtils.js';
import {orders} from '../../data/orders.js';
import {Component} from '../Component.js';
import {PayPalButtons} from './PayPalButtons.js';
import {WindowUtils} from '../../utils/WindowUtils.js';
import {products} from '../../data/products.js';

import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.1/firebase-app.js";
import { getDatabase, set, ref, update,get, child, onValue } from "https://www.gstatic.com/firebasejs/9.22.1/firebase-database.js";
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


export class PaymentSummary extends Component {
  
  element;
  events = {
    'click .js-paypal-toggle':
      (event) => this.#togglePaypal(event)
  };

  #usePaypal;
  #loadedPaypal = false;

  constructor(selector) {
    super();
    this.element = document.querySelector(selector);
    this.#usePaypal = localStorage.getItem('store-use-paypal') === 'false';
  }

  render() {
    
    this.element.innerHTML = `
      <div class="js-payment-info"></div>

      <div class="paypal-toggle">
        Use PayPal <input type="checkbox" class="js-paypal-toggle"
          ${this.#usePaypal && 'checked'}>

          
      </div>
      
      <div class="js-payment-buttons-container ${this.#usePaypal && 'use-paypal'}"
        data-testid="payment-buttons-container">
        

        <div class="js-paypal-button-container paypal-button-container"
          data-testid="paypal-button-container">
          
          

        </div>

          <button class="js-place-order-button place-order-button button-primary"
          data-testid="place-order-button">
          Place your order
          </button>
          

      </div>
      
    `;

    this.refreshPaymentDetails();

    if (this.#usePaypal && !this.#loadedPaypal) {
      new PayPalButtons('.js-paypal-button-container').create();
      this.#loadedPaypal = true;
    }

    this.events['click .js-place-order-button'] =
      (event) => this.#performCheckout(event);
  }

  refreshPaymentDetails() {
    const {
      productCostCents,
      shippingCostCents,
      taxCents,
      totalCents
    } = cart.calculateCosts();

    this.element.querySelector('.js-payment-info').innerHTML = `
      <div class="payment-summary-title">
        Order Summary
      </div>

      <div class="payment-summary-row">
        <div>Items (${cart.calculateTotalQuantity()}):</div>
        <div class="payment-summary-money"
          data-testid="product-cost">
          ${MoneyUtils.formatMoney(productCostCents)}
        </div>
      </div>

      <div class="payment-summary-row subtotal-row">
        <div>Total before tax:</div>
        <div class="payment-summary-money"
          data-testid="sub-total">
          ${MoneyUtils.formatMoney(productCostCents + shippingCostCents)}
        </div>
      </div>

      <div class="payment-summary-row">
        <div>Estimated tax (${MoneyUtils.taxRate * 100}%):</div>
        <div class="payment-summary-money"
          data-testid="tax-cost">
          ${MoneyUtils.formatMoney(taxCents)}
        </div>
      </div>

      <div class="payment-summary-row total-row">
        <div>Order total:</div>
        <div class="payment-summary-money"
          data-testid="total-cost">
          ${MoneyUtils.formatMoney(totalCents)}
        </div>
      </div>
    `;
    if (cart.isEmpty()) {
        this.element.querySelector('.js-payment-buttons-container')
        .classList.add('payment-buttons-disabled');
    }
  }

  async #performCheckout(){

    function delay(milliseconds){
      return new Promise(resolve => {
          setTimeout(resolve, milliseconds);
      });
    } 

    orders.createNewOrder(cart);
    
    await delay(1000);
    //WindowUtils.setHref('orders.html');
  
}

  #togglePaypal() {
    
    onAuthStateChanged(auth, async (user) => {
      
      if (user) {
        // User is signed in, see docs for a list of available properties
        // https://firebase.google.com/docs/reference/js/auth.user
        const uid = user.uid;
        
        this.#usePaypal = !this.#usePaypal;

            if (this.#usePaypal) {
              this.element.querySelector('.js-payment-buttons-container')
                .classList.add('use-paypal');

              if (!this.#loadedPaypal) {
                new PayPalButtons('.js-paypal-button-container').create();
                this.#loadedPaypal = true;
              }

            } else {
              this.element.querySelector('.js-payment-buttons-container')
                .classList.remove('use-paypal');
                
            }

            localStorage.setItem('store-use-paypal', this.#usePaypal);
        // ...
      } 
      else {
        // User is signed out
        
        //alert('You are not loged in');
        
        if(confirm("you have to log in first") ===false){
        actions.disable();  
        }else{
          
          window.location.href="logInRegister.html";
        }
        // ...
      }
  
    
  });
  }
}

/*
<div class="adress-input-container">
            <input class="address-input strasseHausnummer" type="text" placeholder="Straße und Hausnummer">
            <input class="address-input stadt" type="text" placeholder="Stadt">
            <input class="address-input plz" type="text" placeholder="PLZ">
</div>
 */
/*
<form action="#" class="form-contact js-payment-buttons-container">
            <p class="important">(Fill these inputs correctly to make sure you get your order)</p>
            <input class="checkoutinfo" id="fname" type="text" placeholder="Name">
            <input class="checkoutinfo" id="discorsname" type="text" placeholder="Discord name(No symboles)">
            <input class="checkoutinfo" id="email" type="email" placeholder="Email">
            <input class="checkoutinfo" id="productName" type="text" placeholder="rewrite product name to confirm">
            <input class="checkoutinfo" id="totalCost" type="email" placeholder="rewrite the order total to confirm">
            <input class="checkoutinfo" id="productQuantity" type="text" placeholder="rewrite the Quantity to confirm">  
        </form> */