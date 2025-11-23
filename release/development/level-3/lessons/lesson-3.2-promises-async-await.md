# 📘 Lesson 3.2 - Promises & Async/Await

**Duration:** 45 minutes  
**Difficulty:** Intermediate

---

## 🎯 Learning Objectives

By the end of this lesson, you will:

- ✅ Understand **asynchronous JavaScript** and why we need it
- ✅ Learn what a **Promise** is and its three states
- ✅ Master **async/await** syntax
- ✅ Handle errors with **try/catch**
- ✅ Use **Promise.all()** for parallel operations
- ✅ Know when to use Promises vs async/await

---

## ⏰ The Problem: Synchronous vs Asynchronous

### What's Synchronous Code?

Code that runs **one line at a time**, waiting for each to finish:

```javascript
// 🔬 COPY THIS - Synchronous example
console.log("Step 1");
console.log("Step 2");
console.log("Step 3");

// Output (immediate):
// Step 1
// Step 2
// Step 3
```

**Simple, but has a BIG problem...**

---

### The Problem with Sync Code

JavaScript is **single-threaded** - it can only do **one thing at a time**.

```javascript
// ❌ This would FREEZE your entire app!
function getDataFromServer() {
  // Imagine this takes 5 seconds...
  // Your entire app is frozen during this time!
  // User can't click buttons, scroll, or do ANYTHING
  return data;
}

const data = getDataFromServer(); // App frozen for 5 seconds 😱
console.log(data);
```

**Solution:** We need **asynchronous** code!

---

## 🚀 What is Asynchronous Code?

Code that **starts a task** and **continues running** without waiting!

**Real-world analogy:**

```
☕ Coffee Shop Example:

Synchronous (slow):
1. Customer 1 orders coffee → wait 5 min → serve
2. Customer 2 orders coffee → wait 5 min → serve
3. Customer 3 orders coffee → wait 5 min → serve
(15 minutes total for 3 customers!)

Asynchronous (fast):
1. Customer 1 orders → start making (don't wait)
2. Customer 2 orders → start making (don't wait)
3. Customer 3 orders → start making (don't wait)
(5 minutes total - all done at once!)
```

---

## 🎁 What is a Promise?

A **Promise** is an object representing the **eventual completion** (or failure) of an asynchronous operation.

**Think of it like ordering food delivery:**

```
1. You place order (Promise created)
2. You continue watching TV (code keeps running)
3. Food arrives OR doesn't arrive (Promise resolves or rejects)
```

---

## 📊 Promise States

A Promise has **three states**:

| State         | Meaning                 | Example                |
| ------------- | ----------------------- | ---------------------- |
| **Pending**   | Still waiting           | Food is being prepared |
| **Fulfilled** | Success! Got the data   | Food delivered ✅      |
| **Rejected**  | Failed (error occurred) | Restaurant closed ❌   |

**Important:** A Promise can only change state **once**!

---

## 💻 Creating a Promise

### Example 1: Basic Promise

```javascript
// 🔬 COPY THIS - Creating a simple Promise
const myPromise = new Promise((resolve, reject) => {
  const success = true;

  setTimeout(() => {
    if (success) {
      resolve("✅ Data received!"); // Success
    } else {
      reject("❌ Error occurred!"); // Failure
    }
  }, 2000); // Wait 2 seconds
});

// Using the Promise
myPromise
  .then((data) => {
    console.log(data); // "✅ Data received!" after 2 seconds
  })
  .catch((error) => {
    console.error(error); // If something went wrong
  });

console.log("⏳ Waiting for promise...");
```

**Output:**

```
⏳ Waiting for promise...
(2 seconds later...)
✅ Data received!
```

**See?** The last `console.log` ran **immediately**, didn't wait!

---

### Example 2: Real-World Promise (Simulated API Call)

