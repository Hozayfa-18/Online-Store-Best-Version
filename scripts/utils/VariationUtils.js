export class VariationUtils {
  static createVariationInfoHTML(variation) {
    if (!variation) return '';

    const variationNames = Object.keys(variation);
    if (variationNames.length === 0) return '';

    let variationsHTML = '';

    variationNames.forEach(name => {
      const value = variation[name];

      variationsHTML += `
        <div class="variation-info" data-testid="variation-info">
          ${name}: ${value}
        </div>
      `;
    });

    return `
      <div class="product-variations">
        ${variationsHTML}
      </div>
    `;
  }
}
