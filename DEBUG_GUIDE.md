# Debug Guide for "Add to Cart" Error

## What We've Done

I've added comprehensive logging to help identify where the "add to cart" error is occurring:

### Backend Changes:
1. **authMiddleware.js** - Added detailed logging for:
   - Token presence in request headers
   - Token extraction
   - Token verification
   - User lookup from database
   - Treat literal `'null'` or `'undefined'` tokens as missing

2. **cartController.js** - Added detailed logging for:
   - Request body and user info
   - Product lookup
   - Cart creation/update operations
   - Every step of the add to cart process

### Frontend Changes:
1. **Global `api` client** (`src/api.js`) – centralized axios instance with:
   - baseURL config
   - request interceptor that automatically injects a bearer token
   - response interceptor catching 401s and forcing logout/redirect
2. Updated all components (`Home`, `CategoryPage`, `ProductDetails`, `Cart`, `Checkout`, `Orders`, `Login`, `SignUp`) to use `api` instead of raw `axios`.
3. Added token presence/validity checks in components that initiate protected actions (e.g. add to cart).
4. `ProtectedRoute` now decodes the JWT and verifies expiration, clearing storage and redirecting if invalid.

## How to Test

### Step 1: Open Browser DevTools
1. Open your browser (where the frontend is running at http://localhost:5173)
2. Press F12 to open DevTools
3. Go to the Console tab

### Step 2: Check Current Login Status
1. In the Console, type: `localStorage.getItem('token')`
2. If it shows `null`, you need to login
3. If it shows a long string (JWT token), you're logged in

### Step 3: Test Add to Cart
1. Navigate to http://localhost:5173/home
2. Click on "Add to Cart" button on any product
3. Watch BOTH:
   - **Browser Console** (F12 > Console tab) - for frontend logs
   - **Backend Terminal** (where nodemon is running) - for backend logs

## Expected Log Flow (if working correctly)

### Frontend Console:
```
🔐 Token from localStorage: eyJhbGciOiJIUzI1Ni...
📦 Adding product to cart: 65abc123...
✅ Cart response: { success: true, message: 'Item added to cart', data: {...} }
```

### Backend Terminal:
```
🔐 Auth Middleware - Headers: Present
🔑 Token extracted: eyJhbGciOiJIUzI1Ni...
✅ Token verified successfully. User ID: 65xyz789...
✅ User found: John Doe - ID: 65xyz789...
🛒 Add to Cart Request - Body: { productId: '65abc123...', quantity: 1 }
👤 User from request: { id: 65xyz789..., name: 'John Doe' }
🔍 Looking for product: 65abc123...
✅ Product found: Canon EOS R5
📦 Creating new cart for user: 65xyz789...
➕ Adding new item to cart
💾 Cart saved successfully
📊 Cart populated with product details
```

## Common Issues and Solutions

### Issue 1: "No token found!" or "Not authorized, no token"
**Symptom:** Frontend shows "No token found!" in console
**Solution:** You need to login again
- Go to http://localhost:5173/login
- Login with your credentials
- Try adding to cart again

### Issue 2: "Not authorized, token failed"
**Symptom:** Backend shows "❌ Token verification error"
**Possible Causes:**
1. Token expired (older than 30 days)
2. JWT_SECRET mismatch
3. Token was generated with different secret

**Solution:**
1. Logout and login again to get a fresh token
2. Clear localStorage: `localStorage.clear()` in browser console
3. Login again

### Issue 3: "User not found for token"
**Symptom:** Backend verifies token but can't find user
**Solution:** The user account may have been deleted from database
- Create a new account
- Login with the new account

### Issue 4: "Product not found"
**Symptom:** Backend shows "❌ Product not found"
**Solution:** The product ID is invalid or product was deleted
- Try a different product
- Check if products are loading on the home page

## Manual Debugging Steps

### Check if token is valid:
```javascript
// In browser console
const token = localStorage.getItem('token');
const base64Url = token.split('.')[1];
const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
    return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
}).join(''));

console.log(JSON.parse(jsonPayload));
// This will show you the user ID and expiration date
```

### Force a fresh login:
```javascript
// In browser console
localStorage.clear();
// Then navigate to login page
window.location.href = '/login';
```

## Next Steps

Please follow the testing steps above and share:
1. What you see in the browser console
2. What you see in the backend terminal
3. Any error messages

This will help us pinpoint exactly where the issue is occurring!