```javascript
// 🔬 COPY THIS - Simulated API call
function fetchUserData(userId) {
  return new Promise((resolve, reject) => {
    console.log("📡 Fetching user data...");

    setTimeout(() => {
      if (userId > 0) {
        // Simulate successful API response
        resolve({
          id: userId,
          name: "Alice Johnson",
          email: "alice@college.edu",
        });
      } else {
        // Simulate error
        reject("Invalid user ID");
      }
    }, 1500); // Simulate network delay
  });
}

// Using the function
fetchUserData(1)
  .then((user) => {
    console.log("👤 User:", user);
  })
  .catch((error) => {
    console.error("❌ Error:", error);
  });
```

**Output:**

```
📡 Fetching user data...
(1.5 seconds later...)
👤 User: { id: 1, name: 'Alice Johnson', email: 'alice@college.edu' }
```

---

## 🔗 Promise Chaining

You can **chain multiple `.then()` calls**:

```javascript
// 🔬 COPY THIS - Promise chaining
function getUser(id) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({ id, name: "Alice" });
    }, 1000);
  });
}

function getUserPosts(userId) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(["Post 1", "Post 2", "Post 3"]);
    }, 1000);
  });
}

// Chain them together
getUser(1)
  .then((user) => {
    console.log("Got user:", user);
    return getUserPosts(user.id); // Return another Promise
  })
  .then((posts) => {
    console.log("Got posts:", posts);
  })
  .catch((error) => {
    console.error("Error:", error);
  });
```

**Output:**

```
(1 second later...)
Got user: { id: 1, name: 'Alice' }
(1 second later...)
Got posts: ['Post 1', 'Post 2', 'Post 3']
```

**Problem:** This gets messy with many steps! 😵 Enter **async/await**...

---

## 🌟 async/await - The Modern Way

**async/await** makes Promises look **synchronous** (much easier to read)!

### Rules:

1. **`async` before function** - tells JavaScript "this function uses await"
2. **`await` before Promise** - "wait for this Promise to resolve"
3. **`try/catch` for errors** - replaces `.catch()`

---

### Example 3: Basic async/await

```javascript
// 🔬 COPY THIS - async/await basics

// ========================================
// OLD WAY: Promise chaining
// ========================================
function getUserOldWay() {
  fetchUserData(1)
    .then((user) => {
      console.log("User:", user);
    })
    .catch((error) => {
      console.error("Error:", error);
    });
}

// ========================================
// NEW WAY: async/await (cleaner!)
// ========================================
async function getUserNewWay() {
  try {
    const user = await fetchUserData(1);
    console.log("User:", user);
  } catch (error) {
    console.error("Error:", error);
  }
}

getUserNewWay();
```

**Much easier to read!** 📖

---

### Example 4: Multiple async Operations

```javascript
// 🔬 COPY THIS - Multiple await calls
async function getUserAndPosts(userId) {
  try {
    console.log("Fetching user...");
    const user = await getUser(userId);
    console.log("✅ Got user:", user.name);

    console.log("Fetching posts...");
    const posts = await getUserPosts(user.id);
    console.log("✅ Got posts:", posts);

    return { user, posts };
  } catch (error) {
    console.error("❌ Error:", error);
    throw error; // Re-throw to let caller handle it
  }
}

getUserAndPosts(1);
```

**Output:**

```
Fetching user...
(1 second later...)
✅ Got user: Alice
Fetching posts...
(1 second later...)
✅ Got posts: ['Post 1', 'Post 2', 'Post 3']
```

**Each `await` waits for the previous one to finish.**

---

## ⚡ Promise.all() - Parallel Execution

What if you want to run **multiple Promises at once** (faster)?

### Example 5: Sequential vs Parallel

