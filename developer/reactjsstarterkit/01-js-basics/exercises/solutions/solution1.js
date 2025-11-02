// ✅ Exercise 1 Solution: Personal Info Card

console.log("=== SOLUTION: Personal Info Card ===\n");

// Sample solution with realistic data
const name = "Sarah Johnson";
const age = 24;
const city = "San Francisco";
const isStudent = true;
const favLanguage = "JavaScript";

// Additional info for extra polish
const email = "sarah.j@email.com";
const university = "Tech University";

console.log("╔════════════════════════════════╗");
console.log("║      PERSONAL INFO CARD        ║");
console.log("╚════════════════════════════════╝");
console.log(`Name: ${name}`);
console.log(`Age: ${age} years old`);
console.log(`City: ${city}`);
console.log(`Student: ${isStudent ? "Yes" : "No"}`);

if (isStudent) {
    console.log(`University: ${university}`);
}

console.log(`Email: ${email}`);
console.log(`Favorite Language: ${favLanguage}`);
console.log(`Type of age: ${typeof age}`);
console.log(`Type of name: ${typeof name}`);
console.log(`Type of isStudent: ${typeof isStudent}`);

// Alternative: Create an info object (you'll learn about objects later!)
console.log("\n=== BONUS: Using different formatting ===\n");

const greeting = `Hello! My name is ${name}. I'm ${age} years old and I live in ${city}. ${isStudent ? "I'm currently a student at " + university : "I'm not a student"}. I love programming in ${favLanguage}!`;

console.log(greeting);

// Key Learnings:
// ✓ Used const for values that don't change
// ✓ Used appropriate data types (string, number, boolean)
// ✓ Used template literals for clean string formatting
// ✓ Used typeof to check data types
// ✓ Used ternary operator for conditional display
