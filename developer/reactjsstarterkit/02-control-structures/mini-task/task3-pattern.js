// 🎯 Mini Task 3: Pattern Printer

console.log("=== Pattern Printing ===\n");

// Pattern 1: Right Triangle
console.log("--- Pattern 1: Right Triangle ---");
for (let i = 1; i <= 5; i++) {
    console.log("*".repeat(i));
}

// Pattern 2: Reverse Triangle
console.log("\n--- Pattern 2: Reverse Triangle ---");
for (let i = 5; i >= 1; i--) {
    console.log("*".repeat(i));
}

// Pattern 3: Number Triangle
console.log("\n--- Pattern 3: Number Triangle ---");
for (let i = 1; i <= 5; i++) {
    let line = "";
    for (let j = 1; j <= i; j++) {
        line += j + " ";
    }
    console.log(line);
}

// Pattern 4: Same Number Triangle
console.log("\n--- Pattern 4: Same Number Triangle ---");
for (let i = 1; i <= 5; i++) {
    console.log((i + " ").repeat(i));
}

// Pattern 5: Pyramid (Centered)
console.log("\n--- Pattern 5: Pyramid ---");
const height = 5;
for (let i = 1; i <= height; i++) {
    const spaces = " ".repeat(height - i);
    const stars = "*".repeat(2 * i - 1);
    console.log(spaces + stars);
}

// Pattern 6: Diamond
console.log("\n--- Pattern 6: Diamond ---");
const size = 5;

// Upper half
for (let i = 1; i <= size; i++) {
    const spaces = " ".repeat(size - i);
    const stars = "*".repeat(2 * i - 1);
    console.log(spaces + stars);
}

// Lower half
for (let i = size - 1; i >= 1; i--) {
    const spaces = " ".repeat(size - i);
    const stars = "*".repeat(2 * i - 1);
    console.log(spaces + stars);
}

// Pattern 7: Hollow Square
console.log("\n--- Pattern 7: Hollow Square ---");
const squareSize = 6;

for (let i = 1; i <= squareSize; i++) {
    if (i === 1 || i === squareSize) {
        // First and last row: all stars
        console.log("* ".repeat(squareSize));
    } else {
        // Middle rows: stars only at edges
        console.log("* " + "  ".repeat(squareSize - 2) + "*");
    }
}

// Pattern 8: Number Pyramid
console.log("\n--- Pattern 8: Number Pyramid ---");
for (let i = 1; i <= 5; i++) {
    const spaces = " ".repeat((5 - i) * 2);
    let numbers = "";
    
    // Ascending
    for (let j = 1; j <= i; j++) {
        numbers += j + " ";
    }
    
    // Descending
    for (let j = i - 1; j >= 1; j--) {
        numbers += j + " ";
    }
    
    console.log(spaces + numbers);
}

// Pattern 9: Pascal's Triangle (simplified)
console.log("\n--- Pattern 9: Pascal's Triangle (Numbers) ---");
for (let i = 0; i < 5; i++) {
    const spaces = " ".repeat((5 - i) * 2);
    let row = "";
    
    let num = 1;
    for (let j = 0; j <= i; j++) {
        row += num + "   ";
        num = num * (i - j) / (j + 1);
    }
    
    console.log(spaces + row);
}

// 🏆 CHALLENGE: Checkerboard Pattern
console.log("\n--- CHALLENGE: Checkerboard (8x8) ---");
for (let i = 0; i < 8; i++) {
    let row = "";
    for (let j = 0; j < 8; j++) {
        if ((i + j) % 2 === 0) {
            row += "■ ";
        } else {
            row += "□ ";
        }
    }
    console.log(row);
}

// 🎯 YOUR TURN: Try creating these patterns!
console.log("\n=== YOUR TURN ===");
console.log("Try creating these patterns:");
console.log("1. A triangle of letters (A, AB, ABC, ABCD...)");
console.log("2. An hourglass shape");
console.log("3. A zigzag pattern");
console.log("4. Your initials in stars!");

// Example: Letter Triangle
console.log("\n--- Example: Letter Triangle ---");
for (let i = 1; i <= 5; i++) {
    let line = "";
    for (let j = 0; j < i; j++) {
        line += String.fromCharCode(65 + j) + " ";  // 65 is 'A' in ASCII
    }
    console.log(line);
}
