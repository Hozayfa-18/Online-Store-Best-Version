import {LanguageUtils} from './LanguageUtils.js';

export const DateUtils = {
  formatDateWeekday(time) {
    return new Date(time).toLocaleDateString(LanguageUtils.locale, {
      weekday: 'long',
      month: 'long',
      day: 'numeric'
    });
  },

  formatDateMonth(time) {
    return new Date(time).toLocaleDateString(LanguageUtils.locale, {
      month: 'long',
      day: 'numeric'
    });
  },
  
  formatDateYear(time) {
    return new Date(time).toLocaleDateString(LanguageUtils.locale, {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  },

  calculateDeliveryDate(startDate, deliveryTimeDays) {
    const date = new Date(startDate);
    let daysRemaining = deliveryTimeDays;

    while (daysRemaining > 0) {
      // This increases date by 1 (to the next day).
      date.setDate(date.getDate() + 1);

      // Don't count Saturday and Sunday because we only
      // deliver during the weekdays.
      if (date.getDay() === 6 || date.getDay() === 0) continue;

      --daysRemaining;
    }

    return date;
  }
};
