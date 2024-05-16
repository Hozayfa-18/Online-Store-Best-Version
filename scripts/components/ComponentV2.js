export class ComponentV2 {
  element;

  constructor(selector) {
    if (selector) {
      this.element = document.querySelector(selector);
    }
  }

  create() {
    this.render();
    this.#addEventListeners();
    return this;
  }

  render() {
    throw new Error('No render defined.');
  }

  #addEventListeners() {
    if (!this.events) return;
    if (!this.element) throw new Error('No element defined.');

    Object.keys(this.events).forEach(key => {
      const [eventName, selector] = key.split(' ');
      const listener = this.events[key];

      this.element.querySelectorAll(selector).forEach(elem => {
        elem.addEventListener(eventName, listener);
      });
    });
  }
}
