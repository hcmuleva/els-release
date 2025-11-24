# 📘 Lesson 3.6 - Strapi CMS Setup & Collections

**Duration:** 60 minutes  
**Difficulty:** Intermediate

---

## 🎁 Alternative: Express REST API

**Not ready for Strapi's complexity?** Use our Express API instead!

```bash
cd college-app-server/express-api
npm install
cp .env.example .env
npm run dev
```

✅ Simpler setup (no database, no admin panel)  
✅ Perfect for learning the fundamentals  
✅ Same endpoints as Strapi - easy to switch later

**This lesson covers Strapi** - a production-ready CMS with database and admin UI.

---

## 🎯 Learning Objectives

By the end of this lesson, you will:

- ✅ Understand what a CMS (Content Management System) is
- ✅ Learn what makes Strapi a "Headless CMS"
- ✅ Install and set up Strapi v4
- ✅ Create content types (collections)
- ✅ Add custom fields to collections
- ✅ Use Strapi Admin Panel
- ✅ Test Strapi APIs with Postman
- ✅ Understand Strapi's built-in CRUD endpoints

---

## 🤔 What is a CMS?

**CMS** = Content Management System

A platform to **manage content** (data) without writing code.

### Examples:

- **WordPress** - For blogs and websites
- **Shopify** - For e-commerce
- **Strapi** - For any type of content (headless)

---

## 💡 What is a "Headless" CMS?

### Traditional CMS (WordPress):

```
Frontend + Backend + Database = ONE system
```

You're locked into their design.

### Headless CMS (Strapi):

```
Backend + Database ←→ API ←→ Any Frontend (React, Vue, Mobile, etc.)
```

**Benefits:**

- ✅ Use any frontend framework
- ✅ One backend for web + mobile + desktop
- ✅ Modern API-first approach
- ✅ More flexible and powerful

---

## 🚀 Installing Strapi v4

### Step 1: Create Strapi Project

```bash
# Navigate to server folder
cd level-3/college-app-server

# Create Strapi project (SQLite database)
npx create-strapi-app@latest strapi-cms --quickstart
```

**Options:**

- Choose **Quickstart** (SQLite database - easy for learning)
- Wait for installation (takes 2-3 minutes)
- Browser will auto-open to admin panel

---

### Step 2: Create Admin Account

When browser opens at `http://localhost:1337/admin`:

1. **First name:** Your name
2. **Last name:** Your last name
3. **Email:** admin@college.edu
4. **Password:** Admin123! (or your choice)
5. Click **Let's start**

**✅ You're now in the Strapi Admin Panel!**

---

## 📦 Creating a Collection (Content Type)

Collections are like database tables.

### Step 1: Create "User" Collection

1. Click **Content-Type Builder** (left sidebar)
2. Click **Create new collection type**
3. **Display name:** User
4. Click **Continue**

---

### Step 2: Add Fields

Add these fields one by one:

#### Field 1: first_name

- **Type:** Text (Short text)
- **Name:** first_name
- Click **Add another field**

#### Field 2: last_name

- **Type:** Text (Short text)
- **Name:** last_name
- Click **Add another field**

#### Field 3: email

- **Type:** Email
- **Name:** email
- **Advanced Settings:**
  - ✅ Required field
  - ✅ Unique field
- Click **Add another field**

#### Field 4: mobile_number

- **Type:** Text (Short text)
- **Name:** mobile_number
- Click **Add another field**

#### Field 5: gender

- **Type:** Enumeration
- **Name:** gender
- **Values:** Male, Female, Other
- Click **Add another field**

#### Field 6: age

- **Type:** Number (integer)
- **Name:** age
- Click **Add another field**

#### Field 7: role

- **Type:** Enumeration
- **Name:** role
- **Values:** Student, Faculty, Alumni, Admin
- **Default value:** Student
- Click **Add another field**

#### Field 8: program

- **Type:** Text (Short text)
- **Name:** program
- Click **Finish**

---

### Step 3: Save & Restart

1. Click **Save** (top right)
2. **Server will automatically restart** (wait 10-15 seconds)
3. Refresh browser

**✅ Your User collection is ready!**

---

## ➕ Adding Content

### Step 1: Add Entries

1. Click **Content Manager** (left sidebar)
2. Click **User** under Collection Types
3. Click **Create new entry** (top right)
4. Fill in data:

```
First Name: Alice
Last Name: Johnson
Email: alice@college.edu
Mobile Number: +1234567890
Gender: Female
Age: 20
Role: Student
Program: Computer Science
```

5. Click **Save**
6. Click **Publish** (top right)

**Repeat** to add more users (Bob, Carol, etc.)

---

## 🔓 Making API Public

By default, Strapi APIs are **protected**. Let's make them public for learning.

### Step 1: Set Permissions

1. Click **Settings** (left sidebar, bottom)
2. Click **Roles** under USERS & PERMISSIONS PLUGIN
3. Click **Public**
4. Expand **User**
5. Check these boxes:
   - ✅ find
   - ✅ findOne
   - ✅ create
   - ✅ update
   - ✅ delete
6. Click **Save** (top right)

**✅ Now anyone can access User API!**

---

## 🧪 Testing Strapi API with Postman

### Test 1: GET All Users

**Request:**

- Method: GET
- URL: `http://localhost:1337/api/users`

**Response:**

