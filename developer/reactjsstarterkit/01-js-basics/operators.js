// ⚙️ Understanding Operators in JavaScript

console.log("=== Arithmetic Operators ===\n");

// Basic Math Operations
const a = 10;
const b = 5;

console.log(`${a} + ${b} = ${a + b}`);    // Addition
console.log(`${a} - ${b} = ${a - b}`);    // Subtraction
console.log(`${a} * ${b} = ${a * b}`);    // Multiplication
console.log(`${a} / ${b} = ${a / b}`);    // Division
console.log(`${a} % ${b} = ${a % b}`);    // Modulus (remainder)
console.log(`${a} ** ${b} = ${a ** b}`);  // Exponentiation (10^5)

// Order of Operations (PEMDAS)
const result = 10 + 5 * 2;  // Multiplication happens first
console.log(`\n10 + 5 * 2 = ${result}`);  // 20, not 30

const resultWithParens = (10 + 5) * 2;  // Parentheses first
console.log(`(10 + 5) * 2 = ${resultWithParens}`);  // 30

// === Comparison Operators ===
console.log("\n=== Comparison Operators ===\n");

const x = 10;
const y = 5;
const z = "10";

console.log(`${x} > ${y} is ${x > y}`);      // Greater than
console.log(`${x} < ${y} is ${x < y}`);      // Less than
console.log(`${x} >= 10 is ${x >= 10}`);     // Greater or equal
console.log(`${x} <= 10 is ${x <= 10}`);     // Less or equal

// == vs === (IMPORTANT!)
console.log(`\n${x} == "${z}" is ${x == z}`);   // Loose equality (converts types)
console.log(`${x} === "${z}" is ${x === z}`);   // Strict equality (checks type too)

// BEST PRACTICE: Always use === and !== (strict comparison)
console.log(`${x} !== ${y} is ${x !== y}`);

// === Logical Operators ===
console.log("\n=== Logical Operators ===\n");

const isAdult = true;
const hasLicense = false;

console.log(`AND (&&): isAdult && hasLicense = ${isAdult && hasLicense}`);  // Both must be true
console.log(`OR (||): isAdult || hasLicense = ${isAdult || hasLicense}`);   // At least one must be true
console.log(`NOT (!): !hasLicense = ${!hasLicense}`);                       // Inverts the value

// Real-world example
const age = 20;
const hasID = true;

const canEnterClub = age >= 18 && hasID;
console.log(`\nCan enter club? ${canEnterClub}`);

// === String Operators ===
console.log("\n=== String Operators ===\n");

const firstName = "John";
const lastName = "Doe";

const fullName = firstName + " " + lastName;  // String concatenation
console.log(`Full Name: ${fullName}`);

// Concatenation with numbers
const score = 100;
console.log("Score: " + score);        // "Score: 100" (string)
console.log("Score: " + score + 50);   // "Score: 10050" (concatenation!)
console.log("Score: " + (score + 50)); // "Score: 150" (addition first)

// === Increment/Decrement ===
console.log("\n=== Increment/Decrement ===\n");

let counter = 0;
console.log("Initial:", counter);

counter++;  // Same as: counter = counter + 1
console.log("After counter++:", counter);

counter += 5;  // Same as: counter = counter + 5
console.log("After counter += 5:", counter);

counter--;  // Same as: counter = counter - 1
console.log("After counter--:", counter);

// === Type Coercion (Be Careful!) ===
console.log("\n=== Type Coercion ===\n");

console.log("5" + 5);      // "55" (string concatenation)
console.log("5" - 5);      // 0 (numeric subtraction)
console.log("5" * "2");    // 10 (numeric multiplication)
console.log(true + 1);     // 2 (true becomes 1)
console.log(false + 1);    // 1 (false becomes 0)

// 🎯 YOUR TURN: Practice Problems
console.log("\n=== PRACTICE PROBLEMS ===\n");

// Problem 1: Calculate the area of a circle
// Formula: area = π * r²
const radius = 7;
const pi = 3.14159;
const circleArea = pi * radius ** 2;
console.log(`Circle area with radius ${radius}: ${circleArea.toFixed(2)}`);

// Problem 2: Temperature Conversion
// Convert 25°C to Fahrenheit
// Formula: F = (C × 9/5) + 32
const celsius = 25;
const fahrenheit = (celsius * 9/5) + 32;
console.log(`${celsius}°C = ${fahrenheit}°F`);

// Problem 3: Check eligibility
// Can vote if age >= 18
const voterAge = 20;
const canVote = voterAge >= 18;
console.log(`Age ${voterAge} can vote: ${canVote}`);

// 🏆 CHALLENGES:
console.log("\n=== CHALLENGES ===\n");

// Challenge 1: Calculate BMI
// Formula: BMI = weight(kg) / height(m)²
const weight = 70;  // kg
const height = 1.75; // meters
// Add your code here:
const bmi = weight / (height ** 2);
console.log(`BMI: ${bmi.toFixed(2)}`);

// Challenge 2: Discount Calculator
// Original price: $100
// Discount: 20%
// Calculate final price
const originalPrice = 100;
const discountPercent = 20;
// Add your code here:
const discount = originalPrice * (discountPercent / 100);
const finalPrice = originalPrice - discount;
console.log(`Original: $${originalPrice}, Discount: ${discountPercent}%, Final: $${finalPrice}`);

// Challenge 3: Check if number is even or odd
// Use modulus operator (%)
const number = 15;
const isEven = number % 2 === 0;
console.log(`${number} is even: ${isEven}`);
