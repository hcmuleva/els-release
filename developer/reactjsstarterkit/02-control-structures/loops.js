// 🔁 Understanding Loops in JavaScript

console.log("=== Understanding Loops ===\n");

// 1. FOR LOOP - When you know how many times to repeat
console.log("--- FOR LOOP ---");

for (let i = 1; i <= 5; i++) {
    console.log(`Iteration ${i}`);
}

// 2. Counting backwards
console.log("\n--- Countdown ---");
for (let i = 5; i >= 1; i--) {
    console.log(i);
}
console.log("Blast off! 🚀");

// 3. Skip by 2 (even numbers)
console.log("\n--- Even Numbers 1-20 ---");
for (let i = 2; i <= 20; i += 2) {
    console.log(i);
}

// 4. WHILE LOOP - When you don't know exact iterations
console.log("\n--- WHILE LOOP ---");

let count = 0;
while (count < 5) {
    console.log(`Count is: ${count}`);
    count++;
}

// 5. DO-WHILE LOOP - Runs at least once
console.log("\n--- DO-WHILE LOOP ---");

let num = 10;
do {
    console.log(`Number: ${num}`);
    num--;
} while (num > 5);

// 6. BREAK - Exit loop early
console.log("\n--- BREAK Example ---");

for (let i = 1; i <= 10; i++) {
    if (i === 5) {
        console.log("Found 5! Breaking...");
        break;  // Exit loop
    }
    console.log(i);
}

// 7. CONTINUE - Skip current iteration
console.log("\n--- CONTINUE Example ---");

for (let i = 1; i <= 10; i++) {
    if (i % 2 === 0) {
        continue;  // Skip even numbers
    }
    console.log(`Odd number: ${i}`);
}

// 8. Nested Loops
console.log("\n--- Nested Loops (Multiplication Table) ---");

for (let i = 1; i <= 5; i++) {
    let row = "";
    for (let j = 1; j <= 5; j++) {
        row += `${i * j}\t`;
    }
    console.log(row);
}

// 9. Loop through array (preview - arrays in detail later)
console.log("\n--- Looping Through Array ---");

const fruits = ["Apple", "Banana", "Orange", "Mango"];

for (let i = 0; i < fruits.length; i++) {
    console.log(`${i + 1}. ${fruits[i]}`);
}

// 10. For...of loop (modern way for arrays)
console.log("\n--- For...of Loop ---");

for (const fruit of fruits) {
    console.log(`I like ${fruit}`);
}

// 🎯 PRACTICE EXERCISES
console.log("\n=== PRACTICE EXERCISES ===\n");

// Exercise 1: Sum of numbers 1-10
console.log("--- Exercise 1: Sum ---");
let sum = 0;
for (let i = 1; i <= 10; i++) {
    sum += i;
}
console.log(`Sum of 1-10: ${sum}`);

// Exercise 2: Factorial
console.log("\n--- Exercise 2: Factorial ---");
const n = 5;
let factorial = 1;
for (let i = 1; i <= n; i++) {
    factorial *= i;
}
console.log(`${n}! = ${factorial}`);

// Exercise 3: Print even numbers in reverse
console.log("\n--- Exercise 3: Even Numbers (Reverse) ---");
for (let i = 20; i >= 2; i -= 2) {
    console.log(i);
}

// Exercise 4: Find first number divisible by both 3 and 5
console.log("\n--- Exercise 4: Find Number ---");
for (let i = 1; i <= 100; i++) {
    if (i % 3 === 0 && i % 5 === 0) {
        console.log(`First number divisible by both 3 and 5: ${i}`);
        break;
    }
}

// Exercise 5: Print pattern
console.log("\n--- Exercise 5: Pattern ---");
for (let i = 1; i <= 5; i++) {
    console.log("*".repeat(i));
}

// Exercise 6: Reverse pattern
console.log("\n--- Exercise 6: Reverse Pattern ---");
for (let i = 5; i >= 1; i--) {
    console.log("*".repeat(i));
}

// Exercise 7: Number pyramid
console.log("\n--- Exercise 7: Number Pyramid ---");
for (let i = 1; i <= 5; i++) {
    let line = "";
    for (let j = 1; j <= i; j++) {
        line += j + " ";
    }
    console.log(line);
}

// 🏆 ADVANCED CHALLENGES

// Challenge 1: FizzBuzz (Classic interview question!)
console.log("\n=== CHALLENGE 1: FizzBuzz ===");
for (let i = 1; i <= 30; i++) {
    if (i % 15 === 0) {
        console.log("FizzBuzz");
    } else if (i % 3 === 0) {
        console.log("Fizz");
    } else if (i % 5 === 0) {
        console.log("Buzz");
    } else {
        console.log(i);
    }
}

// Challenge 2: Prime number checker
console.log("\n=== CHALLENGE 2: Prime Numbers 1-30 ===");
for (let num = 2; num <= 30; num++) {
    let isPrime = true;
    
    for (let i = 2; i <= Math.sqrt(num); i++) {
        if (num % i === 0) {
            isPrime = false;
            break;
        }
    }
    
    if (isPrime) {
        console.log(num);
    }
}

// Challenge 3: Fibonacci sequence
console.log("\n=== CHALLENGE 3: Fibonacci (first 10) ===");
let fib1 = 0;
let fib2 = 1;
console.log(fib1);
console.log(fib2);

for (let i = 2; i < 10; i++) {
    const next = fib1 + fib2;
    console.log(next);
    fib1 = fib2;
    fib2 = next;
}

// Challenge 4: Draw a square
console.log("\n=== CHALLENGE 4: Square Pattern ===");
const size = 5;
for (let i = 0; i < size; i++) {
    if (i === 0 || i === size - 1) {
        console.log("* ".repeat(size));
    } else {
        console.log("* " + "  ".repeat(size - 2) + "*");
    }
}
