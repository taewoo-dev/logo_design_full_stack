from pydantic import BaseModel


class ReviewStatsResponse(BaseModel):
    total_reviews: int
    average_rating: float
    rating_distribution: dict[int, int]  # rating -> count
