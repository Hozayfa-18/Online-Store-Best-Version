import {login_registerHeader} from '../components/loginRegister/login_registerHeader.js';
import {products} from '../data/products.js';

products.loadFromBackend().then(() => {
  new login_registerHeader('.js-store-header').create();
});
