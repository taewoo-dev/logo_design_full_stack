from datetime import datetime
from uuid import UUID

from pydantic import BaseModel


class ReviewResponse(BaseModel):

    id: UUID
    name: str
    rating: int
    content: str
    order_type: str
    order_amount: str
    working_days: int
    images: list[str]
    is_visible: bool
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True
