// ⚙️ Understanding Functions in JavaScript

console.log("=== Understanding Functions ===\n");

// 1. FUNCTION DECLARATION
function greet() {
    console.log("Hello, World!");
}

greet();  // Call the function

// 2. FUNCTION WITH PARAMETERS
function greetPerson(name) {
    console.log(`Hello, ${name}!`);
}

greetPerson("Alice");
greetPerson("Bob");

// 3. FUNCTION WITH RETURN VALUE
function add(a, b) {
    return a + b;
}

const sum = add(5, 3);
console.log(`5 + 3 = ${sum}`);

// 4. FUNCTION EXPRESSION
const multiply = function(a, b) {
    return a * b;
}

console.log(`4 * 7 = ${multiply(4, 7)}`);

// 5. ARROW FUNCTION (Modern ES6)
const subtract = (a, b) => a - b;

console.log(`10 - 3 = ${subtract(10, 3)}`);

// 6. FUNCTION WITH MULTIPLE PARAMETERS
function calculateArea(width, height) {
    const area = width * height;
    return area;
}

console.log(`\nArea of 5x4 rectangle: ${calculateArea(5, 4)}`);

// 7. FUNCTION WITH DEFAULT PARAMETERS
function greetWithTime(name = "Guest", time = "day") {
    return `Good ${time}, ${name}!`;
}

console.log(greetWithTime("John", "morning"));
console.log(greetWithTime("Sarah"));  // Uses defaults
console.log(greetWithTime());  // Uses both defaults

// 8. FUNCTION RETURNING OBJECT
function createPerson(name, age) {
    return {
        name: name,
        age: age,
        introduce: function() {
            return `Hi, I'm ${this.name} and I'm ${this.age} years old.`;
        }
    };
}

const person1 = createPerson("Emma", 25);
console.log(`\n${person1.introduce()}`);

// 9. FUNCTIONS CALLING OTHER FUNCTIONS
function square(n) {
    return n * n;
}

function sumOfSquares(a, b) {
    return square(a) + square(b);
}

console.log(`\nSum of squares of 3 and 4: ${sumOfSquares(3, 4)}`);

// 10. SCOPE - Variables inside functions
function testScope() {
    const localVar = "I'm local";
    console.log(localVar);  // Works
}

testScope();
// console.log(localVar);  // ❌ Error! localVar is not defined outside

// 11. RECURSIVE FUNCTION (function calling itself)
function factorial(n) {
    if (n <= 1) return 1;
    return n * factorial(n - 1);
}

console.log(`\n5! = ${factorial(5)}`);

// 🎯 PRACTICE EXERCISES
console.log("\n=== PRACTICE EXERCISES ===\n");

// Exercise 1: Temperature converter
function celsiusToFahrenheit(celsius) {
    return (celsius * 9/5) + 32;
}

console.log(`25°C = ${celsiusToFahrenheit(25)}°F`);

// Exercise 2: Check if number is even
function isEven(number) {
    return number % 2 === 0;
}

console.log(`Is 7 even? ${isEven(7)}`);
console.log(`Is 10 even? ${isEven(10)}`);

// Exercise 3: Find maximum of two numbers
function max(a, b) {
    return a > b ? a : b;
}

console.log(`Max of 15 and 23: ${max(15, 23)}`);

// Exercise 4: Calculate circle area
function circleArea(radius) {
    return Math.PI * radius ** 2;
}

console.log(`Circle area (radius 5): ${circleArea(5).toFixed(2)}`);

// Exercise 5: Greeting based on time
function greetByTime(hour) {
    if (hour < 12) return "Good morning!";
    if (hour < 18) return "Good afternoon!";
    return "Good evening!";
}

console.log(`At 9 AM: ${greetByTime(9)}`);
console.log(`At 3 PM: ${greetByTime(15)}`);
console.log(`At 8 PM: ${greetByTime(20)}`);

// 🏆 ADVANCED CHALLENGES

// Challenge 1: Array sum
function sumArray(arr) {
    let sum = 0;
    for (let num of arr) {
        sum += num;
    }
    return sum;
}

console.log(`\nSum of [1,2,3,4,5]: ${sumArray([1,2,3,4,5])}`);

// Challenge 2: Count vowels in string
function countVowels(str) {
    const vowels = "aeiouAEIOU";
    let count = 0;
    for (let char of str) {
        if (vowels.includes(char)) count++;
    }
    return count;
}

console.log(`Vowels in "Hello World": ${countVowels("Hello World")}`);

// Challenge 3: Reverse string
function reverseString(str) {
    return str.split("").reverse().join("");
}

console.log(`Reverse of "JavaScript": ${reverseString("JavaScript")}`);

// Challenge 4: Check palindrome
function isPalindrome(str) {
    const cleaned = str.toLowerCase().replace(/[^a-z0-9]/g, "");
    return cleaned === reverseString(cleaned);
}

console.log(`Is "racecar" a palindrome? ${isPalindrome("racecar")}`);
console.log(`Is "hello" a palindrome? ${isPalindrome("hello")}`);

// Challenge 5: FizzBuzz as function
function fizzBuzz(n) {
    if (n % 15 === 0) return "FizzBuzz";
    if (n % 3 === 0) return "Fizz";
    if (n % 5 === 0) return "Buzz";
    return n.toString();
}

console.log("\nFizzBuzz for 1-15:");
for (let i = 1; i <= 15; i++) {
    console.log(fizzBuzz(i));
}
