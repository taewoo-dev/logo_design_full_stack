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

    class Config:
        from_attributes = True