```javascript
// 🔬 COPY THIS - Sequential vs Parallel

function fetchUsers() {
  return new Promise((resolve) => {
    setTimeout(() => resolve(["Alice", "Bob", "Charlie"]), 2000);
  });
}

function fetchPosts() {
  return new Promise((resolve) => {
    setTimeout(() => resolve(["Post 1", "Post 2"]), 2000);
  });
}

// ========================================
// SEQUENTIAL (slow - 4 seconds total)
// ========================================
async function getDataSequential() {
  console.time("Sequential");
  const users = await fetchUsers(); // Wait 2 seconds
  const posts = await fetchPosts(); // Wait 2 seconds
  console.timeEnd("Sequential"); // 4 seconds!
  return { users, posts };
}

// ========================================
// PARALLEL (fast - 2 seconds total!)
// ========================================
async function getDataParallel() {
  console.time("Parallel");
  const [users, posts] = await Promise.all([
    fetchUsers(), // Start immediately
    fetchPosts(), // Start immediately
  ]);
  console.timeEnd("Parallel"); // 2 seconds!
  return { users, posts };
}

// Test them
getDataSequential(); // 4 seconds
getDataParallel(); // 2 seconds (twice as fast!)
```

**Use `Promise.all()` when operations don't depend on each other!** ⚡

---

## 🎯 Common Patterns

### Pattern 1: Loading States

```javascript
// 🔬 COPY THIS - Handling loading states
async function fetchData() {
  let loading = true;
  let data = null;
  let error = null;

  try {
    loading = true;
    console.log("⏳ Loading...");

    const response = await fetchUserData(1);
    data = response;

    console.log("✅ Success!");
  } catch (err) {
    error = err.message;
    console.error("❌ Error:", error);
  } finally {
    loading = false; // Runs no matter what!
    console.log("🏁 Finished");
  }

  return { loading, data, error };
}
```

---

### Pattern 2: Error Handling

```javascript
// 🔬 COPY THIS - Proper error handling
async function safeAPICall(userId) {
  try {
    // Validate input first
    if (!userId || userId <= 0) {
      throw new Error("Invalid user ID");
    }

    const user = await fetchUserData(userId);

    // Validate response
    if (!user || !user.id) {
      throw new Error("Invalid user data received");
    }

    return user;
  } catch (error) {
    console.error("API call failed:", error.message);
    // Could log to error tracking service here
    throw error; // Re-throw so caller knows it failed
  }
}
```

---

### Pattern 3: Timeout (Cancel Slow Requests)

```javascript
// 🔬 COPY THIS - Add timeout to async operations
function timeout(ms) {
  return new Promise((_, reject) => {
    setTimeout(() => reject(new Error("Timeout!")), ms);
  });
}

async function fetchWithTimeout(userId, timeoutMs = 3000) {
  try {
    // Race: whichever finishes first wins
    const user = await Promise.race([
      fetchUserData(userId),
      timeout(timeoutMs),
    ]);

    return user;
  } catch (error) {
    if (error.message === "Timeout!") {
      console.error("❌ Request took too long!");
    }
    throw error;
  }
}

// This will timeout if it takes more than 3 seconds
fetchWithTimeout(1, 3000);
```

---

## 🔑 Promise vs async/await Comparison

| Feature            | Promise (.then)      | async/await              |
| ------------------ | -------------------- | ------------------------ |
| **Syntax**         | `.then().catch()`    | `try/catch`              |
| **Readability**    | ❌ Harder (chaining) | ✅ Easier (looks sync)   |
| **Error handling** | `.catch()`           | `try/catch`              |
| **Debugging**      | ❌ Harder            | ✅ Easier                |
| **Use case**       | Simple one-off calls | Complex multi-step logic |
| **Multiple calls** | `Promise.all()`      | `await Promise.all()`    |

**Recommendation:** Use **async/await** for cleaner, more readable code! 🎉

---

## 🚫 Common Mistakes

### Mistake 1: Forgetting `await`

```javascript
// ❌ WRONG - Forgot await
async function getUser() {
  const user = fetchUserData(1); // Returns a Promise, not the data!
  console.log(user); // Promise { <pending> } 😱
}

// ✅ CORRECT - Use await
async function getUser() {
  const user = await fetchUserData(1);
  console.log(user); // { id: 1, name: 'Alice' } ✅
}
```

---

### Mistake 2: Not handling errors

