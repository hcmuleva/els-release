# Fixes Applied - Question and Exam Management

## Date: November 7, 2025

## Issues Fixed

### 1. ✅ Course and Subject Lists Not Displaying

**Problem**: 
- Dropdown lists for courses and subjects were empty in `/teacher/questions/create` and other pages
- Data was not loading from Strapi backend

**Root Cause**:
- API baseURL was incorrectly pointing to `http://localhost:5002` 
- Strapi v5 server runs on `http://localhost:1337`

**Solution**:
Updated `/react_client1/src/api.js`:
```javascript
// Before
baseURL: process.env.REACT_APP_API_URL || "http://localhost:5002"

// After  
baseURL: process.env.REACT_APP_API_URL || "http://localhost:1337"
```

**Files Modified**:
- `/react_client1/src/api.js` - Fixed API baseURL

**Debug Logging Added**:
Added console.log statements to help debug API calls in:
- `CreateQuestionPage.js` - fetchData()
- `CreateExamPage.js` - fetchCourses(), fetchSubjects()
- `QuestionBankPage.js` - fetchData()
- `ExamManagementPage.js` - fetchCourses(), fetchSubjects()

### 2. ✅ Navigation from Teacher Dashboard

**Problem**:
- "Question Bank" and "Exams" cards on teacher dashboard were not clickable
- No way to navigate to question/exam management pages from homepage

**Solution**:
Updated `/react_client1/src/pages/HomePage.js`:

**Changes Made**:
1. Added `clickable` class and `onClick` handler to "Question Bank" card
2. Added `clickable` class and `onClick` handler to "Exams" card (changed from "Assignments")
3. Cards now navigate using `react-router-dom`'s `navigate()` function

```javascript
// Question Bank Card
<div 
  className="dashboard-card clickable"
  onClick={() => navigate("/teacher/questions")}
>
  <div className="card-icon">❓</div>
  <div className="card-content">
    <h3>Question Bank</h3>
    <p>Manage questions and create exams</p>
  </div>
</div>

// Exams Card  
<div 
  className="dashboard-card clickable"
  onClick={() => navigate("/teacher/exams")}
>
  <div className="card-icon">📋</div>
  <div className="card-content">
    <h3>Exams</h3>
    <p>Create and manage exams</p>
  </div>
</div>
```

**Files Modified**:
- `/react_client1/src/pages/HomePage.js` - Added navigation to Question Bank and Exams

## Testing Instructions

### 1. Start Strapi Server
```bash
cd /Users/Harish.Muleva/project/experiments/m2m/dev-test-ops-pro/level1/development/lmsserver
npm run develop
```
**Expected**: Server starts on `http://localhost:1337`

### 2. Verify Strapi Data
1. Open browser: `http://localhost:1337/admin`
2. Login to Strapi admin panel
3. Check Content Manager for:
   - **Courses** - Should have at least 1-2 courses
   - **Subjects** - Should have at least 1-2 subjects
   - **Questions** - Optional, can be created from React app
   - **Exams** - Optional, can be created from React app

### 3. Start React Client
```bash
cd /Users/Harish.Muleva/project/experiments/m2m/dev-test-ops-pro/level1/development/react_client1
npm start
```
**Expected**: Client starts on `http://localhost:3030`

### 4. Test Navigation
1. Login to the application
2. Switch role to **Teacher** (using role selector)
3. On dashboard, you should see 4 cards:
   - Create Content
   - Question Bank ✅ (now clickable)
   - Exams ✅ (now clickable)
   - Student Reports
4. Click **"Question Bank"** → Should navigate to `/teacher/questions`
5. Click **"Exams"** → Should navigate to `/teacher/exams`

### 5. Test Course/Subject Lists
1. Navigate to `/teacher/questions/create` (click "Create New Question" button)
2. **Check console logs** (F12 → Console tab):
   - Should see: "Fetching courses and subjects..."
   - Should see: "Courses response: {...}"
   - Should see: "Subjects response: {...}"
