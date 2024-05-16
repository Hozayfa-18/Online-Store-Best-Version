import {orders} from '../../data/orders.js';
import {cart} from '../../data/cart.js';
import {DateUtils} from '../../utils/DateUtils.js';
import {MoneyUtils} from '../../utils/MoneyUtils.js';
import {products} from '../../data/products.js';
import {Component} from '../Component.js';
import {VariationUtils} from '../../utils/VariationUtils.js';
import {WindowUtils} from '../../utils/WindowUtils.js';

// Import the functions you need from the SDKs you need
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

export class OrdersGrid extends Component {
  element;

  events = {
    'click .js-buy-again-button':
      (event) => this.#addToCart(event),
    'click .js-track-package-button':
      (event) => this.#trackPackage(event)
  };

  #addedToCartTimeouts = {};
  #storeHeader;

  constructor(selector) {
    super();
    this.element = document.querySelector(selector);
  }

  setStoreHeader(storeHeader) {
    this.#storeHeader = storeHeader;
  }

  

  render() {
    
    onAuthStateChanged(auth, async (user) => {
      if (user) {
        
        // User is signed in, see docs for a list of available properties
        // https://firebase.google.com/docs/reference/js/auth.user
        const uid = user.uid;
        const arr = [];
        const arr2 = [];
        //let orderNumber =0;
        //orderNumber=JSON.parse(localStorage.getItem('orderNumber'));
        function getKeyByValue(object, value,orderNumber) {
          return Object.keys(object).find(key => object[key] === value);
        }
        function getValueByKey(object,key) {
          return object[key];
        }
        let cartItemId ='';
        let productId ='';
        let orderNumber = 0;
        let productQuantity =0;
        let sharedOrderNumber = 0;
        get(child (dbRef, `users/`)).then((snapshot) => {
          if (snapshot.exists()) {
            arr2.push(snapshot.val());

          get(child (dbRef, `users/` + uid )).then( (snapshot) => {
            if (snapshot.exists()) {
              arr.push(snapshot.val());
              const fname = arr[0].first_name;
              const discordname = arr[0].last_name;
              const email = arr[0].email;
              const trackingNumber = arr[0].trackingNumber;
              
    
              let ordersHTML = '';

              let ordersArray = arr[0].oorders;
              ordersArray.reverse();
              ordersArray.forEach((order) => {
                if(email === order.email){
                  
                  console.log(order)
                  cartItemId = order.products[0].cartItemId;
                  productId = order.prodId;
                  orderNumber = order.orderNumber;
                  sharedOrderNumber = order.orderCounters;
                  productQuantity = order.productQuantity[0];
                  console.log(productQuantity)
                  console.log(cartItemId)
                  console.log(productId)
                  


                const orderDate = DateUtils.formatDateMonth(order.orderDate);
                const orderCost = MoneyUtils.formatMoney(order.totalCostCents);

                ordersHTML += `
                  <div class="order-container"
                    data-testid="order-container-${order.orderId}">
                    <header class="order-header">
                      <section class="left-section">
                        <div class="order-date">
                          <div class="order-header-label">Order Placed:</div>
                          <div>${orderDate}</div>
                        </div>
                        <div class="order-total">
                          <div class="order-header-label">Total:</div>
                          <div>${orderCost}</div>
                        </div>
                      </section>

                      <section class="right-section">
                        <div class="order-header-label">Order ID:</div>
                        <div>${order.orderId}</div>
                        <div class="order-header-label">Order Number:</div>
                        <div>${sharedOrderNumber}</div>
                        <div class="order-header-label">Order email:</div>
                        <div>${order.email}</div>
                      </section>
                    </header>

                    <div class="order-details-grid">
                      ${this.#createOrderDetailsHTML(order,cartItemId,productId,orderNumber)}
                    </div>
                  </div>
                `;
                }
              });
              

              this.element.innerHTML = ordersHTML;

              const buyAgainButtons = this.element.querySelectorAll('.js-buy-again-button');
              buyAgainButtons.forEach(button => {
                button.addEventListener('click', this.#addToCart.bind(this));
              });

              const trackPackageButtons = this.element.querySelectorAll('.js-track-package-button');
              trackPackageButtons.forEach(button => {
                button.addEventListener('click', this.#trackPackage.bind(this));
              });

          } else {
              console.log("No data available");
          }
          }).catch((error) => {
              console.error(error);
          });
        } else {
            console.log("No data available");
        }
        }).catch((error) => {
            console.error(error);
        });
      } 
      else {
          // User is signed out
           alert('oh no');
      }
      
  });
  }

  #createOrderDetailsHTML(order,cartItemId,productId,orderNumber) {

    let ordersHTML = '';

    order.products.forEach((productDetails, index) => {
      console.log(order)
      
      const product = products.findById(productDetails.productId);
      const productImage = product.createImageUrl(productDetails.variation);

      const deliveryDateMessage = Date.now() < productDetails.estimatedDeliveryTimeMs
        ? `Arriving on: ${DateUtils.formatDateMonth(productDetails.estimatedDeliveryTimeMs)}`
        : `Delivered on: ${DateUtils.formatDateMonth(productDetails.estimatedDeliveryTimeMs)}`;

      ordersHTML += `
        <div class="product-image-container">
          <img src="${productImage}">
        </div>

        <div class="product-details">
          <div class="product-name">
            ${product.name}
          </div>

          <div class="product-delivery-date">
            ${deliveryDateMessage}
          </div>

          ${VariationUtils.createVariationInfoHTML(productDetails.variation)}

          <div class="product-quantity">
            Quantity: ${productDetails.quantity}
          </div>

        </div>

        <div class="product-actions">
          <button class="js-track-package-button
            track-package-button button-secondary"
            data-order-id="${order.orderId}"
            data-order-number="${orderNumber}"
            data-cart-item-id="${cartItemId}"
            data-product-id="${productId[index]}"
            data-product-quantity="${productDetails.quantity}"
            data-testid="track-package-${cartItemId}">
            Track package
          </button>
        </div>
      `;
    
    });
    

    return ordersHTML;
  }
  
  #addToCart(event) {
    // Add item to cart.
    const button = event.currentTarget;
    const orderId = button.getAttribute('data-order-id');
    const cartItemId = button.getAttribute('data-cart-item-id');
    const productId = button.getAttribute('data-product-id');
    console.log(cartItemId)
    //const order = orders.findById(orderId);
    //console.log(order)
    //const productDetails = order.findProductDetails(cartItemId);
    //console.log(productDetails)
    cart.addProduct(productId, 1);

    this.#storeHeader?.updateCartCount();

    // Show added to cart message.
    button.classList.add('added-to-cart');

    const previousTimeoutId = this.#addedToCartTimeouts[orderId + cartItemId];
    if (previousTimeoutId) {
      clearTimeout(previousTimeoutId);
    }

    const timeoutId = setTimeout(() => {
      button.classList.remove('added-to-cart');
    }, 1500);

    this.#addedToCartTimeouts[orderId + cartItemId] = timeoutId;
  }

