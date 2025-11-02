// ✨ Arrow Functions in ES6

console.log("=== Arrow Functions ===\n");

// 1. TRADITIONAL FUNCTION
function traditionalAdd(a, b) {
    return a + b;
}

// 2. ARROW FUNCTION (Full syntax)
const arrowAdd = (a, b) => {
    return a + b;
};

// 3. ARROW FUNCTION (Concise - implicit return)
const conciseAdd = (a, b) => a + b;

console.log("Traditional:", traditionalAdd(5, 3));
console.log("Arrow:", arrowAdd(5, 3));
console.log("Concise:", conciseAdd(5, 3));

// 4. SINGLE PARAMETER (no parentheses needed)
const square = n => n * n;
console.log("\nSquare of 7:", square(7));

// 5. NO PARAMETERS (empty parentheses required)
const greet = () => "Hello, World!";
console.log(greet());

// 6. RETURNING OBJECTS (wrap in parentheses)
const createPerson = (name, age) => ({
    name: name,
    age: age
});

console.log("\nPerson object:", createPerson("Alice", 25));

// 7. ARRAY METHODS WITH ARROW FUNCTIONS
const numbers = [1, 2, 3, 4, 5];

// Map: transform each element
const doubled = numbers.map(n => n * 2);
console.log("\nOriginal:", numbers);
console.log("Doubled:", doubled);

// Filter: keep elements that match condition
const evens = numbers.filter(n => n % 2 === 0);
console.log("Even numbers:", evens);

// Reduce: combine all elements
const sum = numbers.reduce((total, n) => total + n, 0);
console.log("Sum:", sum);

// Find: get first match
const firstEven = numbers.find(n => n % 2 === 0);
console.log("First even:", firstEven);

// 8. MULTILINE ARROW FUNCTIONS
const processData = (data) => {
    const cleaned = data.trim();
    const upper = cleaned.toUpperCase();
    return `Processed: ${upper}`;
};

console.log("\n" + processData("  hello world  "));

// 9. PRACTICAL EXAMPLES
const users = [
    { name: "Alice", age: 25 },
    { name: "Bob", age: 30 },
    { name: "Charlie", age: 20 }
];

// Get all names
const names = users.map(user => user.name);
console.log("\nUser names:", names);

// Find users over 21
const adults = users.filter(user => user.age >= 21);
console.log("Adults:", adults);

// Sort by age
const sortedByAge = [...users].sort((a, b) => a.age - b.age);
console.log("Sorted by age:", sortedByAge);

// 10. CHAINING ARRAY METHODS
const result = numbers
    .filter(n => n > 2)        // Keep numbers > 2
    .map(n => n * 2)            // Double them
    .reduce((sum, n) => sum + n, 0);  // Sum them

console.log("\nChained result:", result);  // (3+4+5)*2 = 24

// 🎯 PRACTICE EXERCISES

console.log("\n=== PRACTICE EXERCISES ===\n");

// Exercise 1: Convert to arrow function
const celsiusToFahrenheit = c => c * 9/5 + 32;
console.log("25°C =", celsiusToFahrenheit(25), "°F");

// Exercise 2: Array of squares
const createSquares = arr => arr.map(n => n * n);
console.log("Squares of [1,2,3,4,5]:", createSquares([1,2,3,4,5]));

// Exercise 3: Count even numbers
const countEvens = arr => arr.filter(n => n % 2 === 0).length;
console.log("Even numbers in [1,2,3,4,5,6]:", countEvens([1,2,3,4,5,6]));

// Exercise 4: Get max value
const getMax = arr => Math.max(...arr);
console.log("Max of [3,7,2,9,1]:", getMax([3,7,2,9,1]));

// Exercise 5: Create greeting function
const createGreeting = (name, time = "day") => `Good ${time}, ${name}!`;
console.log(createGreeting("Alice", "morning"));
console.log(createGreeting("Bob"));  // Uses default

// 🏆 ADVANCED EXAMPLES

// Challenge 1: FizzBuzz with arrow functions
const fizzBuzz = n => 
    n % 15 === 0 ? "FizzBuzz" :
    n % 3 === 0 ? "Fizz" :
    n % 5 === 0 ? "Buzz" : n;

console.log("\nFizzBuzz 1-15:");
[...Array(15)].forEach((_, i) => console.log(fizzBuzz(i + 1)));

// Challenge 2: Object transformation
const formatUsers = users => users.map(user => ({
    ...user,
    nameUpper: user.name.toUpperCase(),
    isAdult: user.age >= 18
}));

console.log("\nFormatted users:", formatUsers(users));

// Challenge 3: Group by age category
const categorizeByAge = users => ({
    young: users.filter(u => u.age < 25),
    adult: users.filter(u => u.age >= 25)
});

console.log("\nCategorized:", categorizeByAge(users));
