# Alumni College App - Client

A professional, responsive web application for managing alumni and student data with a beautiful purple/white themed UI.

## 🎨 Features

- **Authentication System**

  - Login and Registration with Strapi v4 backend
  - JWT token-based authentication
  - Protected routes with auth guards
  - Persistent sessions using localStorage

- **User Management**

  - View all students and alumni
  - Advanced search and filtering
  - Filter by role (Student/Alumni/Admin)
  - Filter by status (Approved/Pending/Rejected/Blocked/Suspended)
  - Filter by joining/passing years
  - Real-time search across name, username, and email

- **Dashboard**

  - Statistics overview (Total users, Students, Alumni, Admins)
  - Beautiful card-based layout
  - Quick access links

- **Profile Management**

  - View and edit personal information
  - Update contact details
  - Manage academic information (start/end dates)
  - Profile photo avatar with initials

- **User Details**
  - View detailed user profiles
  - Contact information
  - Academic timeline
  - Role and status badges

## 🛠️ Tech Stack

- **React** - UI framework
- **React Router DOM** - Navigation and routing
- **Axios** - HTTP client for API calls
- **Strapi v4** - Headless CMS backend
- **Vite** - Build tool and dev server

## 📁 Project Structure

```
src/
├── components/          # Reusable components
│   ├── Layout.jsx      # Main layout with navigation
│   └── Layout.css
├── context/            # React context providers
│   └── AuthContext.jsx # Authentication state management
├── pages/              # Page components
│   ├── Login.jsx
│   ├── Register.jsx
│   ├── Home.jsx        # Dashboard
│   ├── Users.jsx       # Users list with filters
│   ├── UserDetail.jsx  # Individual user profile
│   ├── Profile.jsx     # Logged-in user profile
│   └── *.css          # Page styles
├── routes/             # Route configuration
│   ├── index.jsx      # Main routes
│   └── ProtectedRoute.jsx
├── service/            # API services
│   ├── api.js         # Axios configuration
│   ├── auth/
│   │   └── authService.js
│   └── user/
│       └── userService.js
├── App.jsx
├── App.css
├── index.css          # Global styles
└── main.jsx
```

## 🚀 Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Strapi v4 backend running

### Installation

1. Clone the repository
2. Install dependencies:

   ```bash
   npm install
   ```

3. Configure environment variables:
   Create a `.env` file in the root directory:

   ```env
   VITE_API_URL=https://emeelen.com/alumniserver/api
   ```

4. Start the development server:

   ```bash
   npm run dev
   ```

5. Open your browser to `http://localhost:5173`

## 🎨 Design Theme

- **Primary Color**: Purple (#7c3aed)
- **Secondary Color**: Dark Purple (#5b21b6)
- **Background**: White and light gray tones
- **Typography**: Inter, System UI fonts
- **Responsive**: Mobile-first design approach

## 📱 Pages

### Authentication

- **Login** (`/login`) - User login with username/email and password
- **Register** (`/register`) - New user registration

### Protected Pages

- **Home** (`/home`) - Dashboard with statistics
- **Users** (`/users`) - Browse and search all users
- **User Detail** (`/users/:userId`) - View individual user profile
- **Profile** (`/profile`) - Edit logged-in user's profile

## 🔐 Authentication Flow

1. User logs in with credentials
2. Backend returns JWT token and user ID
3. App fetches full user data using user ID
4. User data and auth state stored in localStorage
5. Protected routes check authentication before rendering
6. Token automatically included in API requests via interceptor

## 🌐 API Integration

All API calls go through the configured Axios instance (`service/api.js`) which:

- Automatically adds JWT token to requests
- Handles errors globally
- Intercepts responses for consistent data handling
- Manages 401 unauthorized responses

### Available Services

**Auth Service** (`service/auth/authService.js`)

- `register(userData)` - Register new user
- `login(identifier, password)` - Login user
- `logout()` - Clear local storage

**User Service** (`service/user/userService.js`)

- `getUserById(userId)` - Get user by ID
- `getAllUsers(filters)` - Get all users with optional filters
- `updateUser(userId, userData)` - Update user profile
- `getUserStats()` - Get user statistics

## 🎯 User Schema (Strapi)

```javascript
{
  username: String,
  email: Email,
  password: Password,
  first_name: String,
  last_name: String,
  mobile_number: Number,
  dob: Date,
  start_date: Date,
  end_date: Date,
  profile_photo: Media,
  user_role: Enum ['ALUMNI', 'STUDENT', 'ADMIN'],
  user_status: Enum ['APPROVED', 'REJECTED', 'BLOCKED', 'PENDING', 'SUSPENDED'],
  role: Relation,
  provider: String,
  resetPasswordToken: String,
  confirmationToken: String,
  confirmed: Boolean,
  blocked: Boolean
}
```

## 🎨 Key Features Showcase

### Responsive Design

- Mobile-optimized navigation
- Adaptive grid layouts
- Touch-friendly interfaces
- Collapsible filters on mobile

### Professional UI/UX

- Smooth animations and transitions
- Loading states
- Error handling with user feedback
- Toast notifications for actions
- Intuitive navigation

### Search & Filter

- Real-time search
- Multiple filter combinations
- Clear filter options
- Results count display

## 📄 Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
npm run lint         # Run ESLint
```

## 🚢 Deployment

1. Build the project:

   ```bash
   npm run build
   ```

2. Deploy the `dist` folder to your hosting provider

## 📝 License

This project is created for educational and portfolio purposes.

## 👨‍💻 Author

Built with ❤️ for the Alumni College community
