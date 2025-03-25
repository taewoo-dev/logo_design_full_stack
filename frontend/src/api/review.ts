import client from './client';
import type { Review, ReviewCreateRequest, ReviewUpdateRequest, ReviewStats } from '../types/review';

export const getReviews = async (): Promise<Review[]> => {
  const response = await client.get<Review[]>('/reviews');
  return response.data;
};

export const getReview = async (id: string): Promise<Review> => {
  const response = await client.get<Review>(`/reviews/${id}`);
  return response.data;
};

export const getReviewStats = async (): Promise<ReviewStats> => {
  const response = await client.get<ReviewStats>('/reviews/stats');
  return response.data;
};

export const createReview = async (data: ReviewCreateRequest): Promise<Review> => {
  const response = await client.post<Review>('/reviews', data);
  return response.data;
};

export const updateReview = async (id: number, data: ReviewUpdateRequest): Promise<Review> => {
  const response = await client.put<Review>(`/reviews/${id}`, data);
  return response.data;
};

export const deleteReview = async (id: number): Promise<void> => {
  await client.delete(`/reviews/${id}`);
}; 