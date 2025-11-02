// 🌐 DOM Manipulation with JavaScript

console.log("🚀 DOM Script Loaded!");

// ======================
// 1. CLICK COUNTER
// ======================

let clickCount = 0;
const counterBtn = document.getElementById("counterBtn");
const counterDisplay = document.getElementById("counterDisplay");

counterBtn.addEventListener("click", function() {
    clickCount++;
    counterDisplay.textContent = `Clicks: ${clickCount}`;
    
    // Add some fun effects
    if (clickCount === 10) {
        counterDisplay.textContent += " 🎉 You reached 10!";
    }
    if (clickCount === 50) {
        counterDisplay.textContent += " 🏆 WOW! 50 clicks!";
    }
});

// ======================
// 2. TEXT CHANGER
// ======================

const morningBtn = document.getElementById("morningBtn");
const afternoonBtn = document.getElementById("afternoonBtn");
const eveningBtn = document.getElementById("eveningBtn");
const messageDisplay = document.getElementById("messageDisplay");

morningBtn.addEventListener("click", () => {
    messageDisplay.textContent = "☀️ Good morning! Have a great day!";
    messageDisplay.style.background = "#fff3e0";
});

afternoonBtn.addEventListener("click", () => {
    messageDisplay.textContent = "🌤️ Good afternoon! Keep up the good work!";
    messageDisplay.style.background = "#e3f2fd";
});

eveningBtn.addEventListener("click", () => {
    messageDisplay.textContent = "🌙 Good evening! Time to relax!";
    messageDisplay.style.background = "#e8eaf6";
});

// ======================
// 3. COLOR CHANGER
// ======================

const colorBox = document.getElementById("colorBox");
const redBtn = document.getElementById("redBtn");
const greenBtn = document.getElementById("greenBtn");
const blueBtn = document.getElementById("blueBtn");
const randomBtn = document.getElementById("randomBtn");

redBtn.addEventListener("click", () => {
    colorBox.style.background = "#f44336";
    colorBox.textContent = "🔴 Red";
});

greenBtn.addEventListener("click", () => {
    colorBox.style.background = "#4caf50";
    colorBox.textContent = "🟢 Green";
});

blueBtn.addEventListener("click", () => {
    colorBox.style.background = "#2196f3";
    colorBox.textContent = "🔵 Blue";
});

randomBtn.addEventListener("click", () => {
    // Generate random color
    const randomColor = `#${Math.floor(Math.random()*16777215).toString(16)}`;
    colorBox.style.background = randomColor;
    colorBox.textContent = `🎨 ${randomColor}`;
});

// ======================
// 4. TEXT INPUT MIRROR
// ======================

const textInput = document.getElementById("textInput");
const mirrorDisplay = document.getElementById("mirrorDisplay");

textInput.addEventListener("input", function() {
    const text = textInput.value;
    
    if (text === "") {
        mirrorDisplay.textContent = "Your text will appear here";
    } else {
        mirrorDisplay.innerHTML = `
            <strong>You typed:</strong> ${text}<br>
            <strong>Length:</strong> ${text.length} characters<br>
            <strong>Uppercase:</strong> ${text.toUpperCase()}<br>
            <strong>Lowercase:</strong> ${text.toLowerCase()}
        `;
    }
});

// ======================
// 5. SIMPLE CALCULATOR
// ======================

const num1Input = document.getElementById("num1");
const num2Input = document.getElementById("num2");
const calcResult = document.getElementById("calcResult");

function calculate(operation) {
    const num1 = parseFloat(num1Input.value) || 0;
    const num2 = parseFloat(num2Input.value) || 0;
    let result;
    let symbol;
    
    switch(operation) {
        case "add":
            result = num1 + num2;
            symbol = "+";
            break;
        case "subtract":
            result = num1 - num2;
            symbol = "-";
            break;
        case "multiply":
            result = num1 * num2;
            symbol = "×";
            break;
        case "divide":
            if (num2 === 0) {
                calcResult.textContent = "❌ Cannot divide by zero!";
                return;
            }
            result = num1 / num2;
            symbol = "÷";
            break;
    }
    
    calcResult.textContent = `${num1} ${symbol} ${num2} = ${result}`;
}

document.getElementById("addBtn").addEventListener("click", () => calculate("add"));
document.getElementById("subtractBtn").addEventListener("click", () => calculate("subtract"));
document.getElementById("multiplyBtn").addEventListener("click", () => calculate("multiply"));
document.getElementById("divideBtn").addEventListener("click", () => calculate("divide"));

// ======================
// 6. SHOW/HIDE TOGGLE
// ======================

const toggleBtn = document.getElementById("toggleBtn");
const toggleMessage = document.getElementById("toggleMessage");
let isVisible = true;

toggleBtn.addEventListener("click", function() {
    if (isVisible) {
        toggleMessage.style.display = "none";
        toggleBtn.textContent = "Show Message";
        isVisible = false;
    } else {
        toggleMessage.style.display = "block";
        toggleBtn.textContent = "Hide Message";
        isVisible = true;
    }
});

// ======================
// BONUS: Console Messages
// ======================

console.log("✅ All event listeners attached!");
console.log("💡 Tip: Try opening the browser console (F12) to see these messages!");
console.log("🎯 Try clicking buttons and typing in inputs to see DOM manipulation in action!");
