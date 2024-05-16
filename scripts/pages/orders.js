import {StoreHeader} from '../components/shared/StoreHeader.js';
import {OrdersGrid} from '../components/orders/OrdersGrid.js';
import {products} from '../data/products.js';

products.loadFromBackend().then(() => {
  const storeHeader = new StoreHeader('.js-store-header').create();
  const ordersGrid = new OrdersGrid('.js-orders-grid').create();
  ordersGrid.setStoreHeader(storeHeader);
});
