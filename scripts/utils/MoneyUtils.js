import {LanguageUtils} from './LanguageUtils.js';

export class MoneyUtils {
  static taxRate = 0.1;

  static formatMoney(amountCents) {
    return (amountCents / 100).toLocaleString(LanguageUtils.locale, {
      style: 'currency',
      currency: LanguageUtils.currency
    });
  }
}
