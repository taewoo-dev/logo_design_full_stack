import client from './client';
import type { Review, ReviewCreateRequest, ReviewUpdateRequest, ReviewStats } from '../types/review';
import type { PaginatedResponse } from '../types/pagination';

interface ReviewQueryParams {
  page?: number;
  size?: number;
  sort_by?: 'created_at' | 'rating' | 'working_days';
  sort_order?: 'asc' | 'desc';
  is_visible?: boolean;
}

export const getReviews = async (params: ReviewQueryParams = {}): Promise<PaginatedResponse<Review>> => {
  const response = await client.get<PaginatedResponse<Review>>('/api/v1/reviews', { params });
  return response.data;
};

export const getReview = async (id: string): Promise<Review> => {
  const response = await client.get<Review>(`/api/v1/reviews/${id}`);
  return response.data;
};

export const createReview = async (data: ReviewCreateRequest): Promise<Review> => {
  const response = await client.post<Review>('/api/v1/reviews', data);
  return response.data;
};

export const updateReview = async (id: string, data: ReviewUpdateRequest): Promise<Review> => {
  const response = await client.put<Review>(`/api/v1/reviews/${id}`, data);
  return response.data;
};

export const deleteReview = async (id: string): Promise<void> => {
  await client.delete(`/api/v1/reviews/${id}`);
};

export const getReviewStats = async (): Promise<ReviewStats> => {
  const response = await client.get<ReviewStats>('/api/v1/reviews/stats');
  return response.data;
}; 