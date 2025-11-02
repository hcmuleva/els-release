// 🎯 Exercise 1: Personal Info Card

console.log("=== Exercise 1: Personal Info Card ===\n");

// TODO: Create variables for:
// 1. Your name (string)
// 2. Your age (number)
// 3. Your city (string)
// 4. Are you a student? (boolean)
// 5. Your favorite programming language (string)

// Your code here:
const name = "Your Name";
const age = 25;
const city = "Your City";
const isStudent = true;
const favLanguage = "JavaScript";

// Display the info card
console.log("╔════════════════════════════════╗");
console.log("║      PERSONAL INFO CARD        ║");
console.log("╚════════════════════════════════╝");
console.log(`Name: ${name}`);
console.log(`Age: ${age}`);
console.log(`City: ${city}`);
console.log(`Student: ${isStudent ? "Yes" : "No"}`);
console.log(`Favorite Language: ${favLanguage}`);

// ✅ EXPECTED OUTPUT (with your data):
// ╔════════════════════════════════╗
// ║      PERSONAL INFO CARD        ║
// ╚════════════════════════════════╝
// Name: John Doe
// Age: 25
// City: New York
// Student: Yes
// Favorite Language: JavaScript
