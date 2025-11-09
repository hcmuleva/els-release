# Strapi Admin Setup Guide

## Current Issue
The seed script needs admin credentials to update custom user fields (firstName, lastName, userRole).

## Solution: Update Admin Credentials

### Option 1: Find Your Admin Credentials
Check what email you used when you first created the Strapi admin account at `http://localhost:1337/admin`

### Option 2: Update the Seed Script

Edit the file: `/lmsserver/scripts/seed-users.js`

Update lines 11-12 with your actual admin credentials:

```javascript
const ADMIN_EMAIL = 'your-actual-admin@email.com';  // Change this
const ADMIN_PASSWORD = 'YourActualPassword';         // Change this
```

For example, if your admin email is `harish@emeelan.com` and password is `MyPass123`:

```javascript
const ADMIN_EMAIL = 'harish@emeelan.com';
const ADMIN_PASSWORD = 'MyPass123';
```

### Option 3: Create New Admin with Expected Credentials

If you want to use the default credentials in the script:

1. Go to Strapi Admin: `http://localhost:1337/admin`
2. Login with your current admin account
3. Go to **Settings** → **Administration Panel** → **Users**
4. Click **Create new user**
5. Fill in:
   - First name: Admin
   - Last name: User
   - Email: `admin@strapi.io`
   - Password: `Admin123!`
   - Roles: Check **Super Admin**
6. Click **Save**

Now you can run the seed script:

```bash
cd lmsserver
npm run seed
```

## After Running Seed Script

Once successful, you'll have 25 users with proper Indian names and custom fields set:
- 2 Superadmins
- 3 Admins  
- 5 Teachers
- 10 Students
- 5 Parents

All with password: `welcome123`

## Test in React App

After seeding, test login in your React app at `http://localhost:3030`:
- Username: `student1` / Password: `welcome123`
- Should show: "Good Morning, Arjun!" with proper name display
