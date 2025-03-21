from pydantic import BaseModel

from app.dtos.frozen_config import FROZEN_CONFIG


class ReviewStatsResponse(BaseModel):
    model_config = FROZEN_CONFIG

    total_reviews: int
    average_rating: float
    rating_distribution: dict[int, int]  # rating -> count
