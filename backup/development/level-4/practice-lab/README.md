# Level 4 Practice Lab

## 🎯 Overview

This practice lab reinforces the concepts learned in **Level 4** by building real-time features step-by-step. Each exercise corresponds to lessons in the `lessons/` folder.

---

## 📚 Prerequisites

Before starting, complete:

- ✅ Level 1 (Vanilla JS fundamentals)
- ✅ Level 2 (React components)
- ✅ Level 3 (React Hooks + Strapi API)
- ✅ Level 4 Lessons 1-6

---

## 🛠️ Setup

### 1. Install Dependencies

```bash
cd practice-lab
npm install
```

### 2. Configure Environment

Create `.env` file:

```env
VITE_API_URL=http://202.38.182.170:1348/api
VITE_ABLY_API_KEY=your_ably_key_here
```

### 3. Run Development Server

```bash
npm run dev
```

Visit: http://localhost:5173

---

## 🎓 Lab Exercises

### Exercise 1: Architecture & Setup (Lesson 1)

**Goal**: Understand the improved folder structure

**Tasks**:

1. ✅ Explore `service/` folder outside `src/`
2. ✅ Review `service/api.js` interceptors
3. ✅ Examine `src/context/` organization
4. ✅ Study `src/routes/` centralization

**Deliverable**: Document the data flow from component → service → API

---

### Exercise 2: Advanced Auth Flow (Lesson 2)

**Goal**: Implement complete authentication with auto-fetch user data

**Tasks**:

1. ✅ Test login flow with existing user
2. ✅ Verify JWT token in localStorage
3. ✅ Confirm full user object is fetched after login
4. ✅ Test protected route redirection
5. ✅ Implement "Remember Me" checkbox

**Deliverable**: Working login/logout with complete user data

---

### Exercise 3: Ably Real-Time Client (Lesson 3)

**Goal**: Add live user updates with Ably WebSockets

**Tasks**:

1. ✅ Create `service/realtime/ablyClient.js`
2. ✅ Subscribe to `users-channel`
3. ✅ Listen for `user-created`, `user-updated`, `user-deleted` events
4. ✅ Update Members list in real-time
5. ✅ Add connection status indicator
6. ✅ Display live notifications

**Deliverable**: Members page updates instantly when backend data changes

---

### Exercise 4: Ably Server Integration (Lesson 4)

**Goal**: Configure Strapi backend to broadcast events via Ably

**Tasks**:

1. ✅ Install `ably` package in Strapi
2. ✅ Create `src/api/user/content-types/user/lifecycles.js`
3. ✅ Broadcast on `afterCreate`, `afterUpdate`, `afterDelete`
4. ✅ Sanitize user data before broadcasting
5. ✅ Test end-to-end real-time flow

**Deliverable**: Backend automatically pushes changes to all connected clients

---

### Exercise 5: Advanced React Patterns (Lesson 5)

**Goal**: Build reusable custom hooks and optimize performance

**Tasks**:

1. ✅ Create `useRealtime(channel)` custom hook
2. ✅ Create `useNotifications()` custom hook
3. ✅ Add Error Boundary component
4. ✅ Implement `React.memo()` on MemberCard
5. ✅ Add lazy loading for routes
6. ✅ Code split with `React.lazy()`

**Deliverable**: Optimized app with reusable hooks library

---

### Exercise 6: Production Features (Lesson 6)

**Goal**: Add production-ready features like optimistic updates and offline support

**Tasks**:

1. ✅ Implement optimistic UI updates (show changes before API response)
2. ✅ Add offline queue with retry logic
3. ✅ Create toast notifications system
4. ✅ Add loading skeletons
5. ✅ Implement infinite scroll for Members list
6. ✅ Build for production with `npm run build`

**Deliverable**: Production-ready app deployed to Netlify/Vercel

---

## 🧪 Testing Checklist

### Authentication

- [ ] Login with valid credentials
- [ ] Login shows full user data (first_name, last_name, etc.)
- [ ] Protected routes redirect to /login
- [ ] Logout clears localStorage
- [ ] Token auto-refresh works

### Real-Time Features

