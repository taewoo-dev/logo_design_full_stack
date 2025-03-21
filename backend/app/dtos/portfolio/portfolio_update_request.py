from pydantic import BaseModel

from app.dtos.frozen_config import FROZEN_CONFIG


class PortfolioUpdateRequest(BaseModel):
    model_config = FROZEN_CONFIG

    title: str | None = None
    description: str | None = None
    category: str | None = None
    order: int | None = None
    is_visible: bool | None = None
