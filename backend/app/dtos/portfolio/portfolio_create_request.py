from pydantic import BaseModel

from app.dtos.frozen_config import FROZEN_CONFIG


class PortfolioCreateRequest(BaseModel):
    model_config = FROZEN_CONFIG

    title: str
    description: str
    category: str
    order: int = 0
    is_visible: bool = True
