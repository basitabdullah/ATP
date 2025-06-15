# JWT Authentication System with Role-Based Access Control

A complete authentication system built with Express.js, MongoDB, and JWT tokens stored in HTTP-only cookies.

## Features

- ✅ JWT-based authentication with HTTP-only cookies
- ✅ Role-based access control (RBAC)
- ✅ Password hashing with bcrypt
- ✅ User management CRUD operations
- ✅ Secure middleware for route protection
- ✅ Token expiration (7 days)

## User Roles

- `admin` - Full access to all operations
- `editor` - Content management permissions
- `author` - Content creation permissions
- `premium-user` - Premium features access
- `standard-user` - Basic user access (default)

## Environment Variables

Create a `.env` file in the backend directory:

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/your-database-name
JWT_SECRET=your-super-secret-jwt-key-here
NODE_ENV=development
FRONTEND_URL=http://localhost:3000
```

## API Endpoints

### Authentication Routes (`/api/auth`)

#### Sign Up
```
POST /api/auth/signup
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "role": "standard-user" // optional, defaults to "standard-user"
}
```

#### Login
```
POST /api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}
```

#### Logout
```
POST /api/auth/logout
```

#### Get Current User
```
GET /api/auth/me
Cookie: token=jwt_token_here
```

### User Management Routes (`/api/users`)

All user routes require authentication.

#### Get All Users (Admin Only)
```
GET /api/users
Cookie: token=jwt_token_here
```

#### Get User by ID (Admin or Self)
```
GET /api/users/:id
Cookie: token=jwt_token_here
```

#### Update User (Admin or Self)
```
PUT /api/users/:id
Content-Type: application/json
Cookie: token=jwt_token_here

{
  "name": "Updated Name",
  "email": "updated@example.com",
  "role": "editor" // only admin can update roles
}
```

#### Update Password (Admin or Self)
```
PUT /api/users/:id/password
Content-Type: application/json
Cookie: token=jwt_token_here

{
  "currentPassword": "oldpassword123",
  "newPassword": "newpassword123"
}
```

#### Delete User (Admin Only)
```
DELETE /api/users/:id
Cookie: token=jwt_token_here
```

## Middleware

### `authMiddleware`
Verifies JWT token from HTTP-only cookie and attaches user to request object.

### `authorizeRoles(...roles)`
Restricts access to users with specific roles.

### `authorizeOwnerOrAdmin`
Allows access to resource owners or admin users.

## Usage Examples

### Protecting Routes
```javascript
import { authMiddleware, authorizeRoles } from './middlewares/authMiddleware.js';

// Require authentication
app.get('/protected', authMiddleware, (req, res) => {
  res.json({ user: req.user });
});

// Require specific roles
app.get('/admin-only', authMiddleware, authorizeRoles('admin'), (req, res) => {
  res.json({ message: 'Admin access granted' });
});

// Multiple roles allowed
app.get('/content', authMiddleware, authorizeRoles('admin', 'editor', 'author'), (req, res) => {
  res.json({ message: 'Content management access' });
});
```

### Client-Side Usage (Frontend)
```javascript
// Login
const loginUser = async (email, password) => {
  const response = await fetch('/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include', // Important for cookies
    body: JSON.stringify({ email, password })
  });
  return response.json();
};

// Make authenticated requests
const fetchProtectedData = async () => {
  const response = await fetch('/api/users/me', {
    credentials: 'include' // Important for cookies
  });
  return response.json();
};
```

## Security Features

- **HTTP-only cookies**: Prevents XSS attacks
- **Password hashing**: bcrypt with salt rounds
- **JWT expiration**: 7-day token lifetime
- **Role validation**: Server-side role checking
- **Password exclusion**: Passwords never returned in responses
- **CORS configuration**: Configurable origins

## Installation & Setup

1. Install dependencies:
```bash
npm install
```

2. Set up environment variables in `.env` file

3. Start the server:
```bash
npm run dev  # Development with nodemon
npm start    # Production
```

## File Structure

```
backend/
├── models/
│   └── User.js              # User schema with role enum
├── controllers/
│   ├── authController.js    # Authentication logic
│   └── userController.js    # User management logic
├── routes/
│   ├── authRoutes.js        # Authentication endpoints
│   └── userRoutes.js        # User management endpoints
├── middlewares/
│   └── authMiddleware.js    # JWT & role-based middleware
└── index.js                 # Main server file
``` 