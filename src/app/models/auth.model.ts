// User registration data
export interface RegisterRequest {
  fullName: string;
  email: string;
  phoneNumber: string;
  username: string;
  password: string;
}

// User login data
export interface LoginRequest {
  email: string;
  password: string;
}

// Google OAuth login
export interface GoogleLoginRequest {
  googleToken: string;
}

// User roles
export type UserRole = 'admin' | 'user' | 'moderator';

// Permissions
export type Permission = 
  | 'view_profile'
  | 'edit_profile'
  | 'delete_account'
  | 'manage_users'
  | 'manage_roles'
  | 'view_logs'
  | 'manage_content';

// User response from server
export interface User {
  id: string;
  fullName: string;
  email: string;
  class: string;
  phoneNumber: string;
  // username: string;
  avatar?: string;
  role?: UserRole;  // admin | user | moderator
  permissions?: Permission[];
  isEmailVerified?: boolean;
  isPhoneVerified?: boolean;
  createdAt?: string;
  updatedAt?: string;
}
export interface UserProfile {
  userId: string;
  name: string;
  email: string;
  class: string;
  phoneNumber: string;
  accessToken: string;
}
export interface ApiResponse<T>
{
  success :boolean,
  message:string,
  data: T
}
// Authentication response
export interface AuthResponse {
  accessToken: string;
  userId: string;
  name: string;
  email: string;
  class: string;
  phoneNumber: string;
}


// Error response
export interface ErrorResponse {
  success: false;
  message: string;
  errors?: Record<string, string[]>;
}

// Role permissions mapping
export const ROLE_PERMISSIONS: Record<UserRole, Permission[]> = {
  admin: [
    'view_profile',
    'edit_profile',
    'delete_account',
    'manage_users',
    'manage_roles',
    'view_logs',
    'manage_content',
  ],
  moderator: [
    'view_profile',
    'edit_profile',
    'manage_users',
    'view_logs',
    'manage_content',
  ],
  user: [
    'view_profile',
    'edit_profile',
    'delete_account',
  ],
};

// Role display labels
export const ROLE_LABELS: Record<UserRole, string> = {
  admin: 'Quản Trị Viên',
  moderator: 'Người Điều Hành',
  user: 'Người Dùng',
};

// Role badge colors
export const ROLE_COLORS: Record<UserRole, string> = {
  admin: '#dc3545',    // red
  moderator: '#ff9800', // orange
  user: '#2196F3',     // blue
};
