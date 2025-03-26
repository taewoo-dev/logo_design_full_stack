import client from './client';
import type { Column, ColumnCreateRequest, ColumnUpdateRequest, PaginatedResponse } from '../types/column';
import { ColumnStatus } from '../types/column';

export const getColumns = async (
  page: number = 1,
  per_page: number = 12,
  status?: ColumnStatus
): Promise<PaginatedResponse<Column>> => {
  const response = await client.get<PaginatedResponse<Column>>('/api/v1/columns', {
    params: { page, per_page, ...(status && { status }) }
  });
  return response.data;
};

export const getColumn = async (id: string): Promise<Column> => {
  const response = await client.get<Column>(`/api/v1/columns/${id}`);
  return response.data;
};

export const createColumn = async (data: ColumnCreateRequest): Promise<Column> => {
  const formData = new FormData();
  formData.append('title', data.title);
  formData.append('content', data.content);
  formData.append('status', data.status || ColumnStatus.DRAFT);
  formData.append('category', data.category);
  if (data.thumbnail) {
    formData.append('thumbnail', data.thumbnail);
  }

  const response = await client.post<Column>('/api/v1/columns', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

export const updateColumn = async (data: ColumnUpdateRequest): Promise<Column> => {
  const formData = new FormData();
  if (data.title) formData.append('title', data.title);
  if (data.content) formData.append('content', data.content);
  if (data.status) formData.append('status', data.status);
  if (data.category) formData.append('category', data.category);
  if (data.thumbnail) {
    formData.append('thumbnail_image', data.thumbnail);
  }

  const response = await client.put<Column>(`/api/v1/columns/${data.id}`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

export const deleteColumn = async (id: string): Promise<void> => {
  await client.delete(`/api/v1/columns/${id}`);
};

export const incrementViewCount = async (id: string): Promise<void> => {
  await client.post(`/api/v1/columns/${id}/view`);
}; 