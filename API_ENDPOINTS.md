# API Endpoints Documentation

## Base URL

```
http://localhost:3000/api  (Development)
https://api.yourdomain.com/api  (Production)
```

## Authentication Endpoints

### 1. Register User

**Endpoint:** `POST /auth/register`

**Request Body:**

```json
{
  "fullName": "string",
  "email": "string",
  "phoneNumber": "string",
  "username": "string",
  "password": "string"
}
```

**Response (Success):**

```json
{
  "success": true,
  "message": "Registration successful",
  "user": {
    "id": "string (MongoDB ObjectId)",
    "fullName": "string",
    "email": "string",
    "phoneNumber": "string",
    "username": "string",
    "avatar": "string (URL)",
    "createdAt": "string (ISO 8601)",
    "updatedAt": "string (ISO 8601)"
  },
  "token": "string (JWT)",
  "refreshToken": "string (JWT)"
}
```

**Response (Error):**

```json
{
  "success": false,
  "message": "string",
  "errors": {
    "fieldName": "string"
  }
}
```

**Status Codes:**

- `201` - User created successfully
- `400` - Validation error
- `409` - Username or email already exists

---

### 2. Login User

**Endpoint:** `POST /auth/login`

**Request Body:**

```json
{
  "username": "string",
  "password": "string"
}
```

**Response (Success):**

```json
{
  "success": true,
  "message": "Login successful",
  "user": {
    "id": "string",
    "fullName": "string",
    "email": "string",
    "phoneNumber": "string",
    "username": "string",
    "avatar": "string",
    "createdAt": "string",
    "updatedAt": "string"
  },
  "token": "string (JWT)",
  "refreshToken": "string (JWT)"
}
```

**Response (Error):**

```json
{
  "success": false,
  "message": "Account or password is incorrect"
}
```

**Status Codes:**

- `200` - Login successful
- `401` - Invalid credentials
- `404` - User not found

---

### 3. Google OAuth Login

**Endpoint:** `POST /auth/google`

**Request Body:**

```json
{
  "token": "string (Google OAuth token)",
  "idToken": "string (optional)"
}
```

**Response (Success):**

```json
{
  "success": true,
  "message": "Google login successful",
  "user": {
    "id": "string",
    "fullName": "string",
    "email": "string",
    "phoneNumber": "string",
    "username": "string",
    "avatar": "string",
    "createdAt": "string",
    "updatedAt": "string"
  },
  "token": "string (JWT)",
  "refreshToken": "string (JWT)"
}
```

**Status Codes:**

- `200` - Login successful
- `400` - Invalid token
- `401` - Token verification failed

---

### 4. Refresh Token

**Endpoint:** `POST /auth/refresh`

**Request Body:**

```json
{
  "refreshToken": "string"
}
```

**Response (Success):**

```json
{
  "success": true,
  "token": "string (new JWT)",
  "refreshToken": "string (new refresh token)"
}
```

**Status Codes:**

- `200` - Token refreshed
- `401` - Invalid or expired refresh token

---

### 5. Logout

**Endpoint:** `POST /auth/logout`

**Request Headers:**

```
Authorization: Bearer {token}
```

**Response (Success):**

```json
{
  "success": true,
  "message": "Logout successful"
}
```

**Status Codes:**

- `200` - Logout successful
- `401` - Unauthorized

---

### 6. Get Current User Info

**Endpoint:** `GET /auth/me`

**Request Headers:**

```
Authorization: Bearer {token}
```

**Response (Success):**

```json
{
  "success": true,
  "user": {
    "id": "string",
    "fullName": "string",
    "email": "string",
    "phoneNumber": "string",
    "username": "string",
    "avatar": "string",
    "createdAt": "string",
    "updatedAt": "string"
  }
}
```

**Status Codes:**

- `200` - User info retrieved
- `401` - Unauthorized
- `404` - User not found

---

### 7. Update User Profile

**Endpoint:** `PUT /auth/profile`

**Request Headers:**

```
Authorization: Bearer {token}
Content-Type: application/json
```

**Request Body:**

```json
{
  "fullName": "string (optional)",
  "phoneNumber": "string (optional)",
  "avatar": "string (optional, URL)"
}
```

**Response (Success):**

