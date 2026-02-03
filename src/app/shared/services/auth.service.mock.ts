// import { Injectable } from '@angular/core';
// import { BehaviorSubject, Observable, of, throwError } from 'rxjs';
// import { delay, tap, catchError } from 'rxjs/operators';
// import {
//   RegisterRequest,
//   LoginRequest,
//   GoogleLoginRequest,
//   User,
//   AuthResponse,
//   ErrorResponse,
// } from '../../models/auth.model';

// /**
//  * Mock Authentication Service
//  * Simulates backend API for testing without a real server
//  * 
//  * Features:
//  * - Simulates network delay (500ms)
//  * - Mock database of users
//  * - JWT token generation
//  * - Error responses for validation
//  */
// @Injectable({
//   providedIn: 'root',
// })
// export class AuthServiceMock {
//   // Mock user database
//   private mockUsers: Map<string, { user: User; password: string }> = new Map();

//   // BehaviorSubjects for state management
//   private currentUser = new BehaviorSubject<User | null>(this.isBrowser() ? this.loadUserFromStorage() : null);
//   private isAuthenticatedSubject = new BehaviorSubject<boolean>(this.isBrowser() ? this.hasToken() : false);

//   // Public observables
//   user$ = this.currentUser.asObservable();
//   authenticated$ = this.isAuthenticatedSubject.asObservable();

//   private mockTokenCounter = 0;

//   constructor() {
//     this.initializeMockDatabase();
//   }

//   /**
//    * Initialize mock database with test users
//    */
//   private initializeMockDatabase(): void {
//     // Pre-populated test users
//     const testUsers: { [key: string]: User } = {
//       testuser: {
//         id: '507f1f77bcf86cd799439011',
//         fullName: 'Test User',
//         email: 'test@example.com',
//         phoneNumber: '0123456789',
//         username: 'testuser',
//         avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=testuser',
//         role: 'user',
//         permissions: ['view_profile', 'edit_profile', 'delete_account'],
//         createdAt: new Date('2024-01-01').toISOString(),
//         updatedAt: new Date('2024-01-01').toISOString(),
//       },
//       johndoe: {
//         id: '507f1f77bcf86cd799439012',
//         fullName: 'John Doe',
//         email: 'john@example.com',
//         phoneNumber: '0987654321',
//         username: 'johndoe',
//         avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=johndoe',
//         role: 'admin',
//         permissions: [
//           'view_profile',
//           'edit_profile',
//           'delete_account',
//           'manage_users',
//           'manage_roles',
//           'view_logs',
//           'manage_content',
//         ],
//         createdAt: new Date('2024-01-01').toISOString(),
//         updatedAt: new Date('2024-01-01').toISOString(),
//       },
//     };

//     // Add to mock database
//     testUsers['testuser'] && this.mockUsers.set('testuser', { user: testUsers['testuser'], password: 'Test@123' });
//     testUsers['johndoe'] && this.mockUsers.set('johndoe', { user: testUsers['johndoe'], password: 'John@123' });
//   }

//   /**
//    * Register new user (mock)
//    * Simulates: POST /api/auth/register
//    */
//   register(data: RegisterRequest): Observable<AuthResponse> {
//     // Simulate network delay
//     return of({} as AuthResponse).pipe(
//       delay(500),
//       tap(() => {
//         // Check if user already exists
//         if (this.mockUsers.has(data.username)) {
//           throw new Error('Username already exists');
//         }
//         if (Array.from(this.mockUsers.values()).some(u => u.user.email === data.email)) {
//           throw new Error('Email already registered');
//         }

//         // Validate password
//         if (!this.validatePassword(data.password)) {
//           throw new Error('Password must contain uppercase, lowercase, number, and special character');
//         }
//       }),
//       tap(() => {
//         // Create new user
//         const newUser: User = {
//           id: this.generateMockId(),
//           fullName: data.fullName,
//           email: data.email,
//           phoneNumber: data.phoneNumber,
//           username: data.username,
//           avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${data.username}`,
//           role: 'user',  // Default role
//           permissions: ['view_profile', 'edit_profile', 'delete_account'],
//           createdAt: new Date().toISOString(),
//           updatedAt: new Date().toISOString(),
//         };

