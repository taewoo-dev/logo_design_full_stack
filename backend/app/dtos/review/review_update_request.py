from typing import Annotated

from pydantic import BaseModel, Field

from app.dtos.frozen_config import FROZEN_CONFIG


class ReviewUpdateRequest(BaseModel):
    model_config = FROZEN_CONFIG

    name: str | None = None
    rating: Annotated[int | None, Field(ge=1, le=5)] = None
    content: str | None = None
    order_type: str | None = None
    order_amount: str | None = None
    working_days: Annotated[int | None, Field(ge=1)] = None
    is_visible: bool | None = None
