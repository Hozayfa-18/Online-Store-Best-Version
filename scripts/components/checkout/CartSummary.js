import {cart} from '../../data/cart.js';
import {deliveryOptions} from '../../data/deliveryOptions.js';
import {products} from '../../data/products.js';
import {MoneyUtils} from '../../utils/MoneyUtils.js';
import {DomUtils} from '../../utils/DomUtils.js';
import {DateUtils} from '../../utils/DateUtils.js';
import {WindowUtils} from '../../utils/WindowUtils.js'
import {ComponentV2} from '../ComponentV2.js';
import {VariationUtils} from '../../utils/VariationUtils.js';

export class CartSummary extends ComponentV2 {
  events = {
    'click .js-delivery-option':
      (event) => this.#selectDeliveryOption(event),
    'click .js-update-quantity-link':
      (event) => this.#toggleQuantityEditor(event),
    'keyup .js-new-quantity-input':
      (event) => this.#handleQuantityInput(event),
    'click .js-save-quantity-link':
      (event) => this.#handleSaveLinkClick(event),
    'click .js-delete-quantity-link':
      (event) => this.#handleDeleteLinkClick(event)
  };

  #paymentSummary;
  #checkoutHeader;

  setPaymentSummary(paymentSummary) {
    this.#paymentSummary = paymentSummary;
  }

  setCheckoutHeader(checkoutHeader) {
    this.#checkoutHeader = checkoutHeader;
  }

  render() {
    
    let cartSummaryHTML = '';

    if (cart.isEmpty()) {
      this.#renderEmptyCartMessage();
      return;
    }

    cart.items.forEach((cartItem) => {
      const product = products.findById(cartItem.productId);
      const deliveryOption = deliveryOptions.findById(cartItem.deliveryOptionId);
      //console.log(deliveryOption)

      const productImage = product.createImageUrl(cartItem.variation);
      const deliveryDate = deliveryOption.calculateDeliveryDate();
      //console.log(DateUtils.formatDateWeekday(deliveryDate))
      cartSummaryHTML += `
        <div class="js-cart-item cart-item-container"
          data-cart-item-id="${cartItem.id}"
          data-testid="cart-item-container-${cartItem.id}">

          

          <div class="cart-item-details-grid">
            <img class="product-image" src="${productImage}">

            <div class="cart-item-details">
              <div class="product-name">
                ${product.name}
              </div>

              <div class="product-price">
                ${MoneyUtils.formatMoney(product.priceCents)}
              </div>

              ${VariationUtils.createVariationInfoHTML(cartItem.variation)}

              <div class="js-quantity-container product-quantity"
                data-testid="quantity-container">
                Quantity: <span class="js-quantity-label quantity-label"
                  data-testid="quantity-label">
                  ${cartItem.quantity}
                </span>

                <input class="js-new-quantity-input new-quantity-input"
                  type="number" value="${cartItem.quantity}"
                  data-testid="new-quantity-input">

                <span class="js-update-quantity-link update-quantity-link link-primary"
                  data-testid="update-quantity-link">
                  Update
                </span>

                <span class="js-save-quantity-link save-quantity-link link-primary"
                  data-testid="save-quantity-link">
                  Save
                </span>

                <span class="js-delete-quantity-link delete-quantity-link link-primary"
                  data-testid="delete-quantity-link">
                  Delete
                </span>
              </div>
            </div>
          </div>
        </div>
      `;
    });

    this.element.innerHTML = cartSummaryHTML;
  }

