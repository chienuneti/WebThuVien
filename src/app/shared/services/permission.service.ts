import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';
import { UserRole, Permission, ROLE_PERMISSIONS } from '../../models/auth.model';

/**
 * Permission and role checking service
 */
@Injectable({
  providedIn: 'root',
})
export class PermissionService {
  constructor(private authService: AuthService) {}

  /**
   * Check if user has a specific role
   */
  hasRole(role: UserRole): boolean {
    const user = this.authService.getCurrentUser();
    return user ? user.role === role : false;
  }

  /**
   * Check if user has any of the specified roles
   */
  hasAnyRole(roles: UserRole[]): boolean {
    const user = this.authService.getCurrentUser();
    return user?.role ? roles.includes(user.role) : false;
  }

  /**
   * Check if user has all of the specified roles
   */
  hasAllRoles(roles: UserRole[]): boolean {
    const user = this.authService.getCurrentUser();
    return user?.role ? roles.includes(user.role) : false;
  }

  /**
   * Check if user has a specific permission
   */
  hasPermission(permission: Permission): boolean {
    const user = this.authService.getCurrentUser();
    
    if (!user) {
      return false;
    }

    // Check direct permissions
    if (user.permissions && user.permissions.includes(permission)) {
      return true;
    }

    // Check role-based permissions
    if (user.role) {
      const rolePermissions = ROLE_PERMISSIONS[user.role] ?? [];
      return rolePermissions.includes(permission);
    }

    return false;
  }

  /**
   * Check if user has any of the specified permissions
   */
  hasAnyPermission(permissions: Permission[]): boolean {
    return permissions.some((permission) => this.hasPermission(permission));
  }

  /**
   * Check if user has all of the specified permissions
   */
  hasAllPermissions(permissions: Permission[]): boolean {
    return permissions.every((permission) => this.hasPermission(permission));
  }

  /**
   * Get user role label
   */
  getRoleLabel(role: UserRole): string {
    const labels: Record<UserRole, string> = {
      admin: 'Quản Trị Viên',
      moderator: 'Người Điều Hành',
      user: 'Người Dùng',
    };
    return labels[role] ?? 'Unknown';
  }

  /**
   * Get user role color
   */
  getRoleColor(role: UserRole): string {
    const colors: Record<UserRole, string> = {
      admin: '#dc3545',     // red
      moderator: '#ff9800',  // orange
      user: '#2196F3',      // blue
    };
    return colors[role] ?? '#999';
  }

  /**
   * Check if user is admin
   */
  isAdmin(): boolean {
    return this.hasRole('admin');
  }

  /**
   * Check if user is moderator or admin
   */
  isModerator(): boolean {
    return this.hasAnyRole(['admin', 'moderator']);
  }

  /**
   * Check if user is regular user (not admin/moderator)
   */
  isRegularUser(): boolean {
    return this.hasRole('user');
  }
}
