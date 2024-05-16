import {StoreHeader} from '../components/shared/StoreHeader.js';
import {ProductsGrid} from '../components/store/ProductsGrid.js';
import {SearchButtons} from '../components/store/SearchButtons.js';
import {products} from '../data/products.js';

products.loadFromBackend().then(() => {
  const storeHeader = new StoreHeader('.js-store-header').create();
  const productsGrid = new ProductsGrid('.js-products-grid').create();
  new SearchButtons('.js-search-buttons-grid').create();
  productsGrid.setStoreHeader(storeHeader);
});
