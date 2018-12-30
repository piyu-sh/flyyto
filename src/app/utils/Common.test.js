import Common from './Common';

describe('Common Utilities', () => {

  describe('Format Currency', () => {
    const amount = 25000;

    it('should return a Indian formatted currency with Rupees symbol', () => {
      expect(Common.formatCurrency(amount)).toBe('₹25,000.00');
    });

    it('should return a Indian formatted currency with Rupees symbol without decimal points', () => {
      const opts = {
        minimumFractionDigits: 0
      }
      expect(Common.formatCurrency(amount, opts)).toBe('₹25,000');
    });

  });

});
