import {StoreHeader} from '../components/shared/StoreHeader.js';
import {ProductInfo} from '../components/ProductInfo/ProductInfo.js';
import {products} from '../data/products.js';

products.loadFromBackend().then(() => {
  const storeHeader = new StoreHeader('.js-store-header').create();
  const productInfo = new ProductInfo('.js-order-tracking').create();
  productInfo.setStoreHeader(storeHeader);
});
