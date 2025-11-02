# ✨ Iteration 4: ES6 Features

## 🎯 Goal
Learn modern JavaScript (ES6+) features that make code cleaner and more powerful.

## 📚 What You'll Learn
- Arrow functions
- Template literals
- Destructuring (arrays and objects)
- Spread and rest operators (...)
- Default parameters
- Modules (import/export)
- Classes and object-oriented programming
- let, const vs var
- Enhanced object literals

## 💻 Files in This Iteration
- `arrow-functions.js` - Modern function syntax
- `destructuring.js` - Extract data easily
- `spread-rest.js` - Work with arrays and objects
- `classes.js` - Object-oriented JavaScript
- `modules/` - Import/export examples

## 🚀 Quick Start
```bash
node arrow-functions.js
node destructuring.js
node spread-rest.js
node classes.js
```

## 🧩 Checkpoint Quiz

1. **What's the main difference between arrow functions and regular functions?**
   - [ ] Arrow functions are faster
   - [x] Arrow functions have different `this` binding and shorter syntax
   - [ ] No difference
   - [ ] Arrow functions don't work with parameters

2. **What does destructuring do?**
   - [x] Extracts values from arrays/objects into variables
   - [ ] Destroys variables
   - [ ] Creates objects
   - [ ] Loops through arrays

3. **What does the spread operator (...) do?**
   - [ ] Creates dots
   - [x] Expands arrays or objects
   - [ ] Deletes items
   - [ ] Counts items

4. **What keyword creates a class in JavaScript?**
   - [ ] object
   - [ ] function
   - [x] class
   - [ ] type

## 🎓 Key Concepts

### Arrow Functions
```javascript
// Old way
function add(a, b) {
    return a + b;
}

// New way
const add = (a, b) => a + b;
```

### Template Literals
```javascript
const name = "John";
const greeting = `Hello, ${name}!`;
```

### Destructuring
```javascript
const [a, b] = [1, 2];
const {name, age} = {name: "John", age: 30};
```

### Spread Operator
```javascript
const arr1 = [1, 2, 3];
const arr2 = [...arr1, 4, 5];  // [1,2,3,4,5]
```

### Classes
```javascript
class Person {
    constructor(name) {
        this.name = name;
    }
    
    greet() {
        return `Hello, I'm ${this.name}`;
    }
}
```

## 🚀 Next Steps
Once you master ES6 features, you're ready for React!
**Iteration 5: React Setup** → Start building modern web apps

---

💡 **Tip**: ES6 features are heavily used in React, so master these first!
