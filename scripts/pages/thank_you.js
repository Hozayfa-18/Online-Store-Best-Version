import {CheckoutHeader} from '../components/checkout/CheckoutHeader.js';
import {CartSummary} from '../components/checkout/CartSummary.js';
import {PaymentSummary} from '../components/checkout/PaymentSummary.js';
import {products} from '../data/products.js';

products.loadFromBackend().then(() => {
  const checkoutHeader = new CheckoutHeader('.js-checkout-header').create();
  const paymentSummary = new PaymentSummary('.js-payment-summary').create();
  const cartSummary = new CartSummary('.js-cart-summary').create();
  cartSummary.setCheckoutHeader(checkoutHeader);
  cartSummary.setPaymentSummary(paymentSummary);
});