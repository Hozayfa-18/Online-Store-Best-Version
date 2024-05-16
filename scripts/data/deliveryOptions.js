import {DateUtils} from '../utils/DateUtils.js';

export class DeliveryOption {
  #id;
  #costCents;
  #deliveryTimeDays;

  constructor(args) {
    this.#id = args.id;
    this.#costCents = args.costCents;
    this.#deliveryTimeDays = args.deliveryTimeDays;
  }

  get id() { return this.#id; }
  get costCents() { return this.#costCents; }

  calculateDeliveryDate() {
    const today = new Date();
    return DateUtils.calculateDeliveryDate(today, this.#deliveryTimeDays);
  }

  toJSON() {
    return {
      id: this.#id,
      costCents: this.#costCents,
      deliveryTimeDays: this.#deliveryTimeDays
    };
  }
}

export class DeliveryOptionList {
  #deliveryOptions;

  constructor() {
    this.#loadDeliveryOptions();
  }

  get all() { return this.#deliveryOptions; }
  get default() { return this.#deliveryOptions[0]; }

  findById(id) {
    return this.#deliveryOptions.find(deliveryOption => {
      return deliveryOption.id === id;
    });
  }

  #loadDeliveryOptions() {
    this.#deliveryOptions = DefaultDeliveryOptions.get();
  }
}

export const DefaultDeliveryOptions = {
  get() {
    return [
      new DeliveryOption({
        id: 'f297d333-a5c4-452f-840b-15a662257b3f',
        costCents: 0,
        deliveryTimeDays: 7
      }),
      new DeliveryOption({
        id: '6e2dd65a-6665-4f24-bcdc-f2ecdbc6e156',
        costCents: 499,
        deliveryTimeDays: 3
      }),
      new DeliveryOption({
        id: '178aa766-de75-4686-8442-038c1a027003',
        costCents: 999,
        deliveryTimeDays: 1
      })
    ];
  }
};

export const deliveryOptions = new DeliveryOptionList();
