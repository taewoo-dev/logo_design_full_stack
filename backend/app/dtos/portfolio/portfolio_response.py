from uuid import UUID

from pydantic import BaseModel


class PortfolioResponse(BaseModel):
    id: UUID
    title: str
    description: str
    category: str
    image_url: str
    thumbnail_url: str
    order: int
    is_visible: bool

    class Config:
        from_attributes = True