//         // Save to mock database
//         this.mockUsers.set(data.username, {
//           user: newUser,
//           password: data.password,
//         });

//         // Set user and tokens
//         this.setUser(newUser);
//         const tokens = this.generateMockTokens(newUser.id);
//         this.setToken(tokens.token);
//         this.setRefreshToken(tokens.refreshToken);
//       }),
//       tap(() => {
//         this.currentUser.next(this.getCurrentUser());
//         this.isAuthenticatedSubject.next(true);
//       }),
//       tap(() => {
//         const user = this.getCurrentUser();
//         return {
//           success: true,
//           message: 'Registration successful',
//           user: user!,
//           token: this.getToken() || '',
//           refreshToken: this.getRefreshToken() || '',
//         };
//       }),
//       catchError((error) => {
//         const errorResponse: ErrorResponse = {
//           success: false,
//           message: error.message || 'Registration failed',
//           errors: { general: error.message },
//         };
//         return throwError(() => errorResponse);
//       })
//     );
//   }

//   /**
//    * Login user (mock)
//    * Simulates: POST /api/auth/login
//    * 
//    * Test credentials:
//    * - username: testuser, password: Test@123
//    * - username: johndoe, password: John@123
//    */
//   login(data: LoginRequest): Observable<AuthResponse> {
//     return of({} as AuthResponse).pipe(
//       delay(500),
//       tap(() => {
//         // Find user
//         const userEntry = this.mockUsers.get(data.username);
        
//         if (!userEntry) {
//           throw new Error('Account or password is incorrect');
//         }

//         // Verify password
//         if (userEntry.password !== data.password) {
//           throw new Error('Account or password is incorrect');
//         }
//       }),
//       tap(() => {
//         const userEntry = this.mockUsers.get(data.username)!;
        
//         // Set tokens
//         const tokens = this.generateMockTokens(userEntry.user.id);
//         this.setToken(tokens.token);
//         this.setRefreshToken(tokens.refreshToken);
//         this.setUser(userEntry.user);
//       }),
//       tap(() => {
//         this.currentUser.next(this.getCurrentUser());
//         this.isAuthenticatedSubject.next(true);
//       }),
//       tap(() => ({
//         success: true,
//         message: 'Login successful',
//         user: this.getCurrentUser()!,
//         token: this.getToken() || '',
//         refreshToken: this.getRefreshToken() || '',
//       })),
//       catchError((error) => {
//         const errorResponse: ErrorResponse = {
//           success: false,
//           message: error.message || 'Login failed',
//         };
//         return throwError(() => errorResponse);
//       })
//     );
//   }

//   /**
//    * Login with Google (mock)
//    */
//   loginWithGoogle(data: GoogleLoginRequest): Observable<AuthResponse> {
//     return of({} as AuthResponse).pipe(
//       delay(1000),
//       tap(() => {
//         // Simulate Google OAuth verification
//         const mockGoogleUser: User = {
//           id: this.generateMockId(),
//           fullName: 'Google User',
//           email: `user_${Date.now()}@gmail.com`,
//           phoneNumber: '',
//           username: `google_${Date.now()}`,
//           avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=googleuser',
//           role: 'user',
//           permissions: ['view_profile', 'edit_profile', 'delete_account'],
//           createdAt: new Date().toISOString(),
//           updatedAt: new Date().toISOString(),
//         };

//         // Save to mock database
//         this.mockUsers.set(mockGoogleUser.username, {
//           user: mockGoogleUser,
//           password: 'google_oauth',
//         });

//         const tokens = this.generateMockTokens(mockGoogleUser.id);
//         this.setToken(tokens.token);
//         this.setRefreshToken(tokens.refreshToken);
//         this.setUser(mockGoogleUser);

