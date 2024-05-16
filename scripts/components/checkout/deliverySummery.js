import {cart} from '../../data/cart.js';
import {deliveryOptions} from '../../data/deliveryOptions.js';
import {MoneyUtils} from '../../utils/MoneyUtils.js';
import {DateUtils} from '../../utils/DateUtils.js';
import {ComponentV2} from '../ComponentV2.js';

export class DeliverySummary extends ComponentV2 {
    events = {
        'click .js-delivery-option':
          (event) => this.#selectDeliveryOption(event),
    };
    
    #paymentSummary;
    #checkoutHeader;

    setPaymentSummary(paymentSummary) {
        this.#paymentSummary = paymentSummary;
    }

    setCheckoutHeader(checkoutHeader) {
        this.#checkoutHeader = checkoutHeader;
    }


    render(){

        if (cart.isEmpty()) {
            this.#renderEmptyCartMessage();
            return;
          }

        cart.items.forEach((cartItem) => {
            
            let deliverOptionsHTML = '';

            deliveryOptions.all.forEach(deliveryOption => {
            const id = deliveryOption.id;
            const costCents = deliveryOption.costCents;
            const deliveryDate = deliveryOption.calculateDeliveryDate();

            const shippingText = costCents === 0
                ? 'FREE Shipping' : `${MoneyUtils.formatMoney(costCents)} - Shipping`;
            console.log(cartItem.id)
            deliverOptionsHTML += `
                <div class="js-delivery-option delivery-option"
                data-delivery-option-id="${id}"
                data-testid="delivery-option-${id}"
                data-cart-item-id="${cartItem.id}">
                
                <input
                    class="js-delivery-option-input delivery-option-input"
                    ${cartItem.deliveryOptionId === id ? 'checked' : ''}
                    name="${cartItem.id}-delivery-option"
                    type="radio"
                    data-testid="delivery-option-input">
                    
                <div class="delivery-date">
                    Delivery date:
                    <span class="js-delivery-date">
                    ${DateUtils.formatDateWeekday(deliveryDate)}
                    </span>
                </div>

                <div>
                    <div class="delivery-option-price">
                    ${shippingText}
                    </div>
                </div>
                </div>
                <br/>
            `;
            });
            this.element.innerHTML = deliverOptionsHTML;
        });
        
    }

    #renderEmptyCartMessage() {
        this.element.innerHTML = ``;
      }

    #selectDeliveryOption(event) {
        const deliveryOptionElem = event.currentTarget;
        const radioInput = deliveryOptionElem.querySelector('.js-delivery-option-input');
    
        radioInput.checked = true;
    
        // Update delivery option in cart.
        const cartItemElem = deliveryOptionElem.closest('.js-delivery-option');
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

    #updatePaymentDetailsAndHeader() {
        this.#checkoutHeader?.updateCartCount();
        this.#paymentSummary?.refreshPaymentDetails();
    }
}
    