```json
{
  "success": true,
  "message": "Profile updated successfully",
  "user": {
    "id": "string",
    "fullName": "string",
    "email": "string",
    "phoneNumber": "string",
    "username": "string",
    "avatar": "string",
    "createdAt": "string",
    "updatedAt": "string"
  }
}
```

**Status Codes:**

- `200` - Profile updated
- `400` - Validation error
- `401` - Unauthorized
- `404` - User not found

---

### 8. Change Password

**Endpoint:** `POST /auth/change-password`

**Request Headers:**

```
Authorization: Bearer {token}
```

**Request Body:**

```json
{
  "currentPassword": "string",
  "newPassword": "string",
  "confirmPassword": "string"
}
```

**Response (Success):**

```json
{
  "success": true,
  "message": "Password changed successfully"
}
```

**Response (Error):**

```json
{
  "success": false,
  "message": "Current password is incorrect"
}
```

**Status Codes:**

- `200` - Password changed
- `400` - Validation error
- `401` - Unauthorized

---

### 9. Forgot Password

**Endpoint:** `POST /auth/forgot-password`

**Request Body:**

```json
{
  "email": "string"
}
```

**Response (Success):**

```json
{
  "success": true,
  "message": "Reset link sent to your email"
}
```

**Status Codes:**

- `200` - Email sent
- `404` - User not found

---

### 10. Reset Password

**Endpoint:** `POST /auth/reset-password`

**Request Body:**

```json
{
  "token": "string (from reset email)",
  "newPassword": "string",
  "confirmPassword": "string"
}
```

**Response (Success):**

```json
{
  "success": true,
  "message": "Password reset successfully"
}
```

**Status Codes:**

- `200` - Password reset
- `400` - Invalid or expired token
- `400` - Validation error

---

## User Model

```typescript
interface User {
  id: string; // MongoDB ObjectId
  fullName: string;
  email: string;
  phoneNumber?: string;
  username: string; // Unique
  password: string; // Hashed in database
  avatar?: string; // Avatar URL
  role?: string; // admin | user (default: user)
  isEmailVerified?: boolean;
  isPhoneVerified?: boolean;
  createdAt: string; // ISO 8601
  updatedAt: string; // ISO 8601
}
```

---

## Authentication Headers

All authenticated endpoints require:

```
Authorization: Bearer {token}
```

Where `{token}` is the JWT returned from login or register.

---

## Error Handling

Standard error response format:

```json
{
  "success": false,
  "message": "string",
  "statusCode": 400,
  "timestamp": "ISO 8601",
  "errors": {
    "fieldName": "string"
  }
}
```

**Common HTTP Status Codes:**

- `200` - OK
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `409` - Conflict
- `500` - Internal Server Error

---

## Implementation Notes for Backend Integration

### When integrating with your backend:

1. **Update API_URL** in [AuthService](src/app/shared/services/auth.service.ts)

   ```typescript
   private apiUrl = 'http://localhost:3000/api/auth';  // Development
   // OR
   private apiUrl = environment.apiUrl + '/api/auth';  // Production
   ```

2. **Replace AuthServiceMock** with real HTTP calls
   - Remove/disable `auth.service.mock.ts`
   - Use `auth.service.ts` with HttpClient

3. **Add JWT Interceptor** for automatic token injection
   - Create `src/app/shared/interceptors/auth.interceptor.ts`
   - Register in `app.config.ts` providers

4. **Add Error Handling** for all scenarios
   - Network errors
   - Validation errors
   - Token expiration
   - Unauthorized access

5. **Add Loading States** in UI
   - Show spinner during API calls
   - Disable buttons during submission
   - Handle timeout scenarios

6. **CORS Configuration** (Backend)

   ```javascript
   // Enable CORS on backend
   const cors = require("cors");
   app.use(
     cors({
       origin: "http://localhost:4200",
       credentials: true,
     }),
   );
   ```

7. **Token Storage**
   - Currently stored in localStorage
   - Consider moving to httpOnly cookies for security
   - Implement token refresh logic

---

## Testing Credentials (Mock Service)

For testing with the mock service:

```
Username: testuser
Password: Test@123

Username: johndoe
Password: John@123
```

These are only available in development with the mock service.
