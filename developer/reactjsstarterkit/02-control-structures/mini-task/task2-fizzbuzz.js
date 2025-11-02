// 🎯 Mini Task 2: FizzBuzz Challenge

console.log("=== FizzBuzz Challenge ===\n");

/*
 * CLASSIC INTERVIEW QUESTION!
 * 
 * Rules:
 * - Print numbers from 1 to 100
 * - For multiples of 3, print "Fizz" instead
 * - For multiples of 5, print "Buzz" instead
 * - For multiples of both 3 and 5, print "FizzBuzz"
 */

console.log("--- FizzBuzz 1-100 ---");

for (let i = 1; i <= 100; i++) {
    if (i % 15 === 0) {  // Multiple of both 3 and 5
        console.log("FizzBuzz");
    } else if (i % 3 === 0) {  // Multiple of 3
        console.log("Fizz");
    } else if (i % 5 === 0) {  // Multiple of 5
        console.log("Buzz");
    } else {
        console.log(i);
    }
}

// 🏆 VARIATION 1: FizzBuzz on one line
console.log("\n--- FizzBuzz (Compact) ---");

for (let i = 1; i <= 30; i++) {
    const output = (i % 15 === 0) ? "FizzBuzz" :
                   (i % 3 === 0) ? "Fizz" :
                   (i % 5 === 0) ? "Buzz" : i;
    console.log(output);
}

// 🏆 VARIATION 2: Count occurrences
console.log("\n--- FizzBuzz Stats ---");

let fizzCount = 0;
let buzzCount = 0;
let fizzBuzzCount = 0;

for (let i = 1; i <= 100; i++) {
    if (i % 15 === 0) {
        fizzBuzzCount++;
    } else if (i % 3 === 0) {
        fizzCount++;
    } else if (i % 5 === 0) {
        buzzCount++;
    }
}

console.log(`Fizz appeared: ${fizzCount} times`);
console.log(`Buzz appeared: ${buzzCount} times`);
console.log(`FizzBuzz appeared: ${fizzBuzzCount} times`);

// 🎯 CHALLENGE: Custom FizzBuzz
console.log("\n=== CHALLENGE: Custom FizzBuzz ===");
console.log("Rules: Multiple of 7 = 'Boom', Multiple of 11 = 'Bang'\n");

for (let i = 1; i <= 77; i++) {
    if (i % 77 === 0) {  // Multiple of both 7 and 11
        console.log(`${i}: BoomBang`);
    } else if (i % 7 === 0) {
        console.log(`${i}: Boom`);
    } else if (i % 11 === 0) {
        console.log(`${i}: Bang`);
    } else {
        console.log(i);
    }
}

// 🧠 WHY IS THIS USEFUL?
// FizzBuzz tests:
// ✓ Understanding of modulus operator (%)
// ✓ Conditional logic
// ✓ Order of conditions (check 15 before 3 and 5!)
// ✓ Loop control
