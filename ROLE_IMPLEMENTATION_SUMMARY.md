# Role-Based Authentication Implementation Summary

## Overview
Successfully implemented role-based authentication system with **Admin** and **User** roles for the CameraCart application.

## Changes Made

### 1. Backend Changes ✅

#### **User Model** (`Backend/models/User.js`)
- Added `role` field to the User schema
- Properties:
  - Type: String
  - Enum: ['user', 'admin']
  - Default: 'user'
  - Required: true

#### **Auth Controller** (`Backend/controllers/authController.js`)
- **registerUser()**: 
  - Now accepts `role` from request body
  - Creates user with specified role (defaults to 'user' if not provided)
  - Returns user object including role
- **loginUser()**: 
  - Returns user object including role field
  - JWT token includes user ID (role can be fetched from user object)

### 2. Frontend Changes ✅

#### **SignUp Component** (`Frontend/src/components/SignUp.jsx`)
- Added `role` state variable (default: 'user')
- Created beautiful role selection UI with:
  - Two radio button options: User and Admin
  - Custom styled radio buttons with icons
  - Material Design icons (person for User, admin_panel_settings for Admin)
  - Hover effects and active state indicators
  - Green primary color theme matching the app design
- Sends selected role to backend during registration

#### **Login Component** (`Frontend/src/components/Login.jsx`)
- Updated to store role in localStorage in three ways:
  1. As part of user object: `localStorage.setItem('user', JSON.stringify(response.data.user))`
  2. As separate item: `localStorage.setItem('role', response.data.user.role)`
  3. Displays role in success toast: "Welcome back, {name}! ({role})"

## How It Works

### Registration Flow:
1. User visits signup page
2. Fills in name, email, password
3. Selects role (User or Admin) using the role selector
4. Submits form
5. Backend receives data including role
6. User is created in MongoDB with specified role
7. User redirects to login page

### Login Flow:
1. User enters credentials
2. Backend authenticates and returns user data with role
3. Frontend stores:
   - JWT token in localStorage
   - User object (including role) in localStorage
   - Role separately in localStorage
4. User is redirected to home page
5. Role is available for frontend role-based access control

### MongoDB Structure:
```javascript
{
  _id: ObjectId,
  name: String,
  email: String,
  password: String (hashed),
  role: String ('user' or 'admin'),
  createdAt: Date,
  updatedAt: Date
}
```

## Usage in Frontend

To check user role anywhere in your React app:

```javascript
// Method 1: Get from separate role storage
const userRole = localStorage.getItem('role');

// Method 2: Get from user object
const user = JSON.parse(localStorage.getItem('user'));
const userRole = user?.role;

// Example: Conditional rendering based on role
{userRole === 'admin' && (
  <div>Admin Only Content</div>
)}

{userRole === 'user' && (
  <div>User Content</div>
)}
```

## Next Steps (Optional Enhancements)

1. **Protected Routes**: Create route guards that check user role
2. **Admin Dashboard**: Create separate admin interface
3. **Role-Based API Access**: Add middleware to protect API endpoints by role
4. **Permission System**: Extend to include specific permissions per role
5. **Role Management**: Allow admins to change user roles

## Testing

### Test Registration:
1. Navigate to signup page
2. Fill in user details
3. Select "Admin" or "User" role
4. Submit and check MongoDB - role should be saved

### Test Login:
1. Login with a user
2. Check browser localStorage - should see role stored
3. Check console - should log user object with role
4. Toast message should show role

## Files Modified
- ✅ `Backend/models/User.js`
- ✅ `Backend/controllers/authController.js`
- ✅ `Frontend/src/components/SignUp.jsx`
- ✅ `Frontend/src/components/Login.jsx`

---

**Implementation Status**: Complete ✅
**MongoDB Integration**: Working ✅
**Frontend UI**: Implemented ✅
**Backend API**: Updated ✅
