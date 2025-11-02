# 🔁 Iteration 2: Control Structures

## 🎯 Goal
Learn to make decisions in code and repeat actions using control structures.

## 📚 What You'll Learn
- Conditional statements: `if`, `else if`, `else`
- Ternary operator: `? :`
- Switch statements
- Loops: `for`, `while`, `do...while`
- Loop control: `break` and `continue`
- Nested loops and conditions

## 💻 Files in This Iteration
- `if-else.js` - Decision making with conditionals
- `loops.js` - Repeating actions with loops
- `switch.js` - Multiple conditions with switch
- `mini-task/` - Practical exercises

## 🚀 Quick Start
```bash
# Run the examples
node if-else.js
node loops.js
node switch.js

# Try the mini-tasks
node mini-task/task1-grade-calculator.js
node mini-task/task2-fizzbuzz.js
node mini-task/task3-pattern.js
```

## 🧩 Checkpoint Quiz

1. **What does `else if` do?**
   - [ ] Ends the if statement
   - [x] Checks another condition if the previous was false
   - [ ] Runs code always
   - [ ] Same as else

2. **Which loop is guaranteed to run at least once?**
   - [ ] for loop
   - [ ] while loop
   - [x] do...while loop
   - [ ] if loop

3. **What does `break` do in a loop?**
   - [ ] Skips current iteration
   - [x] Exits the loop completely
   - [ ] Continues the loop
   - [ ] Does nothing

4. **What's the result of: `10 > 5 ? "Yes" : "No"`**
   - [x] "Yes"
   - [ ] "No"
   - [ ] true
   - [ ] Error

## 📝 Practice Tasks

### Task 1: Grade Calculator
Create a program that converts a numeric score to a letter grade:
- 90-100: A
- 80-89: B
- 70-79: C
- 60-69: D
- Below 60: F

### Task 2: FizzBuzz Challenge
Print numbers 1-100, but:
- For multiples of 3, print "Fizz"
- For multiples of 5, print "Buzz"
- For multiples of both, print "FizzBuzz"

### Task 3: Pattern Printer
Print a triangle pattern:
```
*
**
***
****
*****
```

## ✅ Expected Output Examples

**From if-else.js:**
```
Age 25: You are an adult
Temperature 75°F: Pleasant weather
Score 85: Grade B
```

**From loops.js:**
```
Even numbers 1-20: 2, 4, 6, 8, 10, 12, 14, 16, 18, 20
Countdown: 5, 4, 3, 2, 1, Blast off!
```

## 🎓 Key Concepts

### If-Else
```javascript
if (condition) {
    // runs if condition is true
} else if (anotherCondition) {
    // runs if first is false, this is true
} else {
    // runs if all above are false
}
```

### Ternary Operator (Shorthand)
```javascript
const result = condition ? valueIfTrue : valueIfFalse;
```

### For Loop
```javascript
for (let i = 0; i < 10; i++) {
    console.log(i);
}
```

### While Loop
```javascript
let count = 0;
while (count < 10) {
    console.log(count);
    count++;
}
```

### Switch Statement
```javascript
switch (value) {
    case 1:
        // code
        break;
    case 2:
        // code
        break;
    default:
        // code
}
```

## 🚀 Next Steps
Once you master control structures, move on to:
**Iteration 3: Functions and DOM** → Create reusable code and interact with web pages

---

💡 **Tip**: Use `console.log()` inside loops and conditions to debug and understand the flow!
