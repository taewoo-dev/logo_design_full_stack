import axios from 'axios';
import type { Review, ReviewCreateRequest, ReviewUpdateRequest, ReviewStats } from '../types/review';

interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  size: number;
  pages: number;
}

interface ReviewQueryParams {
  page?: number;
  size?: number;
  sort_by?: 'created_at' | 'rating' | 'working_days';
  sort_order?: 'asc' | 'desc';
  is_visible?: boolean;
}

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';

// 인증 토큰을 가져오는 함수
const getAuthToken = () => {
  return localStorage.getItem('accessToken');
};

// axios 인스턴스 생성
const api = axios.create({
  baseURL: API_URL,
});

// 요청 인터셉터 추가
api.interceptors.request.use((config) => {
  const token = getAuthToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const getReviews = async (params?: ReviewQueryParams): Promise<Review[]> => {
  const response = await api.get('/api/v1/reviews', { params });
  return response.data.items;
};

export const getReview = async (id: string): Promise<Review> => {
  const response = await api.get(`/api/v1/reviews/${id}`);
  return response.data;
};

export const getReviewStats = async (): Promise<ReviewStats> => {
  const response = await api.get('/api/v1/reviews/stats');
  return response.data;
};

export const createReview = async (formData: FormData): Promise<Review> => {
  const response = await api.post('/api/v1/reviews', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

export const updateReview = async (id: string, formData: FormData): Promise<Review> => {
  const response = await api.put(`/api/v1/reviews/${id}`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

export const deleteReview = async (id: string): Promise<void> => {
  await api.delete(`/api/v1/reviews/${id}`);
}; 