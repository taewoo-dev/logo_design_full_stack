export interface Review {
  id: string;  // UUID
  name: string;
  rating: number;
  content: string;
  order_type: string;
  order_amount: string;
  working_days: number;
  images: string[];
  is_visible: boolean;
  created_at: string;
  updated_at: string;
}

export interface ReviewStatsResponse {
  total_reviews: number;
  average_rating: number;
  rating_distribution: {
    [key: number]: number;
  };
}

export type ReviewCreateRequest = FormData;
export type ReviewUpdateRequest = FormData;

export interface ReviewStats {
  total_reviews: number;
  average_rating: number;
  rating_distribution: {
    [key: number]: number;
  };
} 