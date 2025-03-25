export * from './portfolio';

export interface LoginRequest {
  email: string;
  password: string;
}

export interface TokenResponse {
  access_token: string;
  refresh_token: string;
}

export interface Option<T = string> {
  value: T;
  label: string;
} 