# API Endpoints - Checklist for Backend Development

## 📋 10 API Endpoints Required

### ✅ Authentication Endpoints

#### 1. POST /api/auth/register

**Status:** Not implemented (Waiting for backend)
**Purpose:** Create new user account
**Required Fields:** fullName, email, phoneNumber, username, password
**Returns:** User object + JWT tokens

#### 2. POST /api/auth/login

**Status:** Not implemented (Waiting for backend)
**Purpose:** Authenticate existing user
**Required Fields:** username, password
**Returns:** User object + JWT tokens

#### 3. POST /api/auth/google

**Status:** Not implemented (Waiting for backend)
**Purpose:** OAuth 2.0 Google login
**Required Fields:** token (Google OAuth token)
**Returns:** User object + JWT tokens

#### 4. POST /api/auth/refresh

**Status:** Not implemented (Waiting for backend)
**Purpose:** Refresh expired JWT token
**Required Fields:** refreshToken
**Returns:** New JWT token + refresh token

#### 5. GET /api/auth/me

**Status:** Not implemented (Waiting for backend)
**Purpose:** Get current authenticated user
**Headers:** Authorization: Bearer {token}
**Returns:** User object

#### 6. PUT /api/auth/profile

**Status:** Not implemented (Waiting for backend)
**Purpose:** Update user profile
**Headers:** Authorization: Bearer {token}
**Fields:** fullName, phoneNumber, avatar (all optional)
**Returns:** Updated user object

#### 7. POST /api/auth/logout

**Status:** Not implemented (Waiting for backend)
**Purpose:** Logout user (invalidate token)
**Headers:** Authorization: Bearer {token}
**Returns:** Success message

#### 8. POST /api/auth/change-password

**Status:** Not implemented (Waiting for backend)
**Purpose:** Change user password
**Headers:** Authorization: Bearer {token}
**Fields:** currentPassword, newPassword, confirmPassword
**Returns:** Success message

#### 9. POST /api/auth/forgot-password

**Status:** Not implemented (Waiting for backend)
**Purpose:** Request password reset
**Fields:** email
**Returns:** Success message (email sent)

#### 10. POST /api/auth/reset-password

**Status:** Not implemented (Waiting for backend)
**Purpose:** Reset password with token
**Fields:** token, newPassword, confirmPassword
**Returns:** Success message

---

## 🗂️ Response Format Template

### Success Response

```json
{
  "success": true,
  "message": "Operation successful",
  "data": {
    // endpoint-specific data
  }
}
```

### Error Response

```json
{
  "success": false,
  "message": "Error description",
  "statusCode": 400,
  "errors": {
    "fieldName": "Field-specific error message"
  }
}
```

---

## 👤 User Model Required

```typescript
{
  id: string;              // Unique ID (MongoDB ObjectId)
  fullName: string;        // User's full name
  email: string;           // Email address (unique)
  phoneNumber?: string;    // Optional phone
  username: string;        // Username (unique)
  avatar?: string;         // Avatar URL
  role?: string;           // admin | user
  createdAt: string;       // ISO 8601 timestamp
  updatedAt: string;       // ISO 8601 timestamp
}
```

---

## 🔑 JWT Token Format

**Expected JWT Structure:**

```
Header: {
  "alg": "HS256",
  "typ": "JWT"
}

Payload: {
  "sub": "user_id",
  "email": "user@example.com",
  "username": "username",
  "iat": 1642000000,
  "exp": 1642086400
}
```

---

## 📊 HTTP Status Codes to Return

| Status | Meaning                              | Endpoints                  |
| ------ | ------------------------------------ | -------------------------- |
| 200    | OK - Success                         | GET, PUT, POST             |
| 201    | Created - New resource               | POST (register/login)      |
| 400    | Bad Request - Invalid data           | All                        |
| 401    | Unauthorized - Invalid/missing token | Protected endpoints        |
| 403    | Forbidden - Access denied            | Admin endpoints            |
| 404    | Not Found - Resource not found       | GET /me (invalid user)     |
| 409    | Conflict - Resource exists           | register (duplicate email) |
| 500    | Server error                         | All                        |

---

## 🔐 Authentication Requirements

### Token Management

- ✅ Return JWT in response body
- ✅ Return refresh token
- ✅ Support Bearer token in Authorization header
- ✅ Validate token on protected endpoints

### Password Requirements

- Minimum 6 characters
- At least 1 uppercase letter
- At least 1 lowercase letter
- At least 1 number
- At least 1 special character

### CORS Configuration

```
Allow Origin: http://localhost:4200 (development)
Allow Methods: GET, POST, PUT, DELETE, OPTIONS
Allow Headers: Content-Type, Authorization
Credentials: true
```

---

## 🧪 Manual Testing Examples

### Test Register

```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "fullName": "Test User",
    "email": "test@example.com",
    "phoneNumber": "0123456789",
    "username": "testuser",
    "password": "Test@123"
  }'
```

### Test Login

```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser",
    "password": "Test@123"
  }'
```

### Test Protected Endpoint

```bash
curl -X GET http://localhost:3000/api/auth/me \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

---

## 📋 Backend Checklist

- [ ] Database setup (MongoDB/SQL)
- [ ] User model created
- [ ] Hash passwords (bcrypt/argon2)
- [ ] Implement JWT authentication
- [ ] Create 10 API endpoints
- [ ] Add input validation
- [ ] Add error handling
- [ ] Configure CORS
- [ ] Test with Postman/cURL
- [ ] Test with frontend Angular app
- [ ] Add rate limiting
- [ ] Add logging
- [ ] Setup refresh token rotation
- [ ] Test token expiration
- [ ] Test 401 handling

---

## 🔄 Integration Flow

```
User Input (Frontend)
        ↓
Angular Component
        ↓
AuthService.login()
        ↓
HttpClient.post() + Interceptor
        ↓
[Add Authorization Header]
        ↓
Backend API Endpoint
        ↓
Validate JWT | Execute Operation | Return Response
        ↓
Handle Response in Component
        ↓
Update UI / Navigate
```

---

## 📞 Frontend Ready

The frontend is **100% ready** for backend integration:

- ✅ API service structure prepared
- ✅ Interceptor structure ready
- ✅ Guard structure ready
- ✅ Error handling implemented
- ✅ Loading states ready
- ✅ Form validation ready

**Next:** Implement these 10 endpoints on backend and update environment URL.

---

**Created:** January 18, 2026
**Status:** Frontend complete, awaiting backend implementation
