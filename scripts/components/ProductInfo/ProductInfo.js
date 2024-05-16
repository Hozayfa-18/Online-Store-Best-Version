import {orders} from '../../data/orders.js';
import {products} from '../../data/products.js';
import {DateUtils} from '../../utils/DateUtils.js';
import {WindowUtils} from '../../utils/WindowUtils.js';
import { MoneyUtils } from '../../utils/MoneyUtils.js';
import {ComponentV2} from '../ComponentV2.js';
import { cart } from '../../data/cart.js'; 


export class ProductInfo extends ComponentV2 {

   events = {
    'click .js-add-to-cart-button':
      (event) => this.#addToCart(event),
      'click .js-add-to-cart-and-go-to-checkout-button':
      (event) => this.#addToCartAndGoToCheckout(event)
    };

    #storeHeader;
    #successMessageTimeouts = {};

    setStoreHeader(storeHeader) {
      this.#storeHeader = storeHeader;
    }

  render() {
    const urlSearchParams = new URLSearchParams(WindowUtils.getSearch());
    const productId = urlSearchParams.get('productId');

    const product = products.findById(productId);
    const productImage = product.createImageInfoUrl(product.variation);

    this.element.innerHTML = `
      
      <div class="container">
      <div class="js-product-container product-container" data-product-id="${product.id}"
      data-testid="product-container-${product.id}">
        <div class="text-container">
          <h1 class="product-name"> ${product.name}</h1>
          <h1 class="product-price">Price:<span class="price-design">${MoneyUtils.formatMoney(product.priceCents)}</span></h1>
          <h1 class="product-genr"> Category: <span class="genr-design">${product.category}</span></h1>

          <div class="js-added-to-cart-message added-to-cart-message"
            data-testid="added-to-cart-message">
            <img src="icons/checkmark.png">
            Added
          </div>

          <button class="js-add-to-cart-button
            add-to-cart-button button-primary"
            data-testid="add-to-cart-button">
            Add to Cart
          </button>
          <br>
          <button class="js-add-to-cart-and-go-to-checkout-button
            add-to-cart-button button-primary"
            data-testid="add-to-cart-button">
            Buy now
          </button>
        </div>
    
        <div class="img-container">
        <img class="product-image" src="${productImage}">
        </div>
      </div>

      <div class="description-container">
        <div class="description-box">
          <h1 class="description-title">Product description</h1>
          <div class="description-text-container">
            <div class="description-text">${product.descriptionText}</div>
            <div class="description-text">${product.descriptionSign}</div>
          </div>
        </div>
      </div>
    </div>
    `;
  }
  #createVariationsSelectorHTML(product) {
    if (!product.variations) {
      return '';
    }

    let variationsHTML = '';

    Object.keys(product.variations).forEach(name => {
      variationsHTML += `
        <div class="variation-name">
          ${name}
        </div>

        <div class="js-variation-options-container variation-options-container">
          ${this.#createVariationOptionsHTML(name, product.variations[name])}
        </div>
      `;
    });

    return variationsHTML;
  }

  #createVariationOptionsHTML(variationName, variationOptions) {
    let optionsHTML = '';

    variationOptions.forEach((option, index) => {
      // On initial load, the first option is selected by default.
      optionsHTML += `
        <button class="js-variation-option variation-option
          ${index === 0 ? 'js-selected-variation is-selected' : ''}"
          data-variation-name="${variationName}"
          data-variation-value="${option}"
          data-testid="variation-${variationName}-${option}">
          ${option}
        </button>
      `;
    });

    return optionsHTML;
  }

  #addToCart(event) {
    function delay(milliseconds){
      return new Promise(resolve => {
          setTimeout(resolve, milliseconds);
      });
    }
    // Add product to cart.
    const productContainer = event.currentTarget.closest('.js-product-container');
    const productId = productContainer.getAttribute('data-product-id');

    
    const quantity = 1;
    const variation = this.#getSelectedVariation(productContainer);
    cart.addProduct(productId, quantity, variation);

    // Update the cart count in the header.
    this.#storeHeader?.updateCartCount();

    // Show the success message.
    const successMessageElement = productContainer.querySelector('.js-added-to-cart-message');
    successMessageElement.classList.add('is-visible');

    // Clear any previous timeouts.
    const previousTimeoutId = this.#successMessageTimeouts[productId];
    if (previousTimeoutId) {
      clearTimeout(previousTimeoutId);
    }

    // Set a timeout to clear the success message.
    const timeoutId = setTimeout(() => {
      successMessageElement.classList.remove('is-visible');
    }, 2000);

    this.#successMessageTimeouts[productId] = timeoutId;
    
  }

  #addToCartAndGoToCheckout(event) {
    // Add product to cart.
    const productContainer = event.currentTarget.closest('.js-product-container');
    const productId = productContainer.getAttribute('data-product-id');

    
    const quantity = 1;
    const variation = this.#getSelectedVariation(productContainer);
    cart.addProduct(productId, quantity, variation);

    // Update the cart count in the header.
    this.#storeHeader?.updateCartCount();
    WindowUtils.setHref('../../../checkout.html');

    // Show the success message.
    const successMessageElement = productContainer.querySelector('.js-added-to-cart-message');
    successMessageElement.classList.add('is-visible');

    // Clear any previous timeouts.
    const previousTimeoutId = this.#successMessageTimeouts[productId];
    if (previousTimeoutId) {
      clearTimeout(previousTimeoutId);
    }

    // Set a timeout to clear the success message.
    const timeoutId = setTimeout(() => {
      successMessageElement.classList.remove('is-visible');
    }, 2000);

    this.#successMessageTimeouts[productId] = timeoutId;
  }

  #selectVariation(event) {
    const button = event.currentTarget;
    const variationsContainer = button.closest('.js-variation-options-container');

    // Switch the selected variation.
    const previousButton = variationsContainer.querySelector('.js-selected-variation');
    previousButton.classList.remove('js-selected-variation', 'is-selected');
    button.classList.add('js-selected-variation', 'is-selected');

    // Update the product image based on the variation selected.
    const productContainer = button.closest('.js-product-container');
    const productId = productContainer.getAttribute('data-product-id');

    const product = products.findById(productId);
    const variation = this.#getSelectedVariation(productContainer);
    const productImage = product.createImageUrl(variation);

    productContainer.querySelector('.js-product-image').src = productImage;
  }

  #getSelectedVariation(productContainer) {
    if (!productContainer.querySelector('.js-selected-variation')) {
      return;
    }

    const selectedVariation = {};

    productContainer.querySelectorAll('.js-selected-variation').forEach(button => {
      const name = button.getAttribute('data-variation-name');
      const value = button.getAttribute('data-variation-value');

      selectedVariation[name] = value;
    });

    return selectedVariation;
  }
}
