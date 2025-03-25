export interface Review {
  id: number;
  companyName: string;
  rating: number;
  content: string;
  imageUrl: string;
  isVisible: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ReviewCreateRequest {
  companyName: string;
  rating: number;
  content: string;
  imageUrl: string;
  isVisible: boolean;
}

export interface ReviewUpdateRequest extends Partial<ReviewCreateRequest> {
  id: number;
}

export interface ReviewStats {
  totalCount: number;
  averageRating: number;
  ratingDistribution: {
    [key: number]: number;
  };
} 