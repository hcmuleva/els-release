// 🎯 Exercise 3: Number Operations & Comparisons

console.log("=== Exercise 3: Number Operations ===\n");

// Given two numbers, perform various operations
const num1 = 15;
const num2 = 4;

console.log("Given numbers:");
console.log(`Number 1: ${num1}`);
console.log(`Number 2: ${num2}\n`);

// TODO: Complete these operations

// 1. Basic Arithmetic
console.log("--- Arithmetic Operations ---");
console.log(`Sum: ${num1} + ${num2} = ${num1 + num2}`);
console.log(`Difference: ${num1} - ${num2} = ${num1 - num2}`);
console.log(`Product: ${num1} * ${num2} = ${num1 * num2}`);
console.log(`Quotient: ${num1} / ${num2} = ${num1 / num2}`);
console.log(`Remainder: ${num1} % ${num2} = ${num1 % num2}`);
console.log(`Power: ${num1} ** ${num2} = ${num1 ** num2}\n`);

// 2. Comparisons
console.log("--- Comparison Operations ---");
console.log(`${num1} > ${num2}: ${num1 > num2}`);
console.log(`${num1} < ${num2}: ${num1 < num2}`);
console.log(`${num1} === ${num2}: ${num1 === num2}`);
console.log(`${num1} !== ${num2}: ${num1 !== num2}\n`);

// 3. Check if even or odd
console.log("--- Even/Odd Check ---");
const isNum1Even = num1 % 2 === 0;
const isNum2Even = num2 % 2 === 0;
console.log(`${num1} is even: ${isNum1Even}`);
console.log(`${num2} is even: ${isNum2Even}\n`);

// 4. Determine which is larger
console.log("--- Which is Larger? ---");
if (num1 > num2) {
    console.log(`${num1} is larger than ${num2}`);
} else if (num2 > num1) {
    console.log(`${num2} is larger than ${num1}`);
} else {
    console.log("Both numbers are equal");
}

// 🏆 CHALLENGES:

console.log("\n=== CHALLENGES ===\n");

// Challenge 1: Find the average
const average = (num1 + num2) / 2;
console.log(`Average of ${num1} and ${num2}: ${average}`);

// Challenge 2: Check if both are even
const bothEven = isNum1Even && isNum2Even;
console.log(`Both numbers are even: ${bothEven}`);

// Challenge 3: Check if at least one is odd
const atLeastOneOdd = !isNum1Even || !isNum2Even;
console.log(`At least one is odd: ${atLeastOneOdd}`);

// Challenge 4: Calculate percentage
// What percentage is num2 of num1?
const percentage = (num2 / num1) * 100;
console.log(`${num2} is ${percentage.toFixed(2)}% of ${num1}`);

// 🎯 YOUR TURN:
// Try changing num1 and num2 at the top and run again!
