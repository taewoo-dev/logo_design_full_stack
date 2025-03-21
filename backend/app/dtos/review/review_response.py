from uuid import UUID

from pydantic import BaseModel

from app.dtos.frozen_config import FROZEN_CONFIG


class ReviewResponse(BaseModel):
    model_config = FROZEN_CONFIG

    id: UUID
    name: str
    rating: int
    content: str
    order_type: str
    order_amount: str
    working_days: int
    images: list[str]
    is_visible: bool

    class Config:
        from_attributes = True
