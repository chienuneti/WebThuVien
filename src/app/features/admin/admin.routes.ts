import { Routes } from '@angular/router';

export const ADMIN_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () => import('./pages/admin-dashboard/admin-dashboard.component').then(m => m.AdminDashboardComponent)
  },
  {
    path: 'books',
    loadComponent: () => import('./pages/book-management/book-management.component').then(m => m.BookManagementComponent)
  },
  {
    path: 'users',
    loadComponent: () => import('./pages/user-management/user-management.component').then(m => m.UserManagementComponent)
  },
  {
    path: 'settings',
    loadComponent: () => import('./pages/system-settings/system-settings.component').then(m => m.SystemSettingsComponent)
  },
  {
    path: 'analytics',
    loadComponent: () => import('./pages/analytics/analytics.component').then(m => m.AnalyticsComponent)
  }
];
