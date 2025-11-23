# 📘 Lesson 2.5 - Building Forms with Hooks & Routing

## 🎯 Learning Objectives

By the end of this lesson, you will understand:

- Controlled vs uncontrolled components
- Building multi-field forms with useState
- Form validation
- Handling form submission
- **Navigating after form submission** (NEW!)
- Radio buttons, checkboxes, and select dropdowns
- Form best practices

**Prerequisites:** Complete Lesson 2.4 (React Router) first!

---

## 🎨 Controlled vs Uncontrolled Components

### Uncontrolled Component (❌ Old Way)

The DOM controls the input value:

```jsx
function UncontrolledForm() {
  const handleSubmit = (e) => {
    e.preventDefault();
    const name = e.target.elements.username.value; // Get value from DOM
    console.log(name);
  };

  return (
    <form onSubmit={handleSubmit}>
      <input name="username" />
      <button>Submit</button>
    </form>
  );
}
```

### Controlled Component (✅ React Way)

React controls the input value with state:

```jsx
import { useState } from "react";

function ControlledForm() {
  const [username, setUsername] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(username); // Value from state
  };

  return (
    <form onSubmit={handleSubmit}>
      <input value={username} onChange={(e) => setUsername(e.target.value)} />
      <button>Submit</button>
    </form>
  );
}
```

**Why controlled?** React state is the single source of truth!

---

## 📝 Simple Form Examples

### Example 1: Basic Name Form

```jsx
import { useState } from "react";

function NameForm() {
  const [name, setName] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    alert(`Welcome, ${name}!`);
    setName(""); // Clear form
  };

  return (
    <div className="container">
      <h2>Name Form</h2>
      <form onSubmit={handleSubmit}>
        <label>Name:</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Enter your name"
          required
        />
        <button type="submit">Submit</button>
      </form>
      <p>Current input: {name}</p>
    </div>
  );
}

export default NameForm;
```

**🔬 Try in Practice Lab** ⬆️

---

### Example 2: Login Form

```jsx
import { useState } from "react";

function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Login:", { email, password });
    alert("Logged in!");
  };

  return (
    <div className="container">
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <label>Email:</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@example.com"
          required
        />

        <label>Password:</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="********"
          required
        />

        <button type="submit">Login</button>
      </form>
    </div>
  );
}

export default LoginForm;
```

**🔬 Try in Practice Lab** ⬆️

---

## 🚀 Forms with Routing (Navigate After Submit)

Now that you know routing from Lesson 2.4, let's navigate after form submission!

### Example: Login with Navigation

```jsx
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

function Login() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");

    // Simple validation
    if (!formData.email.includes("@")) {
      setError("Please enter a valid email");
      return;
    }

    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    // Simulate login success
    console.log("Login successful!", formData);
    alert("Login successful!");

    // Navigate to home page after successful login
    navigate("/");
  };

  return (
    <div className="container">
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        {error && <p className="error">{error}</p>}

        <label>Email:</label>
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="you@example.com"
          required
        />

        <label>Password:</label>
        <input
          type="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          placeholder="********"
          required
        />

        <button type="submit">Login</button>
      </form>

      <p>
        Don't have an account? <Link to="/register">Register here</Link>
      </p>
    </div>
  );
}

export default Login;
```

**🔬 Try in Practice Lab** ⬆️

**Key Changes:**

- Import `useNavigate` and `Link`
- Call `navigate("/")` after successful login
- Add link to Register page

---

### Example: Register with Navigation

```jsx
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

function Register() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    // Clear error when user types
    if (errors[name]) {
      setErrors({ ...errors, [name]: "" });
    }
  };

  const validate = () => {
    const newErrors = {};

    if (formData.firstName.length < 2) {
      newErrors.firstName = "First name must be at least 2 characters";
    }

    if (formData.lastName.length < 2) {
      newErrors.lastName = "Last name must be at least 2 characters";
    }

    if (!formData.email.includes("@")) {
      newErrors.email = "Invalid email address";
    }

    if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    return newErrors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const validationErrors = validate();

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    // Simulate registration success
    console.log("Registration successful!", formData);
    alert(`Welcome, ${formData.firstName}!`);

    // Navigate to login page after successful registration
    navigate("/login");
  };

  return (
    <div className="container">
      <h2>Create Account</h2>
      <form onSubmit={handleSubmit}>
        <label>First Name:</label>
        <input
          type="text"
          name="firstName"
          value={formData.firstName}
          onChange={handleChange}
        />
        {errors.firstName && <p className="error">{errors.firstName}</p>}

        <label>Last Name:</label>
        <input
          type="text"
          name="lastName"
          value={formData.lastName}
          onChange={handleChange}
        />
        {errors.lastName && <p className="error">{errors.lastName}</p>}

        <label>Email:</label>
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
        />
        {errors.email && <p className="error">{errors.email}</p>}

        <label>Password:</label>
        <input
          type="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
        />
        {errors.password && <p className="error">{errors.password}</p>}

        <label>Confirm Password:</label>
        <input
          type="password"
          name="confirmPassword"
          value={formData.confirmPassword}
          onChange={handleChange}
        />
        {errors.confirmPassword && (
          <p className="error">{errors.confirmPassword}</p>
        )}

        <button type="submit">Create Account</button>
      </form>

      <p>
        Already have an account? <Link to="/login">Login here</Link>
      </p>
    </div>
  );
}

export default Register;
```

