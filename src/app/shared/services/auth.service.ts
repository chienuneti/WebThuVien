import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, BehaviorSubject, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { RegisterRequest, LoginRequest, AuthResponse, GoogleLoginRequest, User, ApiResponse, UserProfile } from '../../models/auth.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  // API configuration
  private apiUrl = 'https://localhost:7212/api/Authen'; // Change to your backend URL
  private tokenKey = 'auth_token';
  private refreshTokenKey = 'refresh_token';
  private userKey = 'current_user';

  // BehaviorSubject for tracking authentication state
private currentUser$ = new BehaviorSubject<User | null>(this.isBrowser() ? this.loadUserFromStorage() : null);
public user$ = this.currentUser$.asObservable();
private isAuthenticated$ = new BehaviorSubject<boolean>(this.isBrowser() ? !!this.getToken() : false);
public authenticated$ = this.isAuthenticated$.asObservable();
constructor(private http: HttpClient) { }
private isBrowser(): boolean {
  return typeof localStorage !== 'undefined';
}
login(data: LoginRequest): Observable<ApiResponse<AuthResponse>> {
  return this.http.post<ApiResponse<AuthResponse>>(`${this.apiUrl}/login`, data).pipe(
    tap((response) => {
      if (response.success && response.data) {
        this.setToken(response.data.accessToken);
        const user = this.mapToUser(response.data);
        this.setUser(user);
        this.isAuthenticated$.next(true);
      }
    }),
    catchError(this.handleError)
  );
}
logout(): void {
  if (this.isBrowser()) {
    localStorage.removeItem(this.tokenKey);
    localStorage.removeItem(this.refreshTokenKey);
    localStorage.removeItem(this.userKey);
  }
  this.currentUser$.next(null);
  this.isAuthenticated$.next(false);
}

  getToken(): string | null {
    return this.isBrowser() ? localStorage.getItem(this.tokenKey) : null;
  }
  private setToken(token: string): void {
    console.log("settoketn" + this.isBrowser());
    if (this.isBrowser()) {
      localStorage.setItem(this.tokenKey, token);
    }
  }
  getCurrentUser(): User | null {
    return this.currentUser$.value;
  }

  private setUser(user: User): void {
    if (this.isBrowser()) {
      localStorage.setItem(this.userKey, JSON.stringify(user));
    }
    this.currentUser$.next(user);
  }
  private loadUserFromStorage(): User | null {
    if (!this.isBrowser()) return null;

    try {
      const userJson = localStorage.getItem(this.userKey);
      return userJson && userJson !== 'undefined' && userJson !== 'null'
        ? JSON.parse(userJson)
        : null;
    } catch {
      localStorage.removeItem(this.userKey);
      return null;
    }
  }
  isAuthenticated(): boolean {
    return !!this.getToken();
  }
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
  private mapToUser(data: AuthResponse): User {
  return {
    id: data.userId,
    fullName: data.name,
    email: data.email,
    class: data.class,
    phoneNumber: data.phoneNumber,
    // username: data.email,
  };
}

}

