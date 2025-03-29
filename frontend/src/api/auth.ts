import client from './client';
import { LoginRequest, TokenResponse } from '../types/auth';

export const login = async (data: LoginRequest): Promise<TokenResponse> => {
  const response = await client.post<TokenResponse>('/api/v1/auth/login', data);
  return response.data;
};

export const refreshToken = async (refresh_token: string): Promise<TokenResponse> => {
  const response = await client.post<TokenResponse>('/api/v1/auth/refresh', { refresh_token });
  return response.data;
}; 