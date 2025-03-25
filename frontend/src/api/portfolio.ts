import client from './client';
import type { Portfolio, PortfolioCreateRequest, PortfolioUpdateRequest, PaginatedResponse } from '../types/portfolio';
import { PortfolioCategory, PortfolioVisibility } from '../types';

export const getPortfolios = async (page: number = 1, per_page: number = 10): Promise<PaginatedResponse<Portfolio>> => {
  const response = await client.get<PaginatedResponse<Portfolio>>('/api/v1/portfolios', {
    params: { page, per_page }
  });
  return response.data;
};

export const getPortfolio = async (id: number): Promise<Portfolio> => {
  const response = await client.get<Portfolio>(`/api/v1/portfolios/${id}`);
  return response.data;
};

export const createPortfolio = async (data: PortfolioCreateRequest, imageFile: File): Promise<Portfolio> => {
  const formData = new FormData();
  formData.append('title', data.title);
  formData.append('description', data.description);
  formData.append('category', data.category || PortfolioCategory.LOGO);
  formData.append('visibility', data.visibility || PortfolioVisibility.PUBLIC);
  formData.append('display_order', (data.display_order || 0).toString());
  formData.append('image', imageFile);

  const response = await client.post<Portfolio>('/api/v1/portfolios', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

export const updatePortfolio = async (data: PortfolioUpdateRequest): Promise<Portfolio> => {
  const formData = new FormData();
  if (data.title) formData.append('title', data.title);
  if (data.description) formData.append('description', data.description);
  if (data.category) formData.append('category', data.category);
  if (data.visibility) formData.append('visibility', data.visibility);
  if (data.display_order !== undefined) formData.append('display_order', data.display_order.toString());

  const response = await client.put<Portfolio>(`/api/v1/portfolios/${data.id}`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

export const deletePortfolio = async (id: number): Promise<void> => {
  await client.delete(`/api/v1/portfolios/${id}`);
}; 