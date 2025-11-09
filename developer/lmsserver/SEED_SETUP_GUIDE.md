# Seed Script Setup Guide - Strapi v5

## The Problem
The seed script needs to:
1. Create new users (works with public registration)
2. Update custom fields (firstName, lastName, userRole) on users - **REQUIRES SPECIAL PERMISSIONS**

## The Solution

### Option 1: Configure User Permissions (RECOMMENDED)

This allows authenticated users to update user data:

1. **Start Strapi** (if not running):
   ```bash
   cd lmsserver
   npm run develop
   ```

2. **Login to Admin Panel**: 
   - Go to `http://localhost:1337/admin`
   - Login with your admin credentials

3. **Configure Permissions**:
   - Go to **Settings** → **Users & Permissions Plugin** → **Roles**
   - Click on **Authenticated** role
   - Scroll to **Users-Permissions** section
   - Under **User**, check these permissions:
     - ✅ `find`
     - ✅ `findOne`
     - ✅ `update` ← **CRITICAL for seed script**
     - ✅ `me`
   - Click **Save**

4. **Create a Super User** for seeding:
   - This user will run the seed script
   - Can be done via Strapi Admin or manually

5. **Update seed-users.js credentials**:
   ```javascript
   const ADMIN_EMAIL = 'harish@emeelan.com';  // Your user
   const ADMIN_PASSWORD = 'Welcome@123';       // Your password
   ```

6. **Run the seed script**:
   ```bash
   npm run seed
   ```

### Option 2: Use API Token (More Secure)

Instead of using user JWT, use an API token:

1. **Create API Token in Strapi**:
   - Go to **Settings** → **API Tokens**
   - Click **Create new API Token**
   - Name: `Seed Script Token`
   - Token type: **Full access** or **Custom**
   - If Custom, enable:
     - User: `find`, `findOne`, `update`
   - Click **Save** and copy the token

2. **Update seed-users.js** to use the API token:
   ```javascript
   const API_TOKEN = 'your-api-token-here';
   
   // In headers:
   headers: {
     Authorization: `Bearer ${API_TOKEN}`,
   }
   ```

### Option 3: Create Users Directly in Database (Advanced)

Skip the API and insert directly into SQLite database. This requires understanding Strapi's database schema.

## Current Setup Check

Your current credentials in `seed-users.js`:
- Email: `harish@emeelan.com`
- Password: `Welcome@123`

This user **must have permission to update other users** for the seed script to work.

## Testing the Fix

1. Make sure permissions are set (Option 1, Step 3)
2. Run: `npm run seed`
3. Expected output:
   ```
   ✅ Login successful, token obtained
   ✅ Created user: student1 (Arjun Mehta) - Role: student
   ✅ Created user: student2 (Ananya Joshi) - Role: student
   ...
   ```

## Troubleshooting

### Error: "Forbidden" when updating users
- **Cause**: User doesn't have `update` permission on Users
- **Fix**: Follow Option 1, Step 3 to enable permissions

### Error: "Unauthorized"
- **Cause**: Wrong credentials or user doesn't exist
- **Fix**: Verify credentials match an existing user

### Users created but custom fields empty
- **Cause**: Update request failed silently
- **Fix**: Check Strapi logs for permission errors

## Why This Approach?

1. **Standard Strapi Pattern**: Uses regular user authentication
2. **Permission-Based**: Relies on Strapi's built-in RBAC
3. **Secure**: Can revoke permissions after seeding
4. **Flexible**: Can use any user with appropriate permissions

## After Successful Seeding

Remember to **restrict permissions** if needed:
- Go back to Settings → Roles → Authenticated
- Uncheck `update` on User if you don't want regular users updating other users
- Keep `find`, `findOne`, `me` for normal app functionality
