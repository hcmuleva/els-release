// 🎯 Mini Task 1: Grade Calculator

console.log("=== Grade Calculator ===\n");

// TODO: Complete this grade calculator
// Convert numeric score to letter grade

const score = 87;  // Try changing this value!

// Your code here:
let grade;
let feedback;

if (score >= 90 && score <= 100) {
    grade = "A";
    feedback = "Outstanding! 🌟";
} else if (score >= 80) {
    grade = "B";
    feedback = "Great job! 👍";
} else if (score >= 70) {
    grade = "C";
    feedback = "Good work! 😊";
} else if (score >= 60) {
    grade = "D";
    feedback = "Passed, but need improvement 📚";
} else if (score >= 0) {
    grade = "F";
    feedback = "Failed. Keep trying! 💪";
} else {
    grade = "Invalid";
    feedback = "Score must be between 0-100";
}

console.log(`Score: ${score}`);
console.log(`Grade: ${grade}`);
console.log(`Feedback: ${feedback}`);

// 🏆 BONUS: Add grade point average (GPA)
let gpa;

switch (grade) {
    case "A":
        gpa = 4.0;
        break;
    case "B":
        gpa = 3.0;
        break;
    case "C":
        gpa = 2.0;
        break;
    case "D":
        gpa = 1.0;
        break;
    case "F":
        gpa = 0.0;
        break;
    default:
        gpa = 0.0;
}

console.log(`GPA: ${gpa}`);

// 🎯 CHALLENGE: Multiple subjects
console.log("\n=== CHALLENGE: Calculate Average Grade ===");

const math = 85;
const english = 92;
const science = 78;
const history = 88;

const average = (math + english + science + history) / 4;
console.log(`Math: ${math}`);
console.log(`English: ${english}`);
console.log(`Science: ${science}`);
console.log(`History: ${history}`);
console.log(`Average: ${average.toFixed(2)}`);

if (average >= 90) {
    console.log("Overall Grade: A - Excellent student! 🏆");
} else if (average >= 80) {
    console.log("Overall Grade: B - Good student! ⭐");
} else if (average >= 70) {
    console.log("Overall Grade: C - Average student");
} else {
    console.log("Overall Grade: Needs improvement");
}

// ✅ Expected Output (for score = 87):
// Score: 87
// Grade: B
// Feedback: Great job! 👍
// GPA: 3.0