**🔬 Try in Practice Lab** ⬆️

**Flow:**

1. User fills registration form
2. Validation checks all fields
3. If valid → Navigate to `/login`
4. User can then login with new credentials

---

## � Multi-Field Form with Object State

### Example 3: User Registration Form

```jsx
import { useState } from "react";

function RegistrationForm() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    age: "",
    password: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form submitted:", formData);
    alert(`Welcome, ${formData.firstName} ${formData.lastName}!`);
  };

  return (
    <div className="container">
      <h2>User Registration</h2>
      <form onSubmit={handleSubmit}>
        <label>First Name:</label>
        <input
          type="text"
          name="firstName"
          value={formData.firstName}
          onChange={handleChange}
          required
        />

        <label>Last Name:</label>
        <input
          type="text"
          name="lastName"
          value={formData.lastName}
          onChange={handleChange}
          required
        />

        <label>Email:</label>
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          required
        />

        <label>Age:</label>
        <input
          type="number"
          name="age"
          value={formData.age}
          onChange={handleChange}
          min="1"
          max="120"
        />

        <label>Password:</label>
        <input
          type="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          minLength="6"
          required
        />

        <button type="submit">Register</button>
      </form>

      <h3>Current Form Data:</h3>
      <pre>{JSON.stringify(formData, null, 2)}</pre>
    </div>
  );
}

export default RegistrationForm;
```

**🔬 Try in Practice Lab** ⬆️

**Key Pattern:** One `handleChange` function for all inputs using `name` attribute!

---

## 📻 Radio Buttons

### Example 4: Role Selection

```jsx
import { useState } from "react";

function RoleSelector() {
  const [role, setRole] = useState("student");

  const handleSubmit = (e) => {
    e.preventDefault();
    alert(`You selected: ${role}`);
  };

  return (
    <div className="container">
      <h2>Select Your Role</h2>
      <form onSubmit={handleSubmit}>
        <label>
          <input
            type="radio"
            name="role"
            value="student"
            checked={role === "student"}
            onChange={(e) => setRole(e.target.value)}
          />
          Student
        </label>

        <label>
          <input
            type="radio"
            name="role"
            value="alumni"
            checked={role === "alumni"}
            onChange={(e) => setRole(e.target.value)}
          />
          Alumni
        </label>

        <label>
          <input
            type="radio"
            name="role"
            value="admin"
            checked={role === "admin"}
            onChange={(e) => setRole(e.target.value)}
          />
          Admin
        </label>

        <button type="submit">Submit</button>
      </form>

      <p>
        Selected role: <strong>{role}</strong>
      </p>
    </div>
  );
}

export default RoleSelector;
```

**🔬 Try in Practice Lab** ⬆️

---

## ☑️ Checkboxes

### Example 5: Multiple Skills Selection

```jsx
import { useState } from "react";

function SkillsForm() {
  const [skills, setSkills] = useState({
    javascript: false,
    react: false,
    css: false,
    nodejs: false,
  });

  const handleChange = (e) => {
    const { name, checked } = e.target;
    setSkills({ ...skills, [name]: checked });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const selectedSkills = Object.keys(skills).filter((key) => skills[key]);
    alert(`Selected skills: ${selectedSkills.join(", ")}`);
  };

  return (
    <div className="container">
      <h2>Select Your Skills</h2>
      <form onSubmit={handleSubmit}>
        <label>
          <input
            type="checkbox"
            name="javascript"
            checked={skills.javascript}
            onChange={handleChange}
          />
          JavaScript
        </label>

        <label>
          <input
            type="checkbox"
            name="react"
            checked={skills.react}
            onChange={handleChange}
          />
          React
        </label>

        <label>
          <input
            type="checkbox"
            name="css"
            checked={skills.css}
            onChange={handleChange}
          />
          CSS
        </label>

        <label>
          <input
            type="checkbox"
            name="nodejs"
            checked={skills.nodejs}
            onChange={handleChange}
          />
          Node.js
        </label>

        <button type="submit">Submit</button>
      </form>

      <h3>Selected Skills:</h3>
      <ul>
        {Object.keys(skills).map((skill) =>
          skills[skill] ? <li key={skill}>{skill}</li> : null
        )}
      </ul>
    </div>
  );
}

export default SkillsForm;
```

