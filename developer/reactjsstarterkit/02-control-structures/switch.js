// 🔀 Understanding Switch Statements

console.log("=== Understanding Switch Statements ===\n");

// 1. Basic Switch
const day = 3;
let dayName;

switch (day) {
    case 1:
        dayName = "Monday";
        break;
    case 2:
        dayName = "Tuesday";
        break;
    case 3:
        dayName = "Wednesday";
        break;
    case 4:
        dayName = "Thursday";
        break;
    case 5:
        dayName = "Friday";
        break;
    case 6:
        dayName = "Saturday";
        break;
    case 7:
        dayName = "Sunday";
        break;
    default:
        dayName = "Invalid day";
}

console.log(`Day ${day} is: ${dayName}`);

// 2. Switch with Multiple Cases (Fall-through)
console.log("\n--- Day Type ---");

const dayNum = 6;

switch (dayNum) {
    case 1:
    case 2:
    case 3:
    case 4:
    case 5:
        console.log("Weekday - Time to work!");
        break;
    case 6:
    case 7:
        console.log("Weekend - Time to relax!");
        break;
    default:
        console.log("Invalid day number");
}

// 3. Switch with Strings
console.log("\n--- Grade Feedback ---");

const grade = "B";

switch (grade) {
    case "A":
        console.log("Excellent! 🌟");
        break;
    case "B":
        console.log("Good job! 👍");
        break;
    case "C":
        console.log("You passed! 😊");
        break;
    case "D":
        console.log("Need improvement 📚");
        break;
    case "F":
        console.log("Failed. Try again! 💪");
        break;
    default:
        console.log("Invalid grade");
}

// 4. Traffic Light Example
console.log("\n--- Traffic Light ---");

const light = "yellow";

switch (light) {
    case "red":
        console.log("🛑 STOP!");
        break;
    case "yellow":
        console.log("⚠️ SLOW DOWN!");
        break;
    case "green":
        console.log("✅ GO!");
        break;
    default:
        console.log("❌ Invalid light color");
}

// 5. Season Detector
console.log("\n--- Season Detector ---");

const month = "December";

switch (month) {
    case "December":
    case "January":
    case "February":
        console.log("❄️ Winter");
        break;
    case "March":
    case "April":
    case "May":
        console.log("🌸 Spring");
        break;
    case "June":
    case "July":
    case "August":
        console.log("☀️ Summer");
        break;
    case "September":
    case "October":
    case "November":
        console.log("🍂 Fall");
        break;
    default:
        console.log("Invalid month");
}

// 6. Calculator with Switch
console.log("\n--- Calculator ---");

const num1 = 10;
const num2 = 5;
const operator = "+";
let result;

switch (operator) {
    case "+":
        result = num1 + num2;
        break;
    case "-":
        result = num1 - num2;
        break;
    case "*":
        result = num1 * num2;
        break;
    case "/":
        if (num2 !== 0) {
            result = num1 / num2;
        } else {
            result = "Error: Division by zero";
        }
        break;
    default:
        result = "Invalid operator";
}

console.log(`${num1} ${operator} ${num2} = ${result}`);

// 🎯 PRACTICE: Menu System
console.log("\n=== PRACTICE: Restaurant Menu ===");

const menuChoice = 2;

switch (menuChoice) {
    case 1:
        console.log("You ordered: Pizza 🍕 - $12.99");
        break;
    case 2:
        console.log("You ordered: Burger 🍔 - $8.99");
        break;
    case 3:
        console.log("You ordered: Salad 🥗 - $7.50");
        break;
    case 4:
        console.log("You ordered: Pasta 🍝 - $10.99");
        break;
    default:
        console.log("Invalid menu choice");
}

// 🏆 When to use Switch vs If-Else?
console.log("\n=== Switch vs If-Else ===");
console.log("Use SWITCH when:");
console.log("  ✓ Comparing ONE variable against MULTIPLE values");
console.log("  ✓ Values are exact matches (===)");
console.log("  ✓ Many possible cases");
console.log("\nUse IF-ELSE when:");
console.log("  ✓ Complex conditions (ranges, combinations)");
console.log("  ✓ Different variables in each condition");
console.log("  ✓ Comparison operators (<, >, <=, >=)");
