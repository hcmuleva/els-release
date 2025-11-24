# Quick Start Guide - Alumni College App

## 🚀 Getting Started in 5 Minutes

### Step 1: Verify Installation

Your project is already set up with all dependencies installed!

### Step 2: Check Environment

Verify your `.env` file exists with:

```
VITE_API_URL=https://emeelen.com/alumniserver/api
```

### Step 3: Start Development Server

```bash
npm run dev
```

### Step 4: Open Browser

Navigate to: `http://localhost:5173`

You should see the **Login Page** with a beautiful purple gradient background!

## 🎯 Test the Application

### 1. Register a New User

- Click "Register here" on login page
- Fill in the form:
  - First Name: John
  - Last Name: Doe
  - Username: johndoe
  - Email: john@example.com
  - Mobile: 1234567890
  - Password: password123
  - Confirm Password: password123
- Click "Create Account"

### 2. Login

- Username: johndoe (or john@example.com)
- Password: password123
- Click "Sign In"

### 3. Explore the Dashboard

After login, you'll be redirected to `/home` showing:

- Total users count
- Students count
- Alumni count
- Admins count

### 4. Browse Users

- Click "Users" in the navigation
- Search for users by name
- Filter by role or status
- Click any user card to view their full profile

### 5. View Your Profile

- Click "Profile" in the navigation
- Click "Edit Profile" button
- Update your information
- Click "Save Changes"

## 📁 Key Files to Know

### Configuration

- `.env` - API endpoint configuration
- `service/api.js` - Axios setup with interceptors

### Authentication

- `src/context/AuthContext.jsx` - Auth state management
- `src/pages/Login.jsx` - Login page
- `src/pages/Register.jsx` - Registration page

### Main Pages

- `src/pages/Home.jsx` - Dashboard
- `src/pages/Users.jsx` - Users list
- `src/pages/Profile.jsx` - User profile editor

### Services

- `service/auth/authService.js` - Login/Register/Logout
- `service/user/userService.js` - User CRUD operations

## 🎨 Features to Try

### Search & Filter

1. Go to Users page
2. Type a name in search box (real-time search!)
3. Select a role filter (Student/Alumni/Admin)
4. Select a status filter
5. Click "Clear Filters" to reset

### Profile Editing

1. Go to Profile page
2. Click "Edit Profile"
3. Change your name or mobile number
4. Click "Save Changes"
5. See success message

### Navigation

- Use the top navbar to switch between:
  - 🏠 Home (Dashboard)
  - 👥 Users (Browse users)
  - 👤 Profile (Your profile)
- Click "Logout" to sign out

## 🔧 Troubleshooting

### Issue: Can't login

- **Solution**: Make sure your Strapi backend is running and accessible
- Check `.env` has correct API URL

### Issue: No users showing

- **Solution**: Backend may not have any users yet
- Register a new user first

### Issue: API errors

- **Solution**: Open browser console (F12) to see detailed error messages
- Check network tab for API responses

## 📱 Responsive Testing

Test on different screen sizes:

1. Desktop (1920x1080) - Full layout
2. Tablet (768x1024) - Adapted layout
3. Mobile (375x667) - Mobile-optimized

## 🎓 Code Structure

```
Main App (App.jsx)
  └── AuthProvider (manages auth state)
      └── AppRoutes (routing)
          ├── Public Routes
          │   ├── Login
          │   └── Register
          └── Protected Routes (wrapped in Layout)
              ├── Home
              ├── Users
              ├── UserDetail
              └── Profile
```

## ✅ Success Checklist

- [ ] Development server running
- [ ] Login page loads with purple theme
- [ ] Can register new user
- [ ] Can login successfully
- [ ] Dashboard shows statistics
- [ ] Users page loads with grid
- [ ] Can search and filter users
- [ ] Can view user details
- [ ] Can edit profile
- [ ] Navigation works smoothly
- [ ] Logout works correctly

## 🎯 Next Steps

1. **Customize**: Change colors in `src/index.css`
2. **Add Features**: Extend with more functionality
3. **Deploy**: Build with `npm run build`
4. **Showcase**: Add to your portfolio!

## 📞 Support

If you encounter issues:

1. Check browser console for errors
2. Verify backend is running
3. Check network requests in DevTools
4. Review the README.md for detailed documentation

---

**Happy Coding! 🚀**

Your professional alumni management app is ready to impress!
