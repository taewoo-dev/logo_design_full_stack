from typing import Annotated

from pydantic import BaseModel, Field

from app.dtos.frozen_config import FROZEN_CONFIG


class ReviewCreateRequest(BaseModel):
    model_config = FROZEN_CONFIG

    name: str
    rating: Annotated[int, Field(ge=1, le=5)]
    content: str
    order_type: str
    order_amount: str
    working_days: Annotated[int, Field(ge=1)]
    is_visible: bool = True
