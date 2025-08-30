# Cart Discount Coordination Engine Documentation

> **Advanced e-commerce discount coordination system enabling complex promotional scenarios across incompatible platforms**

[![Production Deployed](https://img.shields.io/badge/status-production--deployed-success)]()
[![Multi-Platform](https://img.shields.io/badge/deployment-8%20international%20stores-blue)]()
[![Precision](https://img.shields.io/badge/accuracy-99%25%2B%20subtotal%20matching-green)]()

## Overview

E-commerce platforms often handle different discount types in isolation - automatic discounts at checkout, manual codes at cart level, promotional logic scattered across different systems. This creates user confusion and lost trust when cart totals don't match checkout expectations.

This system bridges these gaps by creating a unified coordination layer that detects, allocates, and displays all discount types together in a single, trustworthy cart interface.

## The Problem

**Platform Fragmentation:**
- Shopify applies automatic discounts only at checkout
- Manual discount codes affect cart-layer display  
- Third-party cart systems (Rebuy) have their own discount logic
- No native way to combine and display these together pre-checkout

**User Experience Issues:**
- Cart shows €100, checkout shows €85 with no explanation
- Missing visual feedback when quantity changes affect pricing
- Automatic discounts completely invisible until checkout
- Support burden from "where did my discount go?" inquiries

## The Solution

### Modular Coordination Architecture
Implemented a cart-layer coordination system that detects both automatic and manual discounts, allocates them proportionally across line items, renders clear per-line price changes, and derives truthful subtotals that match checkout expectations.

### Advanced Mathematical Allocation
- **Proportional distribution algorithms** with sub-cent precision
- **Dynamic reallocation** on cart state changes
- **Rounding error reconciliation** for consistent accuracy
- **Multi-currency support** with locale-specific formatting

### Production-Grade Reliability
- **Deployed across 8 storefronts**
- **Handles complex combination scenarios** (7+ discount types)
- **Event-driven architecture** with fail-safe mechanisms
- **Comprehensive debugging and diagnostic tools**

## Technical Highlights

### 🧮 Mathematical Precision
The system implements production-tested allocation algorithms that handle complex scenarios like proportional discount distribution across mixed cart items:

```javascript
// Proportional allocation with rounding reconciliation
function allocateDiscountAcrossItems(cartItems, discountPercentage) {
  // Calculate exact proportional distribution
  // Handle rounding errors through remainder tracking
  // Ensure total always matches expected discount amount
  // See: /examples/allocation-algorithms/ for implementation details
}
```

### 🎯 Complex Scenario Handling
Supports sophisticated discount combinations that most platforms can't handle natively:
- Auto 3-for-2 + Manual percentage codes
- URL-based discounts + Free gift thresholds  
- Triple-layer combinations with coherent UI
- Complex promotional logic with different ruleset variations

### ⚡ Performance Optimization
- **State signature tracking** prevents unnecessary DOM updates
- **Debounced processing** coordinates with platform update cycles
- **Graceful degradation** maintains core functionality during edge cases
- **Memory-efficient state management** for high-traffic scenarios

## Architecture

The system is built with clear separation of concerns across several specialized modules:

### Core Engine
**`CartUtils`** - The mathematical and operational foundation
- **Allocation algorithms**: `allocateDiscountAcrossItems()`, `allocateFixedDiscountsAcrossItems()`
- **Cart operations**: `fetchCart()`, `addGiftToCart()`, `removeItemFromCart()`, `setItemQuantity()`
- **Discount detection**: `getActiveDiscount()`, `detectAutomaticBuyXGetY()`
- **Utilities**: `parsePriceForLocale()`, currency handling

### Event Coordination
**`EventManager`** - Pub/sub system for cart events
- Centralized event registration and dispatch
- Cart state change coordination
- Cross-module communication hub

### UI Management
**`CartCallbacks`** - DOM updates and visual changes
- Price display and quantity increment/decrement handling
- State management and change detection
- DOM manipulation with fail-safe mechanisms

### Specialized Handlers
- **`FreeGiftHandler`** - Gift-specific logic (threshold validation, single quantity enforcement)
- **`ThreeForTwoHandler`** - 3-for-2 promotion coordination (manual + automatic)

### Event Flow
```
User Action → EventManager → [Specialized Handlers] → CartUtils → CartCallbacks → DOM Updates
```

## Documentation

### 📖 Technical Deep-Dive
- [Allocation Algorithms](allocation-algorithms.md) - Mathematical distribution strategies and precision handling

### 💻 Code Examples
- [Allocation Example](proportional-allocation.js) - Generalized implementation patterns

### Key Technical Concepts
- **Proportional Distribution**: Mathematical allocation across heterogeneous cart items
- **Rounding Reconciliation**: Precision handling to maintain subtotal accuracy
- **Event-Driven Coordination**: Pub/sub architecture for complex state management
- **Platform Integration**: Coordination patterns for incompatible e-commerce systems

## Key Achievements

✅ **Consistent Subtotal Accuracy** - Implemented mathematical precision with dynamic reallocation  
✅ **Production Stability** - Deployed and maintained across 8 e-commerce stores  
✅ **Complex Scenario Support** - Coordinated 7+ discount types in combination  
✅ **Performance Optimized** - Developed efficient DOM updates with intelligent change detection  
✅ **Scalable Architecture** - Adapted for multi-currency, multi-language deployment  
✅ **Comprehensive Documentation** - Created professional-grade technical documentation  

## Impact

- **Reduced Support Tickets**: Clear, trustworthy cart totals eliminate discount confusion
- **Improved Conversion**: Marketing campaigns show accurate prices pre-checkout  
- **Enhanced Trust**: Cart totals consistently match checkout expectations
- **Operational Efficiency**: Configurable per-region without code changes

## Implementation Notes

This system was originally implemented for Shopify stores using the Rebuy Smart Cart platform. The architecture patterns and algorithms are designed to be transferable, though the current implementation includes platform-specific integrations.

**Current Platform Integration:**
- **E-commerce Platform**: Shopify
- **Cart System**: Rebuy Smart Cart  
- **Implementation**: JavaScript (ES6+), DOM APIs, Event-driven architecture

**Future Development Goals:**
- Develop platform-agnostic abstraction layers
- Create standardized interfaces for different cart systems
- Implement adapter patterns for broader e-commerce platform compatibility

This repository contains architectural patterns, algorithms, and implementation strategies developed for production e-commerce systems. Code examples are generalized patterns rather than platform-specific implementations.

**Deployment Considerations:**
- Requires coordination with platform-specific cart systems
- DOM selector patterns may need customization per platform
- Performance testing recommended for high-traffic scenarios
- Currency and locale configuration for different markets

---

**Technical Contact**: Ian Fleming - ianfleming@gmail.com  
**Portfolio**: https://ianflemingdeveloper.com  
**Case Study**: [Discount Coordination System](https://ianflemingdeveloper.com/discount-system-case-study.html)

---

*This system represents advanced e-commerce integration work handling real-world complexity at scale. All code examples and documentation maintain appropriate confidentiality while demonstrating technical capabilities.*
