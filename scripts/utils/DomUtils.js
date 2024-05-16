export class DomUtils {
  static removeElement(element) {
    if (!element || !element.parentNode) return;
    element.parentNode.removeChild(element);
  }
}