- [ ] Open app in 2 browser windows
- [ ] Create user in one window → appears in other window
- [ ] Update user in one window → updates in other window
- [ ] Delete user in one window → removes from other window
- [ ] Connection status shows "Connected" when online

### Performance

- [ ] Initial load < 2 seconds
- [ ] No unnecessary re-renders
- [ ] Lazy-loaded routes work
- [ ] Optimistic updates feel instant

### Error Handling

- [ ] Network errors show toast notification
- [ ] Error boundary catches component errors
- [ ] 401 errors redirect to login
- [ ] Offline mode queues actions

---

## 📂 Expected Folder Structure

```
practice-lab/
├── service/                    # Business logic (OUTSIDE src/)
│   ├── api.js                 # Axios with interceptors
│   ├── auth/
│   │   └── authService.js     # Login, register, logout
│   ├── user/
│   │   └── userService.js     # User CRUD
│   └── realtime/
│       ├── ablyClient.js      # Ably singleton
│       └── channelService.js  # Channel management
├── src/
│   ├── components/            # Reusable UI
│   │   ├── Header.jsx
│   │   ├── Footer.jsx
│   │   ├── Layout.jsx
│   │   ├── ErrorBoundary.jsx
│   │   └── Notifications/
│   │       ├── NotificationBell.jsx
│   │       └── NotificationList.jsx
│   ├── context/               # Global state
│   │   ├── AuthContext.jsx
│   │   └── RealtimeContext.jsx
│   ├── hooks/                 # Custom hooks
│   │   ├── useRealtime.js
│   │   ├── useNotifications.js
│   │   └── useAuth.js
│   ├── pages/                 # Route pages
│   │   ├── Login.jsx
│   │   ├── Register.jsx
│   │   ├── Home.jsx
│   │   ├── Members.jsx
│   │   └── Profile.jsx
│   ├── routes/                # Route config
│   │   ├── index.jsx
│   │   └── ProtectedRoute.jsx
│   ├── styles/                # CSS files
│   ├── App.jsx
│   └── main.jsx
├── .env.example
├── package.json
└── README.md (this file)
```

---

## 🚀 Bonus Challenges

### Challenge 1: Presence Tracking

Add online/offline indicators showing which users are currently active.

### Challenge 2: Typing Indicators

Show "User is typing..." in real-time chat.

### Challenge 3: Read Receipts

Track and display message read status.

### Challenge 4: Admin Dashboard

Create admin panel with live user statistics dashboard.

### Challenge 5: Push Notifications

Integrate browser push notifications for important events.

---

## 📊 Grading Rubric

| Feature               | Points | Criteria                                         |
| --------------------- | ------ | ------------------------------------------------ |
| **Auth Flow**         | 20     | Complete login/logout with auto-fetch user data  |
| **Real-Time Updates** | 25     | Ably integration working for all CRUD operations |
| **Custom Hooks**      | 15     | At least 3 reusable custom hooks                 |
| **Error Handling**    | 15     | Error boundaries + toast notifications           |
| **Performance**       | 15     | Memoization, lazy loading, code splitting        |
| **Code Quality**      | 10     | Clean code, proper comments, no console errors   |
| **TOTAL**             | 100    |                                                  |

---

## 📚 Resources

- [React Documentation](https://react.dev)
- [Ably Realtime Documentation](https://ably.com/docs)
- [Strapi Documentation](https://docs.strapi.io)
- [Vite Guide](https://vitejs.dev/guide/)
- [React Router](https://reactrouter.com)

---

## 🆘 Troubleshooting

### Ably not connecting

```bash
# Check .env file
cat .env

# Verify API key is correct
# Check Ably dashboard for connection logs
```

### Real-time events not received

```bash
# Check browser console for Ably errors
# Verify channel names match between client and server
# Check Strapi lifecycle hooks are firing
```

### 403 Forbidden errors

```bash
# Clear localStorage and try again
localStorage.clear()

# Check user status in Strapi admin
# Verify user is APPROVED, not PENDING/BLOCKED
```

---

**Happy coding!** 🚀 Build amazing real-time features!
