// 🔀 Understanding If-Else Statements

console.log("=== Understanding Conditional Statements ===\n");

// 1. Simple IF Statement
const age = 20;

if (age >= 18) {
    console.log("You are an adult!");
}

// 2. IF-ELSE
const temperature = 75;

if (temperature > 80) {
    console.log("It's hot outside! 🌞");
} else {
    console.log("Weather is pleasant! 🌤️");
}

// 3. IF-ELSE IF-ELSE (Multiple conditions)
const score = 85;
let grade;

if (score >= 90) {
    grade = "A";
} else if (score >= 80) {
    grade = "B";
} else if (score >= 70) {
    grade = "C";
} else if (score >= 60) {
    grade = "D";
} else {
    grade = "F";
}

console.log(`Score: ${score}, Grade: ${grade}`);

// 4. Nested IF Statements
const hasTicket = true;
const hasID = true;

if (hasTicket) {
    if (hasID) {
        console.log("\n✅ Welcome to the concert!");
    } else {
        console.log("\n❌ You need an ID to enter.");
    }
} else {
    console.log("\n❌ You need a ticket to enter.");
}

// 5. Logical Operators in Conditions
const userAge = 25;
const hasDriverLicense = true;

// AND (&&) - Both must be true
if (userAge >= 18 && hasDriverLicense) {
    console.log("\nYou can rent a car! 🚗");
}

// OR (||) - At least one must be true
const isWeekend = false;
const isHoliday = true;

if (isWeekend || isHoliday) {
    console.log("No work today! 🎉");
}

// NOT (!) - Inverts boolean
const isRaining = false;

if (!isRaining) {
    console.log("Perfect day for a walk! 🚶");
}

// 6. Ternary Operator (Shorthand)
console.log("\n=== Ternary Operator ===\n");

const points = 150;
const status = points >= 100 ? "Gold Member" : "Regular Member";
console.log(`Status: ${status}`);

// Multiple ternary (be careful - can get confusing!)
const examScore = 75;
const result = examScore >= 90 ? "Excellent" :
               examScore >= 70 ? "Good" :
               examScore >= 50 ? "Pass" : "Fail";
console.log(`Exam result: ${result}`);

// 7. Truthy and Falsy Values
console.log("\n=== Truthy/Falsy ===\n");

// Falsy values: false, 0, "", null, undefined, NaN
// Everything else is truthy

const username = "John";

if (username) {  // Non-empty string is truthy
    console.log(`Welcome, ${username}!`);
}

const items = 0;

if (items) {  // 0 is falsy
    console.log("You have items");
} else {
    console.log("Cart is empty");
}

// 8. Comparison with Different Types
console.log("\n=== Type Comparisons ===\n");

const num = 10;
const str = "10";

console.log(`${num} == "${str}": ${num == str}`);    // true (loose)
console.log(`${num} === "${str}": ${num === str}`);  // false (strict)

// Always use === (strict equality) as best practice!

// 🎯 PRACTICE EXERCISES
console.log("\n=== PRACTICE EXERCISES ===\n");

// Exercise 1: Check if number is positive, negative, or zero
const number = -5;
if (number > 0) {
    console.log(`${number} is positive`);
} else if (number < 0) {
    console.log(`${number} is negative`);
} else {
    console.log(`${number} is zero`);
}

// Exercise 2: Check if year is a leap year
// Leap year: divisible by 4, except century years (must be divisible by 400)
const year = 2024;
if ((year % 4 === 0 && year % 100 !== 0) || (year % 400 === 0)) {
    console.log(`${year} is a leap year`);
} else {
    console.log(`${year} is not a leap year`);
}

// Exercise 3: Traffic light simulator
const lightColor = "green";

if (lightColor === "red") {
    console.log("🛑 Stop!");
} else if (lightColor === "yellow") {
    console.log("⚠️ Slow down!");
} else if (lightColor === "green") {
    console.log("✅ Go!");
} else {
    console.log("❌ Invalid color");
}

// Exercise 4: Calculate discount
const purchaseAmount = 150;
let discount = 0;

if (purchaseAmount >= 200) {
    discount = 0.20;  // 20% discount
} else if (purchaseAmount >= 100) {
    discount = 0.10;  // 10% discount
}

const finalAmount = purchaseAmount * (1 - discount);
console.log(`Purchase: $${purchaseAmount}, Discount: ${discount * 100}%, Final: $${finalAmount.toFixed(2)}`);

// 🏆 CHALLENGE: Age category
const personAge = 35;
let category;

if (personAge < 13) {
    category = "Child";
} else if (personAge < 20) {
    category = "Teenager";
} else if (personAge < 60) {
    category = "Adult";
} else {
    category = "Senior";
}

console.log(`Age ${personAge}: ${category}`);
