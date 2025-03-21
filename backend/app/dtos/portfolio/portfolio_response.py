from uuid import UUID

from pydantic import BaseModel

from app.dtos.frozen_config import FROZEN_CONFIG


class PortfolioResponse(BaseModel):
    model_config = FROZEN_CONFIG

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
