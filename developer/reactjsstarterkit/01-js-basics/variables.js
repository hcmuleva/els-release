// 🔡 Understanding Variables in JavaScript

console.log("=== Understanding Variables ===\n");

// 1. LET - Can be reassigned
let name = "Alice";
console.log("Original name:", name);

name = "Bob";  // This is allowed with 'let'
console.log("Updated name:", name);

// 2. CONST - Cannot be reassigned
const age = 25;
console.log("Age:", age);

// Uncomment to see error:
// age = 26;  // ❌ Error! Cannot reassign const

// 3. Data Types
const fullName = "John Doe";           // String
const studentAge = 20;                 // Number
const isStudent = true;                // Boolean
const gpa = 3.75;                      // Number (decimals)

console.log("\n=== Data Types ===");
console.log("Full Name:", fullName, "- Type:", typeof fullName);
console.log("Age:", studentAge, "- Type:", typeof studentAge);
console.log("Is Student:", isStudent, "- Type:", typeof isStudent);
console.log("GPA:", gpa, "- Type:", typeof gpa);

// 4. String Concatenation (Old way)
const firstName = "Jane";
const lastName = "Smith";
const greeting1 = "Hello, " + firstName + " " + lastName + "!";
console.log("\n=== String Concatenation ===");
console.log(greeting1);

// 5. Template Literals (Modern way - PREFERRED)
const greeting2 = `Hello, ${firstName} ${lastName}!`;
console.log(greeting2);

// You can do calculations inside template literals!
const price = 100;
const tax = 10;
console.log(`Total Price: $${price + tax}`);

// 6. Multiple Variables
let x = 10;
let y = 20;
let z = 30;
console.log("\n=== Multiple Variables ===");
console.log("x:", x, "y:", y, "z:", z);
console.log(`Sum: ${x + y + z}`);

// 🎯 YOUR TURN: 
console.log("\n=== YOUR EXERCISE ===");
console.log("Create variables for a rectangle and calculate its area:");

// Create these variables:
const width = 5;
const height = 4;
const area = width * height;

console.log(`Width: ${width}`);
console.log(`Height: ${height}`);
console.log(`Area: ${area}`);

// 🏆 CHALLENGE:
// Create variables for your personal info:
// - Your name
// - Your favorite number
// - Your favorite color
// Display them using template literals

console.log("\n=== CHALLENGE - Personal Info ===");
// Add your code here:
const myName = "Your Name";
const favoriteNumber = 7;
const favoriteColor = "Blue";

console.log(`Hi! I'm ${myName}.`);
console.log(`My favorite number is ${favoriteNumber}.`);
console.log(`My favorite color is ${favoriteColor}.`);
