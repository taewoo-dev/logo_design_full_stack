from datetime import datetime
from uuid import UUID
from pydantic import BaseModel

from app.models.portfolio_enums import PortfolioCategory, PortfolioVisibility


class PortfolioResponse(BaseModel):
    id: UUID
    title: str
    description: str
    category: PortfolioCategory
    image_url: str
    display_order: int
    visibility: PortfolioVisibility
    created_at: datetime
    updated_at: datetime
