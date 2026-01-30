# Implementation Guide - Backend Integration

## Overview

Hướng dẫn chi tiết để tích hợp frontend Angular với backend API thực.

---

## Phase 1: Chuẩn Bị (Preparation)

### 1.1 Cập nhật Environment Configuration

**File:** `src/environments/environment.ts` và `environment.prod.ts`

```typescript
// src/environments/environment.ts
export const environment = {
  production: false,
  apiUrl: "http://localhost:3000", // Your backend URL
  apiVersion: "v1",
};

// src/environments/environment.prod.ts
export const environment = {
  production: true,
  apiUrl: "https://api.yourdomain.com",
  apiVersion: "v1",
};
```

### 1.2 Import Environment trong app.config.ts

```typescript
import { environment } from "../environments/environment";

export const appConfig: ApplicationConfig = {
  providers: [
    provideHttpClient(),
    // ... other providers
  ],
};
```

---

## Phase 2: Tạo Real Auth Service

### 2.1 Tạo Real AuthService (thay thế AuthServiceMock)

**File:** `src/app/shared/services/auth.service.ts`

```typescript
import { Injectable } from "@angular/core";
import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { BehaviorSubject, Observable, throwError } from "rxjs";
import { tap, catchError, map } from "rxjs/operators";
import { environment } from "../../../environments/environment";
import { RegisterRequest, LoginRequest, GoogleLoginRequest, User, AuthResponse, ErrorResponse } from "../../models/auth.model";

@Injectable({
  providedIn: "root",
})
export class AuthService {
  private apiUrl = `${environment.apiUrl}/api/auth`;
  private currentUser = new BehaviorSubject<User | null>(null);
  private isAuthenticatedSubject = new BehaviorSubject<boolean>(false);

  user$ = this.currentUser.asObservable();
  authenticated$ = this.isAuthenticatedSubject.asObservable();

  constructor(private http: HttpClient) {
    this.initializeAuth();
  }

  // Initialize authentication from localStorage
  private initializeAuth(): void {
    const token = this.getToken();
    const user = this.getCurrentUser();

    if (token && user) {
      this.currentUser.next(user);
      this.isAuthenticatedSubject.next(true);
    }
  }

  /**
   * Register new user
   * POST /api/auth/register
   */
  register(data: RegisterRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/register`, data).pipe(
      tap((response) => {
        if (response.token) {
          this.setToken(response.token);
          this.setRefreshToken(response.refreshToken);
          this.setUser(response.user);
          this.currentUser.next(response.user);
          this.isAuthenticatedSubject.next(true);
        }
      }),
      catchError(this.handleError),
    );
  }

  /**
   * Login user
   * POST /api/auth/login
   */
  login(data: LoginRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/login`, data).pipe(
      tap((response) => {
        if (response.token) {
          this.setToken(response.token);
          this.setRefreshToken(response.refreshToken);
          this.setUser(response.user);
          this.currentUser.next(response.user);
          this.isAuthenticatedSubject.next(true);
        }
      }),
      catchError(this.handleError),
    );
  }

  /**
   * Login with Google OAuth
   * POST /api/auth/google
   */
  loginWithGoogle(data: GoogleLoginRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/google`, data).pipe(
      tap((response) => {
        if (response.token) {
          this.setToken(response.token);
          this.setRefreshToken(response.refreshToken);
          this.setUser(response.user);
          this.currentUser.next(response.user);
          this.isAuthenticatedSubject.next(true);
        }
      }),
      catchError(this.handleError),
    );
  }

  /**
   * Refresh authentication token
   * POST /api/auth/refresh
   */
  refreshToken(): Observable<{ token: string; refreshToken: string }> {
    const refreshToken = this.getRefreshToken();
    return this.http.post<{ token: string; refreshToken: string }>(`${this.apiUrl}/refresh`, { refreshToken }).pipe(
      tap((response) => {
        this.setToken(response.token);
        this.setRefreshToken(response.refreshToken);
      }),
      catchError(this.handleError),
    );
  }

  /**
   * Get current user info
   * GET /api/auth/me
   */
  getCurrentUserInfo(): Observable<{ user: User }> {
    return this.http.get<{ user: User }>(`${this.apiUrl}/me`).pipe(
      tap((response) => {
        this.setUser(response.user);
        this.currentUser.next(response.user);
      }),
      catchError(this.handleError),
    );
  }

  /**
   * Update user profile
   * PUT /api/auth/profile
   */
  updateProfile(data: Partial<User>): Observable<{ user: User }> {
    return this.http.put<{ user: User }>(`${this.apiUrl}/profile`, data).pipe(
      tap((response) => {
        this.setUser(response.user);
        this.currentUser.next(response.user);
      }),
      catchError(this.handleError),
    );
  }

  /**
   * Change password
   * POST /api/auth/change-password
   */
  changePassword(data: { currentPassword: string; newPassword: string; confirmPassword: string }): Observable<{ message: string }> {
    return this.http.post<{ message: string }>(`${this.apiUrl}/change-password`, data).pipe(catchError(this.handleError));
  }

  /**
   * Request password reset
   * POST /api/auth/forgot-password
   */
  forgotPassword(email: string): Observable<{ message: string }> {
    return this.http.post<{ message: string }>(`${this.apiUrl}/forgot-password`, { email }).pipe(catchError(this.handleError));
  }

  /**
   * Reset password with token
   * POST /api/auth/reset-password
   */
  resetPassword(data: { token: string; newPassword: string; confirmPassword: string }): Observable<{ message: string }> {
    return this.http.post<{ message: string }>(`${this.apiUrl}/reset-password`, data).pipe(catchError(this.handleError));
  }

  /**
   * Logout user
   * POST /api/auth/logout
   */
  logout(): Observable<{ message: string }> {
    return this.http.post<{ message: string }>(`${this.apiUrl}/logout`, {}).pipe(
      tap(() => {
        this.clearAuth();
      }),
      catchError(() => {
        // Clear auth even if logout request fails
        this.clearAuth();
        return throwError(() => new Error("Logout failed"));
      }),
    );
  }

  // Token management
  getToken(): string | null {
    return localStorage.getItem("auth_token");
  }

  getRefreshToken(): string | null {
    return localStorage.getItem("refresh_token");
  }

  getCurrentUser(): User | null {
    const user = localStorage.getItem("current_user");
    return user ? JSON.parse(user) : null;
  }

  isAuthenticated(): boolean {
    return !!this.getToken() && !!this.getCurrentUser();
  }

  private setToken(token: string): void {
    localStorage.setItem("auth_token", token);
  }

  private setRefreshToken(refreshToken: string): void {
    localStorage.setItem("refresh_token", refreshToken);
  }

  private setUser(user: User): void {
    localStorage.setItem("current_user", JSON.stringify(user));
  }

  private clearAuth(): void {
    localStorage.removeItem("auth_token");
    localStorage.removeItem("refresh_token");
    localStorage.removeItem("current_user");
    this.currentUser.next(null);
    this.isAuthenticatedSubject.next(false);
  }

  private handleError(error: HttpErrorResponse) {
    let errorMessage = "An error occurred";

    if (error.error instanceof ErrorEvent) {
      // Client-side error
      errorMessage = error.error.message;
    } else {
      // Server-side error
      errorMessage = error.error?.message || error.statusText;
    }

    return throwError(() => ({
      success: false,
      message: errorMessage,
      statusCode: error.status,
    }));
  }
}
```

### 2.2 Cập nhật app.config.ts

```typescript
import { ApplicationConfig, importProvidersFrom } from "@angular/core";
import { provideRouter } from "@angular/router";
import { provideHttpClient, withInterceptors } from "@angular/common/http";
import { provideClientHydration, withEventReplay } from "@angular/platform-browser";

