export enum ColumnStatus {
  DRAFT = 'DRAFT',
  PUBLISHED = 'PUBLISHED'
}

export interface Column {
  id: string;
  title: string;
  content: string;
  status: ColumnStatus;
  thumbnail_url: string | null;
  category: string;
  view_count: number;
  created_at: string;
  updated_at: string;
}

export interface ColumnCreateRequest {
  title: string;
  content: string;
  status?: ColumnStatus;
  thumbnail?: File;
  category: string;
}

export interface ColumnUpdateRequest extends Partial<ColumnCreateRequest> {
  id: string;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  size: number;
  total_pages: number;
} 