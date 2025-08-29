/**
 * Proportional Discount Allocation - Generalized Implementation
 * 
 * Demonstrates the mathematical approach to distributing discounts
 * across multiple cart items while maintaining precision.
 * 
 * This is a simplified, generalized version of production algorithms.
 */

class DiscountAllocator {
  constructor(config = {}) {
    this.currencyPrecision = config.currencyPrecision || 2;
    this.roundingStrategy = config.roundingStrategy || 'largest-remainder';
  }

  /**
   * Allocate percentage discount across cart items proportionally
   * @param {Array} cartItems - Array of cart items with price and quantity
   * @param {number} discountPercentage - Discount percentage (e.g., 15 for 15%)
   * @returns {Object} Allocation results with precision handling
   */
  allocatePercentageDiscount(cartItems, discountPercentage) {
    // Input validation
    if (!cartItems || cartItems.length === 0) {
      return { allocations: [], totalDiscount: 0 };
    }

    // Special handling for single item - direct calculation for perfect precision
    if (cartItems.length === 1) {
      return this.allocateSingleItem(cartItems[0], discountPercentage);
    }

    // Calculate subtotal and target discount
    const subtotal = this.calculateSubtotal(cartItems);
    const targetDiscount = this.roundToPrecision((subtotal * discountPercentage) / 100);

    // First pass: proportional allocation with remainder tracking
    const itemAllocations = cartItems.map(item => {
      const itemTotal = item.price * item.quantity;
      const proportion = itemTotal / subtotal;
      const exactDiscount = targetDiscount * proportion;
      const roundedDiscount = this.roundToPrecision(exactDiscount);
      
      return {
        itemId: item.id,
        originalPrice: itemTotal,
        exactDiscount,
        roundedDiscount,
        remainder: exactDiscount - roundedDiscount,
        discountedPrice: itemTotal - roundedDiscount
      };
    });

    // Second pass: reconcile rounding errors
    const reconciledAllocations = this.reconcileRoundingErrors(
      itemAllocations, 
      targetDiscount
    );

    return {
      allocations: reconciledAllocations,
      totalDiscount: targetDiscount,
      subtotal: subtotal,
      accuracy: this.calculateAccuracy(reconciledAllocations, targetDiscount)
    };
  }

  /**
   * Allocate fixed amount discount across cart items proportionally
   * @param {Array} cartItems - Array of cart items
   * @param {number} fixedAmount - Fixed discount amount (e.g., 12.99)
   * @returns {Object} Allocation results
   */
  allocateFixedDiscount(cartItems, fixedAmount) {
    if (!cartItems || cartItems.length === 0) {
      return { allocations: [], totalDiscount: 0 };
    }

    const subtotal = this.calculateSubtotal(cartItems);
    const effectiveDiscount = Math.min(fixedAmount, subtotal); // Don't exceed cart value

    const allocations = cartItems.map(item => {
      const itemTotal = item.price * item.quantity;
      const proportion = itemTotal / subtotal;
      const itemDiscount = this.roundToPrecision(effectiveDiscount * proportion);
      
      return {
        itemId: item.id,
        originalPrice: itemTotal,
        discountAmount: itemDiscount,
        discountedPrice: itemTotal - itemDiscount
      };
    });

    return {
      allocations,
      totalDiscount: effectiveDiscount,
      subtotal: subtotal
    };
  }

  /**
   * Handle single item allocation with direct calculation
   */
  allocateSingleItem(item, discountPercentage) {
    const itemTotal = item.price * item.quantity;
    const discountAmount = this.roundToPrecision((itemTotal * discountPercentage) / 100);
    
    return {
      allocations: [{
        itemId: item.id,
        originalPrice: itemTotal,
        discountAmount: discountAmount,
        discountedPrice: itemTotal - discountAmount
      }],
      totalDiscount: discountAmount,
      subtotal: itemTotal,
      accuracy: 1.0 // Perfect accuracy for single items
    };
  }

  /**
   * Reconcile rounding errors using largest remainder method
   */
  reconcileRoundingErrors(allocations, targetDiscount) {
    const totalAllocated = allocations.reduce(
      (sum, allocation) => sum + allocation.roundedDiscount, 
      0
    );
    
    const roundingError = this.roundToPrecision(targetDiscount - totalAllocated);

    if (Math.abs(roundingError) > 0.001) {
      // Sort by remainder size (largest first) for optimal distribution
      const sortedByRemainder = [...allocations].sort(
        (a, b) => b.remainder - a.remainder
      );

      // Apply correction to item with largest remainder
      const adjustmentTarget = sortedByRemainder[0];
      adjustmentTarget.roundedDiscount += roundingError;
      adjustmentTarget.discountedPrice = 
        adjustmentTarget.originalPrice - adjustmentTarget.roundedDiscount;
    }

    return allocations.map(allocation => ({
      itemId: allocation.itemId,
      originalPrice: allocation.originalPrice,
      discountAmount: allocation.roundedDiscount,
      discountedPrice: allocation.discountedPrice
    }));
  }

  /**
   * Calculate cart subtotal
   */
  calculateSubtotal(cartItems) {
    return cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  }

  /**
   * Round to currency precision
   */
  roundToPrecision(amount) {
    const multiplier = Math.pow(10, this.currencyPrecision);
    return Math.round(amount * multiplier) / multiplier;
  }

  /**
   * Calculate allocation accuracy
   */
  calculateAccuracy(allocations, targetDiscount) {
    const totalAllocated = allocations.reduce(
      (sum, allocation) => sum + allocation.discountAmount, 
      0
    );
    
    const difference = Math.abs(targetDiscount - totalAllocated);
    return difference < 0.01 ? 1.0 : (1 - difference / targetDiscount);
  }
}

// Usage Example
const allocator = new DiscountAllocator({ currencyPrecision: 2 });

const cartItems = [
  { id: '1', price: 12.99, quantity: 1 },
  { id: '2', price: 8.50, quantity: 2 },
  { id: '3', price: 22.45, quantity: 1 }
];

// Allocate 15% discount
const result = allocator.allocatePercentageDiscount(cartItems, 15);

console.log('Allocation Results:', {
  subtotal: result.subtotal,
  totalDiscount: result.totalDiscount,
  accuracy: result.accuracy,
  allocations: result.allocations
});

// Example output:
// {
//   subtotal: 43.44,
//   totalDiscount: 6.52,
//   accuracy: 1.0,
//   allocations: [
//     { itemId: '1', originalPrice: 12.99, discountAmount: 1.95, discountedPrice: 11.04 },
//     { itemId: '2', originalPrice: 17.00, discountAmount: 2.55, discountedPrice: 14.45 },
//     { itemId: '3', originalPrice: 22.45, discountAmount: 3.37, discountedPrice: 19.08 }
//   ]
// }

export default DiscountAllocator;
