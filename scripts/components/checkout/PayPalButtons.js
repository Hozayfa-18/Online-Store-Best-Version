import {cart} from '../../data/cart.js';
import {orders} from '../../data/orders.js';
import {WindowUtils} from '../../utils/WindowUtils.js';
import {Component} from '../Component.js';
import { products } from '../../data/products.js';

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

export class PayPalButtons extends Component {
  element;
  #selector;

  constructor(selector) {
    super();
    this.element = document.querySelector(selector);
    this.#selector = selector;
  }

  render() {
    onAuthStateChanged(auth, async (user) => {
      if (user) {
        // User is signed in, see docs for a list of available properties
        // https://firebase.google.com/docs/reference/js/auth.user
        const uid = user.uid;
        paypal.Buttons({
          onInit: (data, actions) => {
            
            if (cart.isEmpty()) {
              actions.disable();
            }
          },

          // Sets up the transaction when a payment button is clicked
          createOrder: (data, actions) => {
            const costs = cart.calculateCosts();

            return actions.order.create({
              purchase_units: [{
                amount: {
                  value: (costs.totalCents / 100).toFixed(2)
                }
              }]
            });
          },

          // Finalize the transaction after payer approval
          onApprove: async (data, actions) => {
            const orderData = await actions.order.capture();

            // Successful capture! For dev/demo purposes:
            console.log('Capture result', orderData, JSON.stringify(orderData, null, 2));

            const transaction = orderData.purchase_units[0].payments.captures[0];
            const shipping = orderData.purchase_units[0].shipping;
            alert(`Transaction ${transaction.status}: ${transaction.id}\n\nSee console for all available details`);
            alert(`${shipping.name.full_name}`);
            const arr = [];
            let num = 0;
            get(child (dbRef, `users/` + uid )).then((snapshot) => {
              if (snapshot.exists()) {
                arr.push(snapshot.val());
                num = arr[0].orderCount || 0;

                ++num;
                update(ref(database, 'users/' + uid ),{
                  orderCount: num,
                });
              
                update(ref(database, 'users/' + uid ),{
                  ['oorders'+'/'+num+'/'+'paypalTransaction'+'/'+'transactionId']:transaction.id,
                  ['oorders'+'/'+num+'/'+'paypalTransaction'+'/'+'transactionStatus']:transaction.status,
                  ['oorders'+'/'+num+'/'+'paypalTransaction'+'/'+'paypalUsername']:shipping.name.full_name,
                  ['oorders'+'/'+num+'/'+'paypalTransaction'+'/'+ 'strasseHausnummerPlz']:shipping.address.address_line_2, 
                  ['oorders'+'/'+num+'/'+'paypalTransaction'+'/'+ 'stadt']:shipping.address.admin_area_2,
                })

            } else {
                console.log("No data available");
            }
            }).catch((error) => {
              console.error(error);
            });
          
            
            // When ready to go live, remove the alert and show a success message within this page. For example:
            // const element = document.getElementById('paypal-button-container');
            // element.innerHTML = '<h3>Thank you for your payment!</h3>';
            // Or go to another URL:  actions.redirect('thank_you.html');

            orders.createNewOrder(cart);
            //WindowUtils.setHref('orders.html');
          }
        }).render(this.#selector);
      }
      else {
          // User is signed out
           alert('oh no');
      }
  });
    
  
  }
}