import { routes } from "./app.routes";
import { authInterceptor } from "./shared/interceptors/auth.interceptor";

export const appConfig: ApplicationConfig = {
  providers: [provideRouter(routes), provideHttpClient(withInterceptors([authInterceptor])), provideClientHydration(withEventReplay())],
};
```

---

## Phase 3: Tạo Interceptor

### 3.1 Auth Interceptor

**File:** `src/app/shared/interceptors/auth.interceptor.ts`

```typescript
import { HttpInterceptorFn, HttpRequest, HttpHandlerFn, HttpEvent } from "@angular/common/http";
import { Observable } from "rxjs";
import { inject } from "@angular/core";
import { AuthService } from "../services/auth.service";

export const authInterceptor: HttpInterceptorFn = (req: HttpRequest<unknown>, next: HttpHandlerFn): Observable<HttpEvent<unknown>> => {
  const authService = inject(AuthService);
  const token = authService.getToken();

  // Add token to headers if available
  if (token && !req.url.includes("/login") && !req.url.includes("/register")) {
    req = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

  return next(req);
};
```

---

## Phase 4: Tạo Auth Guard

### 4.1 Auth Guard

**File:** `src/app/shared/guards/auth.guard.ts`

```typescript
import { Injectable } from "@angular/core";
import { Router, CanActivateFn, ActivatedRouteSnapshot } from "@angular/router";
import { AuthService } from "../services/auth.service";
import { inject } from "@angular/core";

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.isAuthenticated()) {
    return true;
  }

  // Redirect to login if not authenticated
  router.navigate(["/dang-nhap"], {
    queryParams: { returnUrl: state.url },
  });
  return false;
};
```

### 4.2 Cập nhật Routes với Guard

```typescript
// src/app/app.routes.ts
import { Routes } from "@angular/router";
import { authGuard } from "./shared/guards/auth.guard";
import { ProfileComponent } from "./components/profile/profile.component";