  #trackPackage(event) {
    const button = event.currentTarget;
    const orderId = button.getAttribute('data-order-id');
    const orderNumber = button.getAttribute('data-order-number');
    const cartItemId = button.getAttribute('data-cart-item-id');
    const productId = button.getAttribute('data-product-id');
    const productQuantity = button.getAttribute('data-product-quantity');
    //const order = orders.findById(orderId);
    //console.log(order)
    //const productDetails = order.findProductDetails(cartItemId);
    //const productId = productDetails.productId;
    //const estimatedDeliveryTimeMs = productDetails.estimatedDeliveryTimeMs;
    //const productQuantity = productDetails.quantity;
    //console.log(productDetails.estimatedDeliveryTimeMs)
    //console.log(productId)
    

    WindowUtils.setHref(`tracking.html?productId=${productId}&productQuantity=${productQuantity}&orderId=${orderId}&cartItemId=${cartItemId}&orderNumber=${orderNumber}`);
  }
}


/**
 * <button class="js-buy-again-button buy-again-button button-primary"
            data-order-id="${order.orderId}"
            data-cart-item-id="${cartItemId}"
            data-product-id="${productId}"
            data-testid="buy-again-button-${cartItemId}" hidden>

            <img class="buy-again-icon" src="../../../icons/buy-again.png">
            <span class="buy-again-message">Buy it again</span>

            <span class="buy-again-success">
              &#10003; Added
            </span>
          </button>
 */