//         this.currentUser.next(mockGoogleUser);
//         this.isAuthenticatedSubject.next(true);
//       }),
//       tap(() => ({
//         success: true,
//         message: 'Google login successful',
//         user: this.getCurrentUser()!,
//         token: this.getToken() || '',
//         refreshToken: this.getRefreshToken() || '',
//       })),
//       catchError((error) => {
//         const errorResponse: ErrorResponse = {
//           success: false,
//           message: 'Google login failed',
//         };
//         return throwError(() => errorResponse);
//       })
//     );
//   }

//   /**
//    * Get authentication token
//    */
//   getToken(): string | null {
//     if (!this.isBrowser()) return null;
//     return localStorage.getItem('auth_token');
//   }

//   /**
//    * Get refresh token
//    */
//   getRefreshToken(): string | null {
//     if (!this.isBrowser()) return null;
//     return localStorage.getItem('refresh_token');
//   }

//   /**
//    * Get current user
//    */
//   getCurrentUser(): User | null {
//     if (!this.isBrowser()) return null;
//     const user = localStorage.getItem('current_user');
//     return user ? JSON.parse(user) : null;
//   }

//   /**
//    * Check if user is authenticated
//    */
//   isAuthenticated(): boolean {
//     return !!this.getToken() && !!this.getCurrentUser();
//   }

//   /**
//    * Logout user
//    */
//   logout(): void {
//     localStorage.removeItem('auth_token');
//     localStorage.removeItem('refresh_token');
//     localStorage.removeItem('current_user');
//     this.currentUser.next(null);
//     this.isAuthenticatedSubject.next(false);
//   }

//   /**
//    * Private helper methods
//    */

//   private setToken(token: string): void {
//     if (this.isBrowser()) {
//       localStorage.setItem('auth_token', token);
//     }
//   }

//   private setRefreshToken(refreshToken: string): void {
//     if (this.isBrowser()) {
//       localStorage.setItem('refresh_token', refreshToken);
//     }
//   }

//   private setUser(user: User): void {
//     if (this.isBrowser()) {
//       localStorage.setItem('current_user', JSON.stringify(user));
//     }
//   }

//   /**
//    * Generate mock JWT token (for demo, not a real JWT)
//    */
//   private generateMockTokens(userId: string): { token: string; refreshToken: string } {
//     this.mockTokenCounter++;
//     const timestamp = Date.now();
//     const token = `mock_token_${userId}_${timestamp}_${this.mockTokenCounter}`;
//     const refreshToken = `mock_refresh_${userId}_${timestamp}_${this.mockTokenCounter}`;
//     return { token, refreshToken };
//   }

//   /**
//    * Generate mock MongoDB ObjectId
//    */
//   private generateMockId(): string {
//     return `${Date.now().toString(16)}${Math.random().toString(16).slice(2)}`;
//   }

//   /**
//    * Validate password strength
//    */
//   private validatePassword(password: string): boolean {
//     const hasUppercase = /[A-Z]/.test(password);
//     const hasLowercase = /[a-z]/.test(password);
//     const hasNumber = /[0-9]/.test(password);
//     const hasSpecialChar = /[!@#$%^&*?_+\-=\[\]{}();':"\\|,.<>\/?]/.test(password);

//     return (
//       password.length >= 6 &&
//       hasUppercase &&
//       hasLowercase &&
//       hasNumber &&
//       hasSpecialChar
//     );
//   }

//   /**
//    * Get list of test users for debugging
//    */
//   getTestUsers(): Array<{ username: string; password: string; user: User }> {
//     return Array.from(this.mockUsers.entries()).map(([username, data]) => ({
//       username,
//       password: data.password,
//       user: data.user,
//     }));
//   }

//   /**
//    * Check if running in browser
//    */
//   private isBrowser(): boolean {
//     return typeof localStorage !== 'undefined';
//   }

//   /**
//    * Load user from localStorage
//    */
//   private loadUserFromStorage(): User | null {
//     if (!this.isBrowser()) return null;
//     const user = localStorage.getItem('current_user');
//     return user ? JSON.parse(user) : null;
//   }

//   /**
//    * Check if token exists in localStorage
//    */
//   private hasToken(): boolean {
//     return !!localStorage.getItem('auth_token');
//   }
// }
