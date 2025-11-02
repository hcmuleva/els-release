# ⚙️ Iteration 3: Functions and DOM

## 🎯 Goal
Learn to create reusable code with functions and make web pages interactive by manipulating the DOM (Document Object Model).

## 📚 What You'll Learn
- Function declaration and expressions
- Parameters and return values
- Arrow functions (preview)
- What is the DOM
- Selecting elements: `querySelector`, `getElementById`
- Changing content and styles
- Event listeners: `click`, `input`, etc.
- Building interactive web pages

## 💻 Files in This Iteration
- `functions.js` - Understanding functions
- `index.html` - Your first web page
- `dom-basics.html` - DOM manipulation examples
- `script.js` - JavaScript for the web page
- `task/` - Interactive exercises

## 🚀 Quick Start

### For Node.js files:
```bash
node functions.js
```

### For HTML files:
1. Open the HTML file in your browser (double-click or right-click → Open with Chrome/Firefox)
2. Open the browser console (F12 or Right-click → Inspect → Console)
3. See your JavaScript in action!

## 🧩 Checkpoint Quiz

1. **What does a function do?**
   - [ ] Stores data
   - [x] Groups reusable code
   - [ ] Creates variables
   - [ ] Loops through arrays

2. **What does `return` do?**
   - [ ] Exits the program
   - [x] Sends a value back from the function
   - [ ] Loops back to the start
   - [ ] Prints to console

3. **What is the DOM?**
   - [ ] A database
   - [ ] A programming language
   - [x] The HTML document structure that JavaScript can manipulate
   - [ ] A code editor

4. **How do you select an element with id="myButton"?**
   - [ ] `getElement("myButton")`
   - [ ] `select("#myButton")`
   - [x] `document.getElementById("myButton")` or `document.querySelector("#myButton")`
   - [ ] `find("myButton")`

## 📝 Practice Tasks

### Task 1: Calculator Function
Create functions for:
- add(a, b)
- subtract(a, b)
- multiply(a, b)
- divide(a, b)

### Task 2: Click Counter
Build a button that counts how many times it's been clicked.

### Task 3: Color Changer
Create buttons that change the background color of the page.

### Task 4: Text Transformer
Build an input that shows text in different formats (uppercase, lowercase, reverse).

## ✅ Expected Output Examples

**From functions.js:**
```
add(5, 3) = 8
Greeting: Hello, Alice!
Square of 7 = 49
```

**From browser (DOM):**
```
[Button shows: Clicked 3 times]
[Background changes color when button clicked]
[Text transforms as you type]
```

## 🎓 Key Concepts

### Function Declaration
```javascript
function greet(name) {
    return `Hello, ${name}!`;
}
```

### Function Expression
```javascript
const greet = function(name) {
    return `Hello, ${name}!`;
};
```

### Arrow Function
```javascript
const greet = (name) => `Hello, ${name}!`;
```

### Selecting Elements
```javascript
const button = document.getElementById("myButton");
const element = document.querySelector(".myClass");
```

### Adding Event Listeners
```javascript
button.addEventListener("click", function() {
    console.log("Button clicked!");
});
```

### Changing Content
```javascript
element.textContent = "New text";
element.innerHTML = "<strong>Bold text</strong>";
element.style.color = "blue";
```

## 🚀 Next Steps
Once you can create functions and manipulate the DOM, move on to:
**Iteration 4: ES6 Features** → Modern JavaScript syntax

---

💡 **Tip**: Use `console.log()` inside functions to debug and understand the flow!
