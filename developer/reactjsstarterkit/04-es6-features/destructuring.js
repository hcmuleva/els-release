// 🎁 Destructuring in ES6

console.log("=== Destructuring ===\n");

// ==================
// ARRAY DESTRUCTURING
// ==================

console.log("--- Array Destructuring ---\n");

// 1. Basic array destructuring
const colors = ["red", "green", "blue"];
const [first, second, third] = colors;

console.log("First color:", first);
console.log("Second color:", second);
console.log("Third color:", third);

// 2. Skip elements
const numbers = [1, 2, 3, 4, 5];
const [a, , c, , e] = numbers;  // Skip 2nd and 4th
console.log("\na:", a, "c:", c, "e:", e);

// 3. Rest operator in destructuring
const [head, ...tail] = numbers;
console.log("\nHead:", head);
console.log("Tail:", tail);

// 4. Default values
const [x = 0, y = 0, z = 0] = [10, 20];
console.log("\nx:", x, "y:", y, "z:", z);  // z uses default

// 5. Swapping variables
let var1 = "A";
let var2 = "B";
console.log("\nBefore swap:", var1, var2);
[var1, var2] = [var2, var1];
console.log("After swap:", var1, var2);

// ==================
// OBJECT DESTRUCTURING
// ==================

console.log("\n--- Object Destructuring ---\n");

// 1. Basic object destructuring
const person = {
    name: "John Doe",
    age: 30,
    city: "New York",
    country: "USA"
};

const { name, age, city } = person;
console.log(`${name}, ${age}, from ${city}`);

// 2. Rename variables
const { name: fullName, age: years } = person;
console.log(`\nRenamed: ${fullName} is ${years} years old`);

// 3. Default values
const { name: n, email = "not@provided.com" } = person;
console.log(`Email: ${email}`);  // Uses default

// 4. Nested destructuring
const user = {
    id: 1,
    username: "alice",
    profile: {
        firstName: "Alice",
        lastName: "Smith",
        address: {
            street: "123 Main St",
            city: "Boston"
        }
    }
};

const {
    profile: {
        firstName,
        lastName,
        address: { city: userCity }
    }
} = user;

console.log(`\n${firstName} ${lastName} lives in ${userCity}`);

// 5. Function parameters destructuring
function displayUser({ name, age, city = "Unknown" }) {
    console.log(`${name}, ${age}, from ${city}`);
}

console.log("\nFunction parameter destructuring:");
displayUser({ name: "Bob", age: 25 });
displayUser({ name: "Charlie", age: 35, city: "LA" });

// 6. Array of objects destructuring
const users = [
    { id: 1, name: "Alice", score: 95 },
    { id: 2, name: "Bob", score: 87 },
    { id: 3, name: "Charlie", score: 92 }
];

console.log("\nExtracting from array of objects:");
users.forEach(({ name, score }) => {
    console.log(`${name}: ${score}`);
});

// 7. Mixed destructuring
const data = {
    title: "ES6 Features",
    tags: ["JavaScript", "ES6", "Modern"],
    stats: {
        views: 1000,
        likes: 150
    }
};

const {
    title,
    tags: [tag1, tag2],
    stats: { views, likes }
} = data;

console.log(`\n${title}`);
console.log(`First tag: ${tag1}, Second tag: ${tag2}`);
console.log(`Views: ${views}, Likes: ${likes}`);

// 🎯 PRACTICAL EXAMPLES

console.log("\n=== PRACTICAL EXAMPLES ===\n");

// Example 1: Return multiple values from function
function getCoordinates() {
    return { x: 10, y: 20, z: 30 };
}

const { x: coordX, y: coordY, z: coordZ } = getCoordinates();
console.log(`Coordinates: x=${coordX}, y=${coordY}, z=${coordZ}`);

// Example 2: Extract from API response (simulated)
const apiResponse = {
    status: "success",
    data: {
        user: {
            id: 123,
            name: "John",
            email: "john@example.com"
        },
        token: "abc123xyz"
    }
};

const {
    status,
    data: {
        user: { name: userName, email: userEmail },
        token
    }
} = apiResponse;

console.log(`\nAPI Response: ${status}`);
console.log(`User: ${userName} (${userEmail})`);
console.log(`Token: ${token}`);

// Example 3: Configuration object with defaults
function createServer({
    port = 3000,
    host = "localhost",
    ssl = false
} = {}) {
    console.log(`\nServer running on ${host}:${port} (SSL: ${ssl})`);
}

createServer({ port: 8080, ssl: true });
createServer({ host: "0.0.0.0" });
createServer();  // All defaults

// 🏆 ADVANCED CHALLENGES

console.log("\n=== CHALLENGES ===\n");

// Challenge 1: Deep clone with destructuring
const original = { a: 1, b: { c: 2, d: 3 } };
const clone = { ...original, b: { ...original.b } };
clone.b.c = 999;
console.log("Original:", original);
console.log("Clone:", clone);

// Challenge 2: Merge objects
const defaults = { theme: "light", language: "en", fontSize: 14 };
const userSettings = { language: "es", fontSize: 16 };
const finalSettings = { ...defaults, ...userSettings };
console.log("\nMerged settings:", finalSettings);

// Challenge 3: Extract and transform
const products = [
    { id: 1, name: "Laptop", price: 999 },
    { id: 2, name: "Mouse", price: 29 },
    { id: 3, name: "Keyboard", price: 79 }
];

const productNames = products.map(({ name, price }) => 
    `${name} ($${price})`
);
console.log("\nProduct list:", productNames);