export const routes: Routes = [
  // ... other routes
  {
    path: "profile",
    component: ProfileComponent,
    canActivate: [authGuard],
  },
];
```

---

## Phase 5: Disable Mock Service

### 5.1 Update app.config.ts Providers

```typescript
// Remove AuthServiceMock from providers or comment it out
// Use real AuthService instead

export const appConfig: ApplicationConfig = {
  providers: [
    // ... other providers
    // Uncomment one of these based on your needs:
    // For development with real backend:
    // { provide: AuthService, useClass: AuthService }
    // For testing with mock:
    // { provide: AuthService, useClass: AuthServiceMock }
  ],
};
```

---

## Phase 6: Error Handling & Loading States

### 6.1 Add Loading State to Components

```typescript
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;
  isLoading = false;
  errorMessage = "";

  constructor(
    private authService: AuthService,
    private router: Router,
  ) {}

  onSubmit(): void {
    if (this.loginForm.invalid) return;

    this.isLoading = true;
    this.errorMessage = "";

    this.authService.login(this.loginForm.value).subscribe({
      next: (response) => {
        this.isLoading = false;
        this.router.navigate(["/"]);
      },
      error: (error) => {
        this.isLoading = false;
        this.errorMessage = error.message || "Login failed. Please try again.";
      },
    });
  }
}
```

---

## Phase 7: CORS Configuration (Backend)

### 7.1 Node.js/Express Backend

```javascript
// server.js
const cors = require("cors");
const express = require("express");
const app = express();

// Enable CORS
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:4200",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);

// Other middleware
app.use(express.json());

// Routes
app.use("/api/auth", require("./routes/auth"));
```

### 7.2 ASP.NET Backend

```csharp
// Startup.cs or Program.cs
public void ConfigureServices(IServiceCollection services)
{
    services.AddCors(options =>
    {
        options.AddPolicy("AllowAngularApp", builder =>
        {
            builder
                .WithOrigins("http://localhost:4200")
                .AllowAnyMethod()
                .AllowAnyHeader()
                .AllowCredentials();
        });
    });
}

public void Configure(IApplicationBuilder app)
{
    app.UseCors("AllowAngularApp");
    // Other middleware
}
```

---

## Checklist for Backend Integration

- [ ] Create `environment.ts` and `environment.prod.ts`
- [ ] Create real `AuthService` (replace mock)
- [ ] Create `auth.interceptor.ts`
- [ ] Create `auth.guard.ts`
- [ ] Update routes with guards
- [ ] Update `app.config.ts` providers
- [ ] Add loading states to all forms
- [ ] Add error message display
- [ ] Configure CORS on backend
- [ ] Test all API endpoints
- [ ] Test token refresh logic
- [ ] Test logout functionality
- [ ] Test unauthorized access handling
- [ ] Test network error handling

---

## Testing the Integration

### 1. Test Registration

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

### 2. Test Login

```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser",
    "password": "Test@123"
  }'
```

### 3. Test Protected Endpoint

```bash
curl -X GET http://localhost:3000/api/auth/me \
  -H "Authorization: Bearer {token}"
```

---

## Troubleshooting

### Common Issues

**1. CORS Error**

- Check backend CORS configuration
- Ensure correct origin URL
- Check request headers

**2. 401 Unauthorized**

- Verify token is being sent
- Check token expiration
- Implement token refresh

**3. 404 Not Found**

- Verify API endpoint URL
- Check backend routes
- Review API documentation

**4. 500 Internal Server Error**

- Check backend logs
- Verify request body format
- Test with Postman/cURL

---

## Security Best Practices

1. **Store tokens securely**
   - Use httpOnly cookies instead of localStorage
   - Set Secure flag on cookies

2. **Implement token refresh**
   - Refresh before expiration
   - Handle refresh token rotation

3. **Validate input on frontend**
   - Never trust client-side validation alone
   - Always validate on backend

4. **Use HTTPS in production**
   - Never send tokens over HTTP
   - Use secure connections only

5. **Implement rate limiting**
   - Prevent brute force attacks
   - Rate limit login attempts

---

## Support

For more information, see:

- [API_ENDPOINTS.md](./API_ENDPOINTS.md)
- [AUTHENTICATION.md](./AUTHENTICATION.md)
- [Angular HttpClient Documentation](https://angular.io/guide/http)
