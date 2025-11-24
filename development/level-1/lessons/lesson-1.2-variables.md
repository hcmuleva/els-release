# 📘 Lesson 1.2 - Variables in React

## 🎯 Learning Objectives

By the end of this lesson, you will understand:

- What variables are and why we use them
- How to create variables in JavaScript
- Different types of data: strings, numbers, arrays, objects
- How to use variables in JSX with curly braces `{}`
- How to access object properties and array items

---

## 🤔 What are Variables?

**Variables** are like labeled boxes that store information. Instead of writing the same data multiple times, you store it once and reuse it.

### Example Without Variables (❌ Bad):

```jsx
<h1>Welcome John</h1>
<p>Hello John, you are 25 years old</p>
<button>Send message to John</button>
// If name changes, you have to update 3 places!
```

### Example With Variables (✅ Good):

```jsx
const name = "John";
const age = 25;

<h1>Welcome {name}</h1>
<p>Hello {name}, you are {age} years old</p>
<button>Send message to {name}</button>
// If name changes, update only 1 place!
```

---

## 📦 Creating Variables

Use `const` to create variables that won't change:

```javascript
const name = "Alice";
const age = 22;
const city = "New York";
```

---

## 🎨 Using Variables in JSX

Use **curly braces `{}`** to insert variables into JSX:

```jsx
const name = "Alice";

return <h1>Hello {name}!</h1>;
// Output: Hello Alice!
```

---

## 📝 Variable Types

### Strings (Text)

Strings are text wrapped in quotes.

```jsx
function App() {
  const firstName = "John";
  const lastName = "Doe";
  const job = "Developer";

  return (
    <div className="container">
      <h1>
        {firstName} {lastName}
      </h1>
      <p>Job: {job}</p>
    </div>
  );
}
```

**🔬 Try in Practice Lab** ⬆️

---

### Numbers

Numbers don't need quotes. You can do math operations!

```jsx
const price = 99;
const discount = 20;
const finalPrice = price - discount;

return (
  <div className="container">
    <h2>Product Pricing</h2>
    <p>Original: ${price}</p>
    <p>Discount: ${discount}</p>
    <p>Final: ${finalPrice}</p>
  </div>
);
```

**🔬 Try in Practice Lab** ⬆️

---

### Arrays (Lists)

Arrays store multiple values in order. Use **square brackets `[]`**.

**📌 Note:** Arrays start counting from 0!

```jsx
const fruits = ["Apple", "Banana", "Orange"];

return (
  <div className="container">
    <h2>Fruit Shop</h2>
    <p>First: {fruits[0]}</p>
    <p>Second: {fruits[1]}</p>
    <p>Third: {fruits[2]}</p>
  </div>
);
```

**🔬 Try in Practice Lab** ⬆️

---

### Objects (Grouped Data)

Objects store related data together using **curly braces `{}`** and **properties**.

**Access properties with a dot `.`** → `user.name`

```jsx
const user = {
  name: "Alice",
  age: 22,
  city: "New York",
};

return (
  <div className="container">
    <h2>User Profile</h2>
    <p>Name: {user.name}</p>
    <p>Age: {user.age}</p>
    <p>City: {user.city}</p>
  </div>
);
```

**🔬 Try in Practice Lab** ⬆️

---

## 🎯 Complete Example - Student Card

```jsx
function App() {
  const student = {
    name: "Sarah Johnson",
    age: 20,
    major: "Computer Science",
    gpa: 3.8,
  };

  const hobbies = ["Reading", "Coding", "Gaming"];

  return (
    <div className="container">
      <h1>🎓 Student ID Card</h1>
      <h2>{student.name}</h2>
      <p>
        My name is {student.name} and I am {student.age} years old.
      </p>
      <p>Major: {student.major}</p>
      <p>GPA: {student.gpa}</p>

      <h3>Hobbies</h3>
      <ul>
        <li>{hobbies[0]}</li>
        <li>{hobbies[1]}</li>
        <li>{hobbies[2]}</li>
      </ul>
    </div>
  );
}
```

**🔬 Try in Practice Lab** ⬆️

---

## ✅ Practice Exercise

Create a product card with:

- Object with: `name`, `price`, `brand`, `inStock` (true/false)
- Array of 3 features
- Display all information nicely

---

## 🎯 Key Takeaways

✅ **Variables store data and make code reusable**  
✅ **Use `const` to declare variables**  
✅ **Use `{}` to insert variables in JSX**  
✅ **Strings use quotes: `"Hello"`**  
✅ **Arrays use brackets: `["a", "b", "c"]`**  
✅ **Arrays start counting from 0: `array[0]`**  
✅ **Objects use properties: `user.name`**

---

## 🚀 Next Lesson

In **Lesson 1.3**, you'll learn **map, filter, and reduce** - powerful ways to work with arrays!

**Preview:**

```jsx
const names = ["Alice", "Bob", "Charlie"];
names.map((name) => <li>{name}</li>); // Creates list items automatically!
```

---

**Need Help?** Copy any example into your **Practice Lab** and experiment! 🧪
