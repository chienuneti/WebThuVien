# Authentication System Implementation

## Overview

A complete authentication system has been implemented with registration and login forms, validation, API integration, and token management.

## What's New

### 1. **Components** ✅

- **RegisterComponent** (`src/app/components/register/`)
  - Full registration form with fields: fullName, email, phoneNumber, username, password
  - Real-time validation with error messages
  - Password visibility toggle
  - Google OAuth integration (placeholder)
  - Responsive design with gradient styling

- **LoginComponent** (`src/app/components/login/`)
  - Login form with username/email and password
  - "Remember me" functionality
  - Password visibility toggle
  - Links to register and forgot password pages
  - Google OAuth integration (placeholder)

### 2. **Services** ✅

- **AuthService** (`src/app/shared/services/auth.service.ts`)
  - `register(data: RegisterRequest)` - User registration
  - `login(data: LoginRequest)` - User login
  - `loginWithGoogle(data: GoogleLoginRequest)` - Google OAuth
  - `logout()` - Clear all auth data
  - `getToken()` - Retrieve JWT token
  - `isAuthenticated()` - Check auth status
  - Token management with localStorage
  - BehaviorSubjects for reactive state (`user$`, `authenticated$`)
  - Error handling with Vietnamese localized messages

### 3. **Models & Interfaces** ✅

- **auth.model.ts** with:
  - `RegisterRequest` - Registration payload
  - `LoginRequest` - Login credentials
  - `GoogleLoginRequest` - Google OAuth token
  - `User` - User profile data
  - `AuthResponse` - API response structure
  - `ErrorResponse` - Error response structure

### 4. **Routing** ✅

- `/dang-ki` → RegisterComponent
- `/dang-nhap` → LoginComponent

### 5. **Forms & Validation** ✅

**Registration Form Validators:**

- Full Name: Required, 3-100 characters
- Email: Required, valid email format, unique (server-side)
- Phone: Required, Vietnamese format (0xxxxxxxxx or +84xxxxxxxxx)
- Username: Required, 3-20 alphanumeric/underscore, unique (server-side)
- Password: Required, min 6 chars, must contain uppercase, lowercase, number, special char (@$!%\*?&)
- Confirm Password: Must match password

**Login Form Validators:**

- Username: Required
- Password: Required, min 6 characters

### 6. **Token Management** ✅

- **Access Token**: JWT stored in localStorage as `auth_token` (24h expiry)
- **Refresh Token**: JWT stored in localStorage as `refresh_token` (7d expiry)
- **User Data**: Cached in localStorage as `current_user`
- Automatic token retrieval and clearing on logout

### 7. **API Documentation** ✅

- **API_DOCUMENTATION.md**: Complete API spec with:
  - All endpoints (/register, /login, /google-login, /refresh-token, /logout, /profile)
  - Request/response examples
  - Error codes and messages
  - Token management details
  - cURL examples for testing

### 8. **Backend Implementation Guide** ✅

- **BACKEND_SETUP.md**: Step-by-step guide for Node.js/Express backend
  - Database schema (User model)
  - Authentication routes with validation
  - JWT token generation
  - Password hashing with bcryptjs
  - Middleware setup
  - Google OAuth example

### 9. **Testing** ✅

- RegisterComponent.spec.ts with tests for:
  - Form initialization
  - Email validation
  - Password strength validation
  - Phone number format validation
  - Password confirmation matching
  - Form disable state

- LoginComponent.spec.ts with tests for:
  - Component creation
  - Form validation
  - Password visibility toggle
  - Remember me functionality

- AuthService.spec.ts with tests for:
  - User registration
  - User login
  - Token storage
  - Token retrieval
  - Logout functionality
  - Authentication status checking

## Architecture

```
src/app/
├── components/
│   ├── register/
│   │   ├── register.component.ts          (Component logic)
│   │   ├── register.component.html        (Form template)
│   │   ├── register.component.css         (Styling)
│   │   └── register.component.spec.ts     (Tests)
│   └── login/
│       ├── login.component.ts
│       ├── login.component.html
│       ├── login.component.css
│       └── login.component.spec.ts
├── models/
│   └── auth.model.ts                     (Interfaces & types)
├── shared/
│   └── services/
│       ├── auth.service.ts               (API & token management)
│       └── auth.service.spec.ts          (Service tests)
├── app.routes.ts                         (Register routes)
├── app.config.ts                         (Added HttpClient provider)
└── app.component.ts
```

## Configuration

### 1. Update API Base URL

**File: `src/app/shared/services/auth.service.ts`**

Change the `apiUrl`:

```typescript
private apiUrl = 'http://localhost:3000/api/auth'; // Change to your backend
```

Or use environment files:

```typescript
import { environment } from '../../../environments/environment';
private apiUrl = environment.apiBaseUrl + '/api/auth';
```

### 2. Enable HttpClient

Already added to `src/app/app.config.ts`:

```typescript
import { provideHttpClient } from "@angular/common/http";

export const appConfig: ApplicationConfig = {
  providers: [
    // ... other providers
    provideHttpClient(),
  ],
};
```

## Usage Examples

### Register a User

