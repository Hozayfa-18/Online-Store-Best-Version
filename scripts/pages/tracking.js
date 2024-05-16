import {StoreHeader} from '../components/shared/StoreHeader.js';
import {OrderTracking} from '../components/tracking/OrderTracking.js';
import {products} from '../data/products.js';

products.loadFromBackend().then(() => {
  new StoreHeader('.js-store-header').create();
  new OrderTracking('.js-order-tracking').create();
});