  #renderEmptyCartMessage() {
    this.element.innerHTML = `
      <div data-testid="empty-cart-message">
        Your cart is empty.
      </div>
      <a class="button-primary view-products-link" href="."
        data-testid="view-products-link">
        View products
      </a>
    `;
  }

  #createDeliveryOptionsHTML(cartItem) {
    let deliverOptionsHTML = '';

    deliveryOptions.all.forEach(deliveryOption => {
      const id = deliveryOption.id;
      const costCents = deliveryOption.costCents;
      const deliveryDate = deliveryOption.calculateDeliveryDate();

      const shippingText = costCents === 0
        ? 'FREE Shipping'
        : `${MoneyUtils.formatMoney(costCents)} - Shipping`;

      deliverOptionsHTML += `
        <div class="js-delivery-option delivery-option"
          data-delivery-option-id="${id}"
          data-testid="delivery-option-${id}">

          <input
            class="js-delivery-option-input delivery-option-input"
            ${cartItem.deliveryOptionId === id ? 'checked' : ''}
            name="${cartItem.id}-delivery-option"
            type="radio"
            data-testid="delivery-option-input"
          >

          <div>
            <div class="delivery-option-date">
              ${DateUtils.formatDateWeekday(deliveryDate)}
            </div>
            <div class="delivery-option-price">
              ${shippingText}
            </div>
          </div>
        </div>
      `;
    });

    return deliverOptionsHTML;
  }

  #selectDeliveryOption(event) {
    const deliveryOptionElem = event.currentTarget;
    const radioInput = deliveryOptionElem.querySelector('.js-delivery-option-input');

    radioInput.checked = true;

    // Update delivery option in cart.
    const cartItemElem = deliveryOptionElem.closest('.js-cart-item');
    const cartItemId = cartItemElem.getAttribute('data-cart-item-id');
    const deliveryOptionId = deliveryOptionElem.getAttribute('data-delivery-option-id');
    cart.updateDeliveryOption(cartItemId, deliveryOptionId);

    // Update delivery date.
    const deliveryOption = deliveryOptions.findById(deliveryOptionId);
    const newDeliveryDate = deliveryOption.calculateDeliveryDate();
    cartItemElem.querySelector('.js-delivery-date')
      .textContent = DateUtils.formatDateWeekday(newDeliveryDate);

    this.#updatePaymentDetailsAndHeader();
  }

  #toggleQuantityEditor(event) {
    const quantityContainer = event.currentTarget.closest('.js-quantity-container');
    quantityContainer.classList.add('is-updating-quantity');
  }

  #handleQuantityInput(event) {
    const quantityContainer = event.currentTarget.closest('.js-quantity-container');

    if (event.key === 'Enter') {
      this.#updateQuantity(quantityContainer);

    } else if (event.key === 'Escape') {
      this.#cancelUpdateQuantity(quantityContainer);
    }
  }

  #cancelUpdateQuantity(quantityContainer) {
    const inputElement = quantityContainer.querySelector('.js-new-quantity-input');
    quantityContainer.classList.remove('is-updating-quantity');

    const oldQuantity = quantityContainer
      .querySelector('.js-quantity-label')
      .textContent;

    inputElement.value = parseInt(oldQuantity, 10);
  }

  #handleSaveLinkClick(event) {
    const quantityContainer = event.currentTarget.closest('.js-quantity-container');
    this.#updateQuantity(quantityContainer);
  }

  #updateQuantity(quantityContainer) {
    const inputElement = quantityContainer.querySelector('.js-new-quantity-input');

    if (inputElement.value === '') {
      this.#cancelUpdateQuantity(quantityContainer);
      return;
    }

    const newQuantity = parseInt(inputElement.value, 10);

    if (newQuantity < 0) {
      alert('Not a valid quantity');
      return;
    }

    // Update quantity in cart.
    const cartItemContainer = quantityContainer.closest('.js-cart-item');
    const cartItemId = cartItemContainer.getAttribute('data-cart-item-id');

    if (newQuantity === 0) {
      cart.updateQuantity(cartItemId, 0);
      this.#removeFromCartSummary(cartItemContainer);

    } else {
      cart.updateQuantity(cartItemId, newQuantity);

      quantityContainer.classList.remove('is-updating-quantity');
      quantityContainer.querySelector('.js-quantity-label')
        .textContent = newQuantity;
    }

    this.#updatePaymentDetailsAndHeader();
  }

  #handleDeleteLinkClick(event) {
    const cartItemContainer = event.currentTarget.closest('.js-cart-item');
    const cartItemId = cartItemContainer.getAttribute('data-cart-item-id');

    cart.updateQuantity(cartItemId, 0);
    this.#removeFromCartSummary(cartItemContainer);

    this.#updatePaymentDetailsAndHeader();
    WindowUtils.setHref('checkout.html')
  }

  #updatePaymentDetailsAndHeader() {
    this.#checkoutHeader?.updateCartCount();
    this.#paymentSummary?.refreshPaymentDetails();
  }

  #removeFromCartSummary(cartItemElement) {
    if (cart.isEmpty()) {
      this.#renderEmptyCartMessage();
    } else {
      DomUtils.removeElement(cartItemElement);
    }
  }
}