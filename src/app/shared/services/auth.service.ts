import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, BehaviorSubject, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { RegisterRequest, LoginRequest, AuthResponse, GoogleLoginRequest, User } from '../../models/auth.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  // API configuration
  private apiUrl = 'http://localhost:3000/api/auth'; // Change to your backend URL
  private tokenKey = 'auth_token';
  private refreshTokenKey = 'refresh_token';
  private userKey = 'current_user';

  // BehaviorSubject for tracking authentication state
  private currentUser$ = new BehaviorSubject<User | null>(this.isBrowser() ? this.loadUserFromStorage() : null);
  public user$ = this.currentUser$.asObservable();

  private isAuthenticated$ = new BehaviorSubject<boolean>(this.isBrowser() ? !!this.getToken() : false);
  public authenticated$ = this.isAuthenticated$.asObservable();

  constructor(private http: HttpClient) {}

  /**
   * Check if running in browser
   */
  private isBrowser(): boolean {
    return typeof localStorage !== 'undefined';
  }

  /**
   * Register new user
   */
  register(data: RegisterRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/register`, data).pipe(
      tap((response) => {
        if (response.success && response.token && response.user) {
          this.setToken(response.token);
          if (response.refreshToken) {
            this.setRefreshToken(response.refreshToken);
          }
          this.setUser(response.user);
          this.isAuthenticated$.next(true);
        }
      }),
      catchError(this.handleError)
    );
  }

  /**
   * Login with username/email and password
   */
  login(data: LoginRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/login`, data).pipe(
      tap((response) => {
        if (response.success && response.token && response.user) {
          this.setToken(response.token);
          if (response.refreshToken) {
            this.setRefreshToken(response.refreshToken);
          }
          this.setUser(response.user);
          this.isAuthenticated$.next(true);
        }
      }),
      catchError(this.handleError)
    );
  }

  /**
   * Login with Google OAuth token
   */
  loginWithGoogle(data: GoogleLoginRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/google-login`, data).pipe(
      tap((response) => {
        if (response.success && response.token && response.user) {
          this.setToken(response.token);
          if (response.refreshToken) {
            this.setRefreshToken(response.refreshToken);
          }
          this.setUser(response.user);
          this.isAuthenticated$.next(true);
        }
      }),
      catchError(this.handleError)
    );
  }

  /**
   * Logout - clear tokens and user data
   */
  logout(): void {
    if (this.isBrowser()) {
      localStorage.removeItem(this.tokenKey);
      localStorage.removeItem(this.refreshTokenKey);
      localStorage.removeItem(this.userKey);
    }
    this.currentUser$.next(null);
    this.isAuthenticated$.next(false);
  }

  /**
   * Get current authentication token
   */
  getToken(): string | null {
    return this.isBrowser() ? localStorage.getItem(this.tokenKey) : null;
  }

  /**
   * Get refresh token
   */
  getRefreshToken(): string | null {
    return this.isBrowser() ? localStorage.getItem(this.refreshTokenKey) : null;
  }

  /**
   * Set authentication token
   */
  private setToken(token: string): void {
    if (this.isBrowser()) {
      localStorage.setItem(this.tokenKey, token);
    }
  }

  /**
   * Set refresh token
   */
  private setRefreshToken(token: string): void {
    if (this.isBrowser()) {
      localStorage.setItem(this.refreshTokenKey, token);
    }
  }

  /**
   * Get current user
   */
  getCurrentUser(): User | null {
    return this.currentUser$.value;
  }

  /**
   * Set current user
   */
  private setUser(user: User): void {
    if (this.isBrowser()) {
      localStorage.setItem(this.userKey, JSON.stringify(user));
    }
    this.currentUser$.next(user);
  }

  /**
   * Load user from localStorage
   */
  private loadUserFromStorage(): User | null {
    if (!this.isBrowser()) return null;
    const userJson = localStorage.getItem(this.userKey);
    return userJson ? JSON.parse(userJson) : null;
  }

  /**
   * Check if user is authenticated
   */
  isAuthenticated(): boolean {
    return !!this.getToken();
  }

  /**
   * Handle HTTP errors
   */
  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'Đã xảy ra lỗi. Vui lòng thử lại.';

    if (error.error instanceof ErrorEvent) {
      // Client-side error
      errorMessage = error.error.message;
    } else {
      // Server-side error
      if (error.error && error.error.message) {
        errorMessage = error.error.message;
      }
    }

    return throwError(() => ({
      message: errorMessage,
      status: error.status,
      error: error.error
    }));
  }
}
