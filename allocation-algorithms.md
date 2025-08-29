# Allocation Algorithms

> **Mathematical distribution strategies for precise discount allocation across cart items**

## Problem Statement

E-commerce discount allocation requires distributing percentage and fixed-amount discounts across multiple cart items while maintaining exact subtotal matching with checkout systems. The challenge lies in handling floating-point precision, currency rounding, and dynamic cart changes while ensuring mathematical accuracy.

## Core Challenge

When applying a 15% discount to a cart with items worth €12.99, €8.50, and €22.45, the system must:
- Calculate proportional discount for each item
- Handle rounding to currency precision (0.01)
- Ensure total allocated discount equals expected discount exactly
- Maintain accuracy when cart contents change

## Algorithm Strategies

### 1. Proportional Percentage Allocation

**Approach**: Distribute discount proportionally based on item value, with remainder tracking for precision.

```javascript
// Simplified example of the core logic
function allocateProportionalDiscount(cartItems, discountPercentage) {
  const subtotal = calculateSubtotal(cartItems);
  const targetDiscount = (subtotal * discountPercentage) / 100;
  
  // First pass: calculate proportional amounts
  const allocations = cartItems.map(item => {
    const itemTotal = item.price * item.quantity;
    const proportion = itemTotal / subtotal;
    const exactDiscount = targetDiscount * proportion;
    const roundedDiscount = Math.floor(exactDiscount * 100) / 100;
    
    return {
      item,
      exactDiscount,
      roundedDiscount,
      remainder: exactDiscount - roundedDiscount
    };
  });
  
  // Second pass: reconcile rounding errors
  reconcileRoundingErrors(allocations, targetDiscount);
  
  return allocations;
}
```

**Key Insight**: The largest remainder method ensures optimal distribution of rounding errors.

### 2. Fixed Amount Distribution

**Challenge**: Distributing a fixed monetary amount (€12.99) proportionally while maintaining precision.

**Strategy**: 
- Calculate each item's proportional share of the fixed amount
- Apply currency-appropriate rounding
- Track cumulative allocation to ensure exact total

### 3. Single Item Optimization

**Special Case**: Single-item carts can use direct calculation for perfect precision:

```javascript
if (cartItems.length === 1) {
  const discountAmount = (itemTotal * discountPercentage) / 100;
  return { discountAmount, discountedPrice: itemTotal - discountAmount };
}
```

## Precision Techniques

### Rounding Error Reconciliation

**The Problem**: Floating-point arithmetic and currency rounding create small discrepancies.

**The Solution**: Remainder tracking and largest-remainder allocation:

1. Calculate exact proportional discounts
2. Round each to currency precision
3. Identify largest remainders
4. Apply rounding corrections to items with largest remainders

### Currency Precision Handling

**Multi-Currency Support**: Different currencies require different precision handling:
- EUR, USD, GBP: 2 decimal places
- JPY: 0 decimal places  
- Some currencies: 3 decimal places

### Dynamic Reallocation

**Challenge**: Cart contents change frequently (quantity updates, item additions/removals).

**Strategy**: Signature-based change detection prevents unnecessary recalculation:

```javascript
function createCartSignature(cartItems) {
  return cartItems
    .map(item => `${item.id}:${item.quantity}:${item.price}`)
    .sort()
    .join('|');
}
```

## Production Considerations

### Performance Characteristics
- **Time Complexity**: O(n) for n cart items
- **Space Complexity**: O(n) for allocation storage
- **Update Frequency**: Debounced to ~300ms for optimal UX

### Accuracy Achievements
- **Subtotal Matching**: Consistent accuracy in production deployment
- **Rounding Errors**: Maintained within single currency unit precision
- **Multi-Currency**: Reliable performance across EUR, USD, GBP, CHF

### Edge Cases Handled
- **Empty Carts**: Graceful handling with zero allocation
- **Single Items**: Optimized direct calculation
- **Large Carts**: Efficient remainder distribution
- **Currency Boundaries**: Appropriate precision per locale

## Implementation Patterns

### Error Handling Strategy
```javascript
function safeAllocation(cartItems, discount) {
  try {
    return allocateDiscount(cartItems, discount);
  } catch (error) {
    // Graceful degradation - return zero allocation
    logError('Allocation failed', error);
    return createFallbackAllocation(cartItems);
  }
}
```

### Testing Strategy
- **Mathematical Validation**: Sum verification for all allocations
- **Precision Testing**: Rounding error tolerance validation
- **Performance Testing**: Large cart simulation
- **Currency Testing**: Multi-currency precision validation

## Key Insights

1. **Remainder Distribution**: The largest remainder method provides optimal rounding error distribution
2. **Single Item Optimization**: Direct calculation eliminates cumulative rounding errors
3. **Change Detection**: Signature-based updates prevent unnecessary recalculation
4. **Graceful Degradation**: Error handling ensures system stability

---

*These algorithms form the mathematical foundation enabling precise discount coordination across complex e-commerce scenarios.*
