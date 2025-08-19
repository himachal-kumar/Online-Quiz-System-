export interface User {
  id: string;
  username: string;
  email: string;
  role: UserRole;
  avatar?: string;
  createdAt: string;
}

export enum UserRole {
  ADMIN = 'admin',
  USER = 'user'
}

export interface AuthState {
  user: User | null;
  accessToken: string;
  refreshToken: string;
  isAuthenticated: boolean;
  loading: boolean;
}