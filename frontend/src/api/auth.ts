import axios from 'axios';
import { LoginRequest, TokenResponse } from '../types/auth';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';

export const login = async (data: LoginRequest): Promise<TokenResponse> => {
  const response = await axios.post<TokenResponse>(`${API_URL}/auth/login`, data);
  return response.data;
};

export const refreshToken = async (refresh_token: string): Promise<TokenResponse> => {
  const response = await axios.post<TokenResponse>(`${API_URL}/auth/refresh`, { refresh_token });
  return response.data;
}; 