**🔬 Try in Practice Lab** ⬆️

---

## 📋 Select Dropdown

### Example 6: Country Selector

```jsx
import { useState } from "react";

function CountryForm() {
  const [country, setCountry] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    alert(`You selected: ${country}`);
  };

  return (
    <div className="container">
      <h2>Select Country</h2>
      <form onSubmit={handleSubmit}>
        <label>Country:</label>
        <select
          value={country}
          onChange={(e) => setCountry(e.target.value)}
          required
        >
          <option value="">-- Select Country --</option>
          <option value="usa">United States</option>
          <option value="uk">United Kingdom</option>
          <option value="canada">Canada</option>
          <option value="india">India</option>
          <option value="australia">Australia</option>
        </select>

        <button type="submit">Submit</button>
      </form>

      {country && (
        <p>
          Selected: <strong>{country}</strong>
        </p>
      )}
    </div>
  );
}

export default CountryForm;
```

**🔬 Try in Practice Lab** ⬆️

---

## ✅ Form Validation

### Example 7: Validated Registration Form

```jsx
import { useState } from "react";

function ValidatedForm() {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    // Clear error when user types
    if (errors[name]) {
      setErrors({ ...errors, [name]: "" });
    }
  };

  const validate = () => {
    const newErrors = {};

    if (formData.username.length < 3) {
      newErrors.username = "Username must be at least 3 characters";
    }

    if (!formData.email.includes("@")) {
      newErrors.email = "Invalid email address";
    }

    if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    return newErrors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const validationErrors = validate();

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    alert("Form submitted successfully!");
    console.log(formData);
  };

  return (
    <div className="container">
      <h2>Validated Registration</h2>
      <form onSubmit={handleSubmit}>
        <label>Username:</label>
        <input
          type="text"
          name="username"
          value={formData.username}
          onChange={handleChange}
        />
        {errors.username && <p className="error">{errors.username}</p>}

        <label>Email:</label>
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
        />
        {errors.email && <p className="error">{errors.email}</p>}

        <label>Password:</label>
        <input
          type="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
        />
        {errors.password && <p className="error">{errors.password}</p>}

        <label>Confirm Password:</label>
        <input
          type="password"
          name="confirmPassword"
          value={formData.confirmPassword}
          onChange={handleChange}
        />
        {errors.confirmPassword && (
          <p className="error">{errors.confirmPassword}</p>
        )}

        <button type="submit">Register</button>
      </form>
    </div>
  );
}

export default ValidatedForm;
```

**🔬 Try in Practice Lab** ⬆️

**Add this CSS for error messages:**

```css
.error {
  color: red;
  font-size: 0.875rem;
  margin-top: -0.5rem;
  margin-bottom: 0.5rem;
}
```

---

## 🎨 Complete Student Registration Form

