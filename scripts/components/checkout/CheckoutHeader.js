import {cart} from '../../data/cart.js';
import {ComponentV2} from '../ComponentV2.js';

export class CheckoutHeader extends ComponentV2 {
  // events = {
  //   'click .js-return-to-home-link':
  //     (event) => this.#toggleNavigationPopover(event),
  //   'click .js-navigation-popover':
  //     (event) => this.#handlePopoverClick(event),
  //   'click .js-close-navigation-popover':
  //     (event) => this.#closeNavigationPopover(event)
  // };

  render() {
    const quantity = cart.calculateTotalQuantity();
    
    this.element.innerHTML = `
      <div class="header-content">
        <section class="left-section">
          <a href="." data-testid="store-logo">
            <img class="store-logo" src="images/icons/home-icon.png">
            <img class="store-mobile-logo" src="images/icons/home-icon.png">
          </a>
        </section>

        <section class="middle-section">
          Checkout (<a class="js-return-to-home-link return-to-home-link"
            href="." data-testid="cart-quantity">${quantity} items</a>)

          <div class="js-navigation-popover navigation-popover">
            <div class="popover-message">
              Are you sure you want to return to leave checkout?
            </div>
            <button class="js-close-navigation-popover button-secondary">
              Stay in checkout
            </button>
            <a href=".">
              <button class="button-primary">
                Return to home
              </button>
            </a>
          </div>
        </section>

        <section class="right-section">
          <img src="icons/checkout-lock-icon.png">
        </section>
      </div>
    `;

    // document.addEventListener('click', () => {
    //   this.#closeNavigationPopover();
    // });
  }

  updateCartCount() {
    const totalQuantity = cart.calculateTotalQuantity();
    this.element.querySelector('.js-return-to-home-link')
      .textContent = `${totalQuantity} items`;
  }

  // #toggleNavigationPopover(event) {
  //   event.preventDefault();
  //   event.stopPropagation();

  //   const popoverElem = document.querySelector('.js-navigation-popover');

  //   popoverElem.classList.toggle('is-visible');
  // }

  // #closeNavigationPopover() {
  //   const popoverElem = document.querySelector('.js-navigation-popover');

  //   popoverElem.classList.remove('is-visible');
  // }

  // #handlePopoverClick(event) {
  //   event.stopPropagation();
  // }
}