3. **Check dropdowns**:
   - Course dropdown should show list of courses
   - Subject dropdown should show list of subjects
4. If empty:
   - Check console for errors
   - Verify Strapi has courses/subjects data
   - Check network tab for failed requests
   - Ensure JWT token is being sent (Authorization header)

### 6. Test Exam Creation
1. Navigate to `/teacher/exams` (click "Create New Exam" button)
2. Go through 3-step wizard:
   - **Step 1**: Course and Subject dropdowns should be populated
   - **Step 2**: Question filters should show course/subject options
   - **Step 3**: Review and submit
3. Check console for any errors

## Verification Checklist

- [ ] API baseURL changed to `http://localhost:1337`
- [ ] Question Bank card is clickable on teacher dashboard
- [ ] Exams card is clickable on teacher dashboard
- [ ] Question Bank card navigates to `/teacher/questions`
- [ ] Exams card navigates to `/teacher/exams`
- [ ] Course dropdown shows courses in Create Question page
- [ ] Subject dropdown shows subjects in Create Question page
- [ ] Course dropdown shows courses in Create Exam page
- [ ] Subject dropdown shows subjects in Create Exam page
- [ ] Console logs show successful API responses
- [ ] No CORS errors in browser console
- [ ] JWT token is being sent with requests

## Expected API Responses

### Courses API: `/api/courses?populate=*`
```json
{
  "data": [
    {
      "id": 1,
      "attributes": {
        "name": "Introduction to Programming",
        "description": "...",
        "createdAt": "...",
        "updatedAt": "...",
        "publishedAt": "..."
      }
    }
  ],
  "meta": {
    "pagination": {...}
  }
}
```

### Subjects API: `/api/subjects?populate=*`
```json
{
  "data": [
    {
      "id": 1,
      "attributes": {
        "name": "Python Basics",
        "description": "...",
        "createdAt": "...",
        "updatedAt": "...",
        "publishedAt": "..."
      }
    }
  ],
  "meta": {
    "pagination": {...}
  }
}
```

## Common Issues & Solutions

### Issue: Dropdowns still empty after fix
**Check**:
1. Browser console for errors
2. Network tab for failed requests
3. Strapi admin panel - ensure courses/subjects exist
4. JWT token validity (check localStorage.getItem('token'))
5. Strapi permissions for courses/subjects (authenticated users should have find/findOne access)

**Solution**:
```bash
# In Strapi Admin Panel:
# Settings → Users & Permissions → Roles → Authenticated
# Enable permissions for:
# - Course: find, findOne
# - Subject: find, findOne
# - Question: find, findOne, create, update, delete
# - Exam: find, findOne, create, update, delete
```

### Issue: CORS errors
**Solution**:
Check `/lmsserver/config/middlewares.ts` has proper CORS config:
```typescript
{
  name: 'strapi::cors',
  config: {
    enabled: true,
    origin: ['http://localhost:3030'],
  }
}
```

### Issue: 401 Unauthorized
**Solution**:
- Token expired or invalid
- Login again to get fresh token
- Check AuthContext is properly providing token

## Debug Commands

### Check if Strapi is running
```bash
curl http://localhost:1337/api/courses
```

### Check if React can reach Strapi
Open browser console and run:
```javascript
fetch('http://localhost:1337/api/courses', {
  headers: {
    'Authorization': `Bearer ${localStorage.getItem('token')}`
  }
})
.then(r => r.json())
.then(console.log)
```

### Check environment variables
In React app console:
```javascript
console.log('API URL:', process.env.REACT_APP_API_URL || 'http://localhost:1337')
```

## Summary

Both issues have been fixed:
1. ✅ API baseURL corrected → Course/Subject lists will now load
2. ✅ Dashboard navigation added → Can access Question Bank and Exams from teacher dashboard

The application is now ready for testing. All debug logging has been added to help troubleshoot any remaining issues.
