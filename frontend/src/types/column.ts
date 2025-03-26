export enum ColumnStatus {
  DRAFT = 'DRAFT',
  PUBLISHED = 'PUBLISHED'
}

export interface ColumnNavigation {
  id: string;
  title: string;
  thumbnail_url: string | null;
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
  prev_column: ColumnNavigation | null;
  next_column: ColumnNavigation | null;
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