# 🔡 Iteration 1: JavaScript Basics

## 🎯 Goal
Understand JavaScript syntax, variables, data types, and basic operators.

## 📚 What You'll Learn
- Variables: `let`, `const`, `var`
- Data types: Numbers, Strings, Booleans
- Basic operators: arithmetic, comparison, logical
- String concatenation and template literals
- Type checking with `typeof`

## 💻 Files in This Iteration
- `variables.js` - Learn about variables and data types
- `operators.js` - Practice with operators
- `exercises/` - Hands-on practice problems

## 🚀 Quick Start
```bash
# Run the examples
node variables.js
node operators.js

# Try the exercises
node exercises/exercise1.js
node exercises/exercise2.js
node exercises/exercise3.js
```

## 🧩 Checkpoint Quiz

1. **What's the difference between `let` and `const`?**
   - [ ] No difference
   - [x] `const` cannot be reassigned, `let` can
   - [ ] `let` is faster
   - [ ] `const` is only for numbers

2. **What is the result of: `"5" + 5`?**
   - [ ] 10
   - [x] "55"
   - [ ] Error
   - [ ] 5

3. **Which operator checks both value AND type?**
   - [ ] ==
   - [x] ===
   - [ ] =
   - [ ] !=

4. **What does `typeof` do?**
   - [ ] Converts types
   - [x] Returns the data type of a value
   - [ ] Compares types
   - [ ] Creates new types

## 📝 Practice Tasks

### Task 1: Calculate Rectangle Area
Create a program that calculates and displays the area of a rectangle.
- Width: 5
- Height: 4
- Expected output: `Area = 20`

### Task 2: Personal Info Card
Create variables for:
- Your name (string)
- Your age (number)
- Are you a student? (boolean)

Display them in a formatted message.

### Task 3: Temperature Converter
Convert 25°C to Fahrenheit using the formula: `F = (C × 9/5) + 32`

## ✅ Expected Output Examples

**From variables.js:**
```
=== Understanding Variables ===
Name: Alice
Age: 25
Is Student: true
```

**From operators.js:**
```
=== Arithmetic Operators ===
10 + 5 = 15
10 - 5 = 5
10 * 5 = 50
```

## 🎓 Key Concepts

### Variable Declaration
```javascript
let name = "John";      // Can be reassigned
const age = 30;         // Cannot be reassigned
var city = "NYC";       // Old way (avoid)
```

### Data Types
```javascript
let number = 42;             // Number
let text = "Hello";          // String
let isActive = true;         // Boolean
let nothing = null;          // Null
let notDefined;              // Undefined
```

### Template Literals
```javascript
const name = "Alice";
const greeting = `Hello, ${name}!`;  // Modern way
```

## 🚀 Next Steps
Once you complete all exercises and understand variables and operators, move on to:
**Iteration 2: Control Structures** → Learn if/else and loops

---

💡 **Tip**: Use `console.log(typeof variable)` to check what type your variable is!
