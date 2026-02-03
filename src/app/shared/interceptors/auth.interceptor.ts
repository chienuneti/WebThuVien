import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Router } from '@angular/router';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private router: Router) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    // Lấy token từ localStorage (Key phải khớp với lúc login lưu vào)
    const token = localStorage.getItem('access_token');

    // Clone request và thêm header Authorization
    if (token) {
      request = request.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`
        }
      });
    }

    return next.handle(request).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status === 401) {
          // Xử lý khi token hết hạn
          localStorage.removeItem('access_token');
          localStorage.removeItem('user_info');
          
          const currentUrl = this.router.url;
          if (currentUrl && !currentUrl.includes('/login')) {
            localStorage.setItem('returnUrl', currentUrl);
          }
          
          this.router.navigate(['/login']);
        }
        return throwError(() => error);
      })
    );
  }
}