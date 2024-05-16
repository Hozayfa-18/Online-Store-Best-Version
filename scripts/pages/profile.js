import {StoreHeader} from '../components/shared/StoreHeader.js';
import {ProfileGrid} from '../components/shared/profileGrid.js';
import {products} from '../data/products.js';

products.loadFromBackend().then(() => {
  new StoreHeader('.js-store-header').create();
  new ProfileGrid('.js-profile-container').create();
});