```typescript
// In component
this.authService
  .register({
    fullName: "John Doe",
    email: "john@example.com",
    phoneNumber: "0123456789",
    username: "johndoe",
    password: "SecurePass@123",
  })
  .subscribe({
    next: (response) => {
      if (response.success) {
        // Redirect to home
        this.router.navigate(["/"]);
      }
    },
    error: (error) => {
      // Handle error
      console.error(error.message);
    },
  });
```

### Check Authentication

```typescript
if (this.authService.isAuthenticated()) {
  // User is logged in
  const user = this.authService.getCurrentUser();
  const token = this.authService.getToken();
}
```

### Listen to Auth State Changes

```typescript
this.authService.authenticated$.subscribe((isAuth) => {
  if (isAuth) {
    // Show authenticated UI
  }
});

this.authService.user$.subscribe((user) => {
  // Update user info
});
```

### Logout

```typescript
this.authService.logout();
```

## Styling

Both register and login components use:

- **Gradient background**: Purple/blue gradient (mobile-responsive)
- **Card layout**: Centered white card with shadow
- **Form styling**: Modern inputs with validation states
- **Error/Success messages**: Color-coded alerts
- **Responsive design**: Works on desktop and mobile

### Color Scheme

- Primary: `#667eea` (blue)
- Secondary: `#764ba2` (purple)
- Error: `#e74c3c` (red)
- Success: `#3c3` (green)
- Background: `#fafafa` (light gray)

## Testing

Run tests with:

```bash
npm test
```

Run specific test file:

```bash
npm test -- --include='**/auth.service.spec.ts'
```

Generate coverage:

```bash
npm test -- --code-coverage
```

## Next Steps

### 1. Implement Backend

Follow `BACKEND_SETUP.md` to create Node.js/Express API

### 2. Add Google OAuth

- Register app on Google Cloud Console
- Get Client ID
- Install `@react-oauth/google` or similar library
- Implement Google login in `loginWithGoogle()` method

### 3. Add Password Reset

- Create `/forgot-password` route
- Add password reset email flow
- Update auth service with `resetPassword()` method

### 4. Add Email Verification

- Send verification email on registration
- Add email verification endpoint
- Store verification status in User model

### 5. Add Auth Guards

Create route guards to protect pages:

```typescript
// auth.guard.ts
import { Injectable } from "@angular/core";
import { CanActivate, Router } from "@angular/router";
import { AuthService } from "./services/auth.service";

@Injectable({ providedIn: "root" })
export class AuthGuard implements CanActivate {
  constructor(
    private auth: AuthService,
    private router: Router,
  ) {}

  canActivate(): boolean {
    if (this.auth.isAuthenticated()) {
      return true;
    }
    this.router.navigate(["/dang-nhap"]);
    return false;
  }
}

// Use in routes:
// { path: 'dashboard', component: DashboardComponent, canActivate: [AuthGuard] }
```

### 6. Add Interceptor for Token

```typescript
// auth.interceptor.ts
import { Injectable } from "@angular/core";
import { HttpInterceptor, HttpRequest, HttpHandler } from "@angular/common/http";
import { AuthService } from "./services/auth.service";

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private auth: AuthService) {}

  intercept(req: HttpRequest<any>, next: HttpHandler) {
    const token = this.auth.getToken();
    if (token) {
      req = req.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`,
        },
      });
    }
    return next.handle(req);
  }
}

// Add to app.config.ts:
// import { HTTP_INTERCEPTORS } from '@angular/common/http';
// providers: [
//   { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true }
// ]
```

## API Endpoints Reference

See `API_DOCUMENTATION.md` for complete API documentation

- **POST** `/api/auth/register` - Register new user
- **POST** `/api/auth/login` - Login user
- **POST** `/api/auth/google-login` - Google OAuth login
- **POST** `/api/auth/refresh-token` - Refresh access token
- **POST** `/api/auth/logout` - Logout user
- **GET** `/api/auth/profile` - Get user profile (requires token)

## Security Notes

⚠️ **Important for Production:**

1. **HTTPS Only**: Always use HTTPS in production
2. **Secure Cookies**: Consider using httpOnly cookies instead of localStorage
3. **CORS**: Configure CORS properly on backend
4. **Rate Limiting**: Implement rate limiting on auth endpoints
5. **Input Validation**: Validate all inputs both client and server-side
6. **Password Hashing**: Use bcrypt or similar for password storage
7. **Token Expiry**: Implement proper token refresh flow
8. **CSRF Protection**: Use CSRF tokens for state-changing operations

## Troubleshooting

### Issue: "Cannot find module" error

**Solution**: Ensure all files are created in correct paths:

- Models: `src/app/models/`
- Services: `src/app/shared/services/`
- Components: `src/app/components/`

### Issue: HttpClient not injected

**Solution**: Ensure `provideHttpClient()` is added to `app.config.ts`

### Issue: Validation not showing in template

**Solution**: Check that `[class.is-invalid]="isFieldInvalid('fieldName')"` is used

### Issue: CORS error from API

**Solution**: Update backend CORS configuration and ensure API URL is correct

## Support

For API specifications: See `API_DOCUMENTATION.md`
For backend implementation: See `BACKEND_SETUP.md`
For AI agent guidance: See `.github/copilot-instructions.md`