```jsx
import { useState } from "react";

function StudentRegistration() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    mobile: "",
    dob: "",
    gender: "",
    program: "",
    year: "",
    skills: {
      coding: false,
      design: false,
      writing: false,
    },
    agreeTerms: false,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (type === "checkbox" && name in formData.skills) {
      setFormData({
        ...formData,
        skills: { ...formData.skills, [name]: checked },
      });
    } else if (type === "checkbox") {
      setFormData({ ...formData, [name]: checked });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.agreeTerms) {
      alert("Please agree to terms and conditions");
      return;
    }

    console.log("Student Registration:", formData);
    alert("Registration successful!");
  };

  return (
    <div className="container">
      <h1>Student Registration Form</h1>

      <form onSubmit={handleSubmit}>
        {/* Personal Info */}
        <h3>Personal Information</h3>

        <label>First Name:</label>
        <input
          type="text"
          name="firstName"
          value={formData.firstName}
          onChange={handleChange}
          required
        />

        <label>Last Name:</label>
        <input
          type="text"
          name="lastName"
          value={formData.lastName}
          onChange={handleChange}
          required
        />

        <label>Email:</label>
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          required
        />

        <label>Mobile:</label>
        <input
          type="tel"
          name="mobile"
          value={formData.mobile}
          onChange={handleChange}
          placeholder="1234567890"
          required
        />

        <label>Date of Birth:</label>
        <input
          type="date"
          name="dob"
          value={formData.dob}
          onChange={handleChange}
          required
        />

        {/* Gender */}
        <h3>Gender</h3>
        <label>
          <input
            type="radio"
            name="gender"
            value="male"
            checked={formData.gender === "male"}
            onChange={handleChange}
          />
          Male
        </label>
        <label>
          <input
            type="radio"
            name="gender"
            value="female"
            checked={formData.gender === "female"}
            onChange={handleChange}
          />
          Female
        </label>
        <label>
          <input
            type="radio"
            name="gender"
            value="other"
            checked={formData.gender === "other"}
            onChange={handleChange}
          />
          Other
        </label>

        {/* Academic Info */}
        <h3>Academic Information</h3>

        <label>Program:</label>
        <select
          name="program"
          value={formData.program}
          onChange={handleChange}
          required
        >
          <option value="">-- Select Program --</option>
          <option value="cs">Computer Science</option>
          <option value="it">Information Technology</option>
          <option value="engineering">Engineering</option>
          <option value="business">Business</option>
        </select>

        <label>Year:</label>
        <select
          name="year"
          value={formData.year}
          onChange={handleChange}
          required
        >
          <option value="">-- Select Year --</option>
          <option value="1">1st Year</option>
          <option value="2">2nd Year</option>
          <option value="3">3rd Year</option>
          <option value="4">4th Year</option>
        </select>

        {/* Skills */}
        <h3>Skills</h3>
        <label>
          <input
            type="checkbox"
            name="coding"
            checked={formData.skills.coding}
            onChange={handleChange}
          />
          Coding
        </label>
        <label>
          <input
            type="checkbox"
            name="design"
            checked={formData.skills.design}
            onChange={handleChange}
          />
          Design
        </label>
        <label>
          <input
            type="checkbox"
            name="writing"
            checked={formData.skills.writing}
            onChange={handleChange}
          />
          Writing
        </label>

        {/* Terms */}
        <label>
          <input
            type="checkbox"
            name="agreeTerms"
            checked={formData.agreeTerms}
            onChange={handleChange}
            required
          />
          I agree to terms and conditions
        </label>

        <button type="submit">Register</button>
      </form>
    </div>
  );
}

export default StudentRegistration;
```

**🔬 Try in Practice Lab** ⬆️

---

## ⚡ Form Best Practices

### 1. Use `e.preventDefault()`

Always prevent default form submission:

```jsx
const handleSubmit = (e) => {
  e.preventDefault(); // Prevents page reload
  // Process form
};
```

### 2. One Handler for Multiple Inputs

Use `name` attribute to identify fields:

```jsx
const handleChange = (e) => {
  const { name, value } = e.target;
  setFormData({ ...formData, [name]: value });
};
```

### 3. Validate Before Submission

Check data before sending:

```jsx
const handleSubmit = (e) => {
  e.preventDefault();

  if (!formData.email.includes("@")) {
    alert("Invalid email!");
    return;
  }

  // Submit form
};
```

### 4. Clear Form After Submission

Reset state to initial values:

```jsx
const handleSubmit = (e) => {
  e.preventDefault();
  // Process form
  setFormData({ name: "", email: "" }); // Reset
};
```

---

## ✅ Practice Exercise

Build a **Job Application Form** with:

1. Personal details (name, email, phone)
2. Position applying for (dropdown)
3. Experience level (radio: Junior/Mid/Senior)
4. Skills (checkboxes: JavaScript, React, Node.js, SQL)
5. Cover letter (textarea)
6. Resume upload (file input)
7. Validation for all required fields
8. Display submitted data after submission

---

## 🎯 Key Takeaways

✅ **Always use controlled components with React**  
✅ **Use object state for multi-field forms**  
✅ **One `handleChange` for all text inputs**  
✅ **Use `e.preventDefault()` in submit handlers**  
✅ **Validate data before submission**  
✅ **Clear form after successful submission**  
✅ **Use `name` attribute to identify inputs**

---

## 🎓 Level 2 Complete!

Congratulations! You've learned:

- ✅ React Hooks (useState, useEffect)
- ✅ State management
- ✅ Side effects and lifecycle
- ✅ Building interactive forms
- ✅ Form validation

**Next:** [Level 3 - Routing & API Integration](../../level-3/README.md)

In Level 3, you'll learn:

- React Router for multi-page apps
- Fetching real data from APIs
- URL parameters and navigation
- Building a complete multi-page directory

---

**Need Help?** Copy any code snippet above into your **Practice Lab** and experiment! 🧪
