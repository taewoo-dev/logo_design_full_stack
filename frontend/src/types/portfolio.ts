export enum PortfolioCategory {
  LOGO = 'LOGO',
  BRANDING = 'BRANDING',
  PACKAGING = 'PACKAGING',
  WEB = 'WEB',
  APP = 'APP',
  OTHER = 'OTHER'
}

export enum PortfolioVisibility {
  PUBLIC = 'PUBLIC',
  PRIVATE = 'PRIVATE'
}

export interface Portfolio {
  id: number;
  title: string;
  description: string;
  image_url: string;
  category: PortfolioCategory;
  visibility: PortfolioVisibility;
  display_order: number;
  created_at: string;
  updated_at: string;
}

export interface PortfolioCreateRequest {
  title: string;
  description: string;
  category: PortfolioCategory;
  visibility: PortfolioVisibility;
  display_order?: number;
}

export interface PortfolioUpdateRequest extends Partial<PortfolioCreateRequest> {
  id: number;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  size: number;
  total_pages: number;
} 