```javascript
// ❌ WRONG - No error handling
async function getUser() {
  const user = await fetchUserData(1); // Could fail!
  return user;
}

// ✅ CORRECT - Always use try/catch
async function getUser() {
  try {
    const user = await fetchUserData(1);
    return user;
  } catch (error) {
    console.error("Error:", error);
    return null; // Graceful fallback
  }
}
```

---

### Mistake 3: Using `await` without `async`

```javascript
// ❌ WRONG - Can't use await in non-async function
function getUser() {
  const user = await fetchUserData(1); // ERROR!
  return user;
}

// ✅ CORRECT - Add async keyword
async function getUser() {
  const user = await fetchUserData(1);
  return user;
}
```

---

## 🧪 Practice Exercises

### Exercise 1: Create a Promise

Create a function that returns a Promise which resolves after a random delay (1-3 seconds).

```javascript
// Your code here
function randomDelay() {
  // Return a Promise that resolves after 1-3 seconds
}
```

<details>
<summary>Solution</summary>

```javascript
function randomDelay() {
  return new Promise((resolve) => {
    const delay = Math.random() * 2000 + 1000; // 1-3 seconds
    setTimeout(() => {
      resolve(`Waited ${delay.toFixed(0)}ms`);
    }, delay);
  });
}

randomDelay().then(console.log);
```

</details>

---

### Exercise 2: async/await Practice

Convert this Promise chain to async/await:

```javascript
// Convert this:
getUser(1)
  .then((user) => {
    console.log(user);
    return getUserPosts(user.id);
  })
  .then((posts) => {
    console.log(posts);
  })
  .catch((error) => {
    console.error(error);
  });
```

<details>
<summary>Solution</summary>

```javascript
async function getUserWithPosts() {
  try {
    const user = await getUser(1);
    console.log(user);

    const posts = await getUserPosts(user.id);
    console.log(posts);
  } catch (error) {
    console.error(error);
  }
}

getUserWithPosts();
```

</details>

---

### Exercise 3: Promise.all()

Fetch 3 users in parallel and log all their names:

```javascript
// Fetch users 1, 2, and 3 simultaneously
```

<details>
<summary>Solution</summary>

```javascript
async function getMultipleUsers() {
  try {
    const [user1, user2, user3] = await Promise.all([
      getUser(1),
      getUser(2),
      getUser(3),
    ]);

    console.log([user1.name, user2.name, user3.name]);
  } catch (error) {
    console.error(error);
  }
}

getMultipleUsers();
```

</details>

---

## 📚 Summary

| Concept            | Description                                         |
| ------------------ | --------------------------------------------------- |
| **Promise**        | Object representing eventual completion of async op |
| **Pending**        | Promise state: still waiting                        |
| **Fulfilled**      | Promise state: success                              |
| **Rejected**       | Promise state: error                                |
| **async**          | Keyword to declare async function                   |
| **await**          | Wait for Promise to resolve                         |
| **try/catch**      | Error handling for async/await                      |
| **Promise.all()**  | Run multiple Promises in parallel                   |
| **Promise.race()** | Use the fastest Promise (e.g., timeout)             |

---

## ✅ Checklist

Before moving to Lesson 3.3, make sure you can:

- [ ] Explain the difference between sync and async code
- [ ] Describe the three states of a Promise
- [ ] Create a Promise with `new Promise()`
- [ ] Use `.then()` and `.catch()` with Promises
- [ ] Write async functions with `async` keyword
- [ ] Use `await` to wait for Promises
- [ ] Handle errors with `try/catch`
- [ ] Use `Promise.all()` for parallel operations
- [ ] Understand when to use sequential vs parallel
- [ ] Avoid common async/await mistakes

---

## 🎯 What's Next?

In **Lesson 3.3**, you'll learn about REST APIs and build your first Express.js server. Now that you understand Promises and async/await, you'll know exactly what's happening when you make API calls!

---

**You've mastered asynchronous JavaScript!** 🎉 Continue to [Lesson 3.3](lesson-3.3-rest-apis.md)!
