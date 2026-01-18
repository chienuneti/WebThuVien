# API Documentation - Authentication Endpoints

## Base URL

```
http://localhost:3000/api/auth
```

## Authentication Headers

### Bearer Token

All authenticated endpoints require this header:

```
Authorization: Bearer <auth_token>
```

## Endpoints

### 1. Register User

**POST** `/register`

Register a new user account.

**Request Body:**

```json
{
  "fullName": "John Doe",
  "email": "john@example.com",
  "phoneNumber": "0123456789",
  "username": "johndoe",
  "password": "SecurePass@123"
}
```

**Response (Success 201):**

```json
{
  "success": true,
  "message": "Registration successful",
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "fullName": "John Doe",
    "email": "john@example.com",
    "phoneNumber": "0123456789",
    "username": "johndoe",
    "avatar": null,
    "createdAt": "2024-01-18T10:30:00Z",
    "updatedAt": "2024-01-18T10:30:00Z"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Response (Error 400/409):**

```json
{
  "success": false,
  "message": "Email already exists",
  "errors": {
    "email": ["Email đã được đăng ký"],
    "username": ["Tài khoản đã tồn tại"]
  }
}
```

**Validation Rules:**

- `fullName`: Required, min 3 characters, max 100 characters
- `email`: Required, valid email format, unique
- `phoneNumber`: Required, valid Vietnamese phone (0xxxxxxxxx or +84xxxxxxxxx)
- `username`: Required, 3-20 alphanumeric/underscore, unique
- `password`: Min 6 chars, must contain uppercase, lowercase, number, special char (@$!%\*?&)

---

### 2. Login User

**POST** `/login`

Login with username/email and password.

**Request Body:**

```json
{
  "username": "johndoe",
  "password": "SecurePass@123"
}
```

**Response (Success 200):**

```json
{
  "success": true,
  "message": "Login successful",
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "fullName": "John Doe",
    "email": "john@example.com",
    "phoneNumber": "0123456789",
    "username": "johndoe",
    "avatar": "https://example.com/avatar.jpg",
    "createdAt": "2024-01-18T10:30:00Z",
    "updatedAt": "2024-01-18T10:30:00Z"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Response (Error 401):**

```json
{
  "success": false,
  "message": "Tài khoản hoặc mật khẩu không chính xác"
}
```

---

### 3. Google OAuth Login

**POST** `/google-login`

Login using Google OAuth token.

**Request Body:**

```json
{
  "googleToken": "eyJhbGciOiJSUzI1NiIsImtpZCI6IjEifQ..."
}
```

**Response (Success 200):**

```json
{
  "success": true,
  "message": "Google login successful",
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "fullName": "John Doe",
    "email": "john@example.com",
    "phoneNumber": null,
    "username": "john.doe.google",
    "avatar": "https://lh3.googleusercontent.com/...",
    "createdAt": "2024-01-18T10:30:00Z",
    "updatedAt": "2024-01-18T10:30:00Z"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

---

### 4. Refresh Token

**POST** `/refresh-token`

Refresh access token using refresh token.

**Request Body:**

```json
{
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Response (Success 200):**

```json
{
  "success": true,
  "message": "Token refreshed",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

---

### 5. Logout

**POST** `/logout`

Logout current user (invalidate tokens).

**Headers:**

```
Authorization: Bearer <auth_token>
```

**Response (Success 200):**

```json
{
  "success": true,
  "message": "Logout successful"
}
```

---

### 6. Get Current User Profile

**GET** `/profile`

Fetch current authenticated user profile.

**Headers:**

```
Authorization: Bearer <auth_token>
```

**Response (Success 200):**

```json
{
  "success": true,
  "message": "User profile retrieved",
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "fullName": "John Doe",
    "email": "john@example.com",
    "phoneNumber": "0123456789",
    "username": "johndoe",
    "avatar": "https://example.com/avatar.jpg",
    "createdAt": "2024-01-18T10:30:00Z",
    "updatedAt": "2024-01-18T10:30:00Z"
  }
}
```

---

## Error Codes

| Code | Message               | Description                          |
| ---- | --------------------- | ------------------------------------ |
| 400  | Bad Request           | Invalid request data                 |
| 401  | Unauthorized          | Invalid credentials or expired token |
| 409  | Conflict              | Email or username already exists     |
| 422  | Unprocessable Entity  | Validation error                     |
| 500  | Internal Server Error | Server error                         |

---

## Token Storage & Management

### Token Types

1. **Access Token (JWT)**
   - Expires: 24 hours
   - Used for API requests
   - Stored in `localStorage` as `auth_token`

2. **Refresh Token (JWT)**
   - Expires: 7 days
   - Used to refresh access token
   - Stored in `localStorage` as `refresh_token`

### Implementation Example

```typescript
// Login and get tokens
authService.login(credentials).subscribe((response) => {
  // Tokens auto-stored in localStorage
  // User auto-set in BehaviorSubject
  // Redirect to dashboard
});

// Use token for authenticated requests
const token = authService.getToken(); // 'eyJ...'
// Add to request: Authorization: Bearer eyJ...

// Logout
authService.logout(); // Clears all stored data
```

---

## Security Considerations

1. **HTTPS Only**: Always use HTTPS in production
2. **CORS**: Configure CORS properly for cross-origin requests
3. **Token Validation**: Validate tokens server-side
4. **Password Hashing**: Use bcrypt or similar for password storage
5. **Rate Limiting**: Implement rate limiting on auth endpoints
6. **CSRF Protection**: Use CSRF tokens for state-changing operations
7. **Input Validation**: Validate all inputs server-side
8. **Error Messages**: Don't expose sensitive info in error messages

---

## Environment Variables

Create a `.env` file in your Angular app or update the service:

```typescript
// auth.service.ts
private apiUrl = environment.apiBaseUrl + '/api/auth';
```

```typescript
// environment.ts
export const environment = {
  production: false,
  apiBaseUrl: "http://localhost:3000",
};

// environment.prod.ts
export const environment = {
  production: true,
  apiBaseUrl: "https://api.yourdomain.com",
};
```

---

## Testing with cURL

```bash
# Register
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "fullName": "Test User",
    "email": "test@example.com",
    "phoneNumber": "0123456789",
    "username": "testuser",
    "password": "Test@123456"
  }'

# Login
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser",
    "password": "Test@123456"
  }'

# Get Profile (with token)
curl -X GET http://localhost:3000/api/auth/profile \
  -H "Authorization: Bearer <your_token_here>"
```

---

## Notes

- All timestamps are in ISO 8601 format (UTC)
- Phone numbers should be normalized to Vietnamese format
- Email addresses are case-insensitive but stored as provided
- Usernames are case-sensitive
- Passwords are never returned in responses
