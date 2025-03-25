export interface LoginRequest {
  email: string;
  password: string;
}

export interface TokenResponse {
  access_token: string;
  refresh_token: string;
  user: User;
}

export interface User {
  id: number;
  email: string;
  name: string;
  isAdmin: boolean;
  created_at: string;
  updated_at: string;
} 