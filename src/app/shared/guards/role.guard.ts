import { Injectable } from '@angular/core';
import { Router, CanActivateFn, ActivatedRouteSnapshot } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { inject } from '@angular/core';
import { UserRole } from '../../models/auth.model';

/**
 * Role-based access control guard
 * Usage: { path: 'admin', component: AdminComponent, canActivate: [roleGuard('admin')] }
 */
export const roleGuard = (requiredRole: UserRole): CanActivateFn => {
  return (route: ActivatedRouteSnapshot, state) => {
    const authService = inject(AuthService);
    const router = inject(Router);

    const user = authService.getCurrentUser();

    if (!user) {
      router.navigate(['/dang-nhap'], { queryParams: { returnUrl: state.url } });
      return false;
    }

    if (!user.role || user.role !== requiredRole) {
      router.navigate(['/'], { queryParams: { error: 'unauthorized' } });
      return false;
    }

    return true;
  };
};

/**
 * Permission-based access control guard
 * Usage: { path: 'admin', component: AdminComponent, canActivate: [permissionGuard('manage_users')] }
 */
export const permissionGuard = (requiredPermission: string): CanActivateFn => {
  return (route: ActivatedRouteSnapshot, state) => {
    const authService = inject(AuthService);
    const router = inject(Router);

    const user = authService.getCurrentUser();

    if (!user) {
      router.navigate(['/dang-nhap'], { queryParams: { returnUrl: state.url } });
      return false;
    }

    if (!user.permissions || !user.permissions.includes(requiredPermission as any)) {
      router.navigate(['/'], { queryParams: { error: 'forbidden' } });
      return false;
    }

    return true;
  };
};

/**
 * Multiple roles guard
 * Usage: { path: 'admin', component: AdminComponent, canActivate: [multiRoleGuard(['admin', 'moderator'])] }
 */
export const multiRoleGuard = (requiredRoles: UserRole[]): CanActivateFn => {
  return (route: ActivatedRouteSnapshot, state) => {
    const authService = inject(AuthService);
    const router = inject(Router);

    const user = authService.getCurrentUser();

    if (!user) {
      router.navigate(['/dang-nhap'], { queryParams: { returnUrl: state.url } });
      return false;
    }

    if (!user.role || !requiredRoles.includes(user.role)) {
      router.navigate(['/'], { queryParams: { error: 'unauthorized' } });
      return false;
    }

    return true;
  };
};
