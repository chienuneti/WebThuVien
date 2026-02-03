export interface RegisterRequest {
  fullName: string;
  email: string;
  phoneNumber: string;
  username: string;
  password: string;
}

export interface LoginRequest {
  username: string;
  password: string;
}

export interface GoogleLoginRequest {
  googleToken: string;
}

export type UserRole = 'admin' | 'user' | 'moderator';

export type Permission = 
  | 'view_profile'
  | 'edit_profile'
  | 'delete_account'
  | 'manage_users'
  | 'manage_roles'
  | 'view_logs'
  | 'manage_content';

export interface User {
  id: string;
  fullName: string;
  email: string;
  phoneNumber: string;
  username: string;
  avatar?: string;
  role?: UserRole;  
  permissions?: Permission[];
  isEmailVerified?: boolean;
  isPhoneVerified?: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  user?: User;
  token?: string;
  refreshToken?: string;
}

export interface ErrorResponse {
  success: false;
  message: string;
  errors?: Record<string, string[]>;
}

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

export const ROLE_LABELS: Record<UserRole, string> = {
  admin: 'Quản Trị Viên',
  moderator: 'Người Điều Hành',
  user: 'Người Dùng',
};

export const ROLE_COLORS: Record<UserRole, string> = {
  admin: '#dc3545',    
  moderator: '#ff9800',
  user: '#2196F3',     
};