```json
{
  "data": [
    {
      "id": 1,
      "attributes": {
        "first_name": "Alice",
        "last_name": "Johnson",
        "email": "alice@college.edu",
        "mobile_number": "+1234567890",
        "gender": "Female",
        "age": 20,
        "role": "Student",
        "program": "Computer Science",
        "createdAt": "2024-01-01T00:00:00.000Z",
        "updatedAt": "2024-01-01T00:00:00.000Z"
      }
    }
  ],
  "meta": {
    "pagination": {
      "page": 1,
      "pageSize": 25,
      "pageCount": 1,
      "total": 1
    }
  }
}
```

---

### Test 2: GET User by ID

**Request:**

- Method: GET
- URL: `http://localhost:1337/api/users/1`

---

### Test 3: POST - Create User

**Request:**

- Method: POST
- URL: `http://localhost:1337/api/users`
- Headers: `Content-Type: application/json`
- Body:

```json
{
  "data": {
    "first_name": "John",
    "last_name": "Doe",
    "email": "john@college.edu",
    "mobile_number": "+1234567893",
    "gender": "Male",
    "age": 21,
    "role": "Student",
    "program": "Biology"
  }
}
```

**✅ Strapi wraps data in `data` object!**

---

### Test 4: PUT - Update User

**Request:**

- Method: PUT
- URL: `http://localhost:1337/api/users/1`
- Body:

```json
{
  "data": {
    "program": "Data Science"
  }
}
```

---

### Test 5: DELETE User

**Request:**

- Method: DELETE
- URL: `http://localhost:1337/api/users/3`

---

## 🔑 Strapi Response Format

**Important!** Strapi wraps everything in a specific format:

### Single Item:

```json
{
  "data": {
    "id": 1,
    "attributes": {
      "first_name": "Alice"
      // ... more fields
    }
  },
  "meta": {}
}
```

### Multiple Items:

```json
{
  "data": [
    {
      "id": 1,
      "attributes": {
        /* fields */
      }
    },
    {
      "id": 2,
      "attributes": {
        /* fields */
      }
    }
  ],
  "meta": {
    "pagination": {
      /* pagination info */
    }
  }
}
```

**Remember this format when connecting to React!**

---

## 🌐 Connecting React to Strapi

### Update API Service

```javascript
// 🔬 UPDATE THIS - src/services/api.js
const STRAPI_URL = "http://localhost:1337/api";

// Helper: Transform Strapi response to simple format
const transformStrapiUser = (strapiUser) => {
  return {
    id: strapiUser.id,
    ...strapiUser.attributes,
  };
};

export const getAllUsers = async () => {
  try {
    const response = await fetch(`${STRAPI_URL}/users`);
    const json = await response.json();

    // Transform Strapi format to simple array
    return json.data.map(transformStrapiUser);
  } catch (error) {
    console.error("Error fetching users:", error);
    throw error;
  }
};

export const createUser = async (userData) => {
  try {
    const response = await fetch(`${STRAPI_URL}/users`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ data: userData }), // Wrap in "data"
    });

    const json = await response.json();
    return transformStrapiUser(json.data);
  } catch (error) {
    console.error("Error creating user:", error);
    throw error;
  }
};

// Similar updates for updateUser, deleteUser...
```

---

## 📊 Strapi Admin Panel Features

### Content Manager

- Add/edit/delete entries
- Filter and search
- Bulk actions
- Draft/publish workflow

### Content-Type Builder

- Create collections
- Add/remove fields
- Modify existing types

### Media Library

- Upload images/files
- Organize in folders
- Use in content

### Settings

- Roles & permissions
- API tokens
- Plugins
- Webhooks

---

## 🎨 Practice Tasks

### Task 1: Add More Fields

Add these fields to User collection:

- `bio` (Rich text)
- `avatar` (Media - Single image)
- `graduation_year` (Number)

### Task 2: Create Course Collection

Create a new collection with:

- `title` (Text)
- `code` (Text, unique)
- `credits` (Number)
- `instructor` (Relation to User)

### Task 3: Test Relations

- Connect courses to users
- Fetch user with their courses

---

## 🔑 Key Concepts

| Concept          | Description                      |
| ---------------- | -------------------------------- |
| **CMS**          | Content Management System        |
| **Headless CMS** | Backend-only CMS with API        |
| **Collection**   | Like a database table            |
| **Content Type** | Structure/schema of a collection |
| **Field**        | Column in a collection           |
| **Entry**        | Row/record in a collection       |
| **Admin Panel**  | Web interface to manage content  |

---

## 📚 Environment Variables for Strapi

```bash
# 🔬 CREATE THIS - .env in React app
VITE_STRAPI_URL=http://localhost:1337/api
```

Then use in code:

```javascript
const STRAPI_URL = import.meta.env.VITE_STRAPI_URL;
```

---

## ✅ Checklist

Before moving to Lesson 3.5, make sure you can:

- [ ] Explain what a headless CMS is
- [ ] Install Strapi with quickstart
- [ ] Create a collection with fields
- [ ] Add content through admin panel
- [ ] Set API permissions
- [ ] Test Strapi APIs with Postman
- [ ] Understand Strapi's response format
- [ ] Connect React app to Strapi

---

## 🎯 What's Next?

In **Lesson 3.5**, we'll add **authentication** - register and login with JWT tokens!

---

**You've mastered Strapi!** 🎉 Continue to [Lesson 3.5](lesson-3.5-authentication.md)!
