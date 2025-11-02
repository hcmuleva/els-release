// 🎯 Exercise 2: Shopping Cart Calculator

console.log("=== Exercise 2: Shopping Cart Calculator ===\n");

// You're building a shopping cart. Calculate the total.

// TODO: Create variables for:
const item1Price = 29.99;  // Price of item 1
const item2Price = 15.50;  // Price of item 2
const item3Price = 42.00;  // Price of item 3

// Calculate subtotal
const subtotal = item1Price + item2Price + item3Price;

// Apply tax (8%)
const taxRate = 0.08;
const tax = subtotal * taxRate;

// Calculate total
const total = subtotal + tax;

// Display receipt
console.log("╔════════════════════════════════╗");
console.log("║         RECEIPT                ║");
console.log("╚════════════════════════════════╝");
console.log(`Item 1: $${item1Price.toFixed(2)}`);
console.log(`Item 2: $${item2Price.toFixed(2)}`);
console.log(`Item 3: $${item3Price.toFixed(2)}`);
console.log("─────────────────────────────────");
console.log(`Subtotal: $${subtotal.toFixed(2)}`);
console.log(`Tax (8%): $${tax.toFixed(2)}`);
console.log("═════════════════════════════════");
console.log(`TOTAL: $${total.toFixed(2)}`);

// 🏆 BONUS CHALLENGE:
// Add a discount: if subtotal > $50, apply 10% discount before tax
console.log("\n=== BONUS: With Discount ===\n");

const discountThreshold = 50;
const discountRate = 0.10;

let finalSubtotal = subtotal;

if (subtotal > discountThreshold) {
    const discount = subtotal * discountRate;
    finalSubtotal = subtotal - discount;
    console.log(`Discount (10%): -$${discount.toFixed(2)}`);
}

const finalTax = finalSubtotal * taxRate;
const finalTotal = finalSubtotal + finalTax;

console.log(`Subtotal after discount: $${finalSubtotal.toFixed(2)}`);
console.log(`Tax (8%): $${finalTax.toFixed(2)}`);
console.log(`FINAL TOTAL: $${finalTotal.toFixed(2)}`);
