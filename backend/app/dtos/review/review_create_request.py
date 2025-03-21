from typing import Annotated

from pydantic import BaseModel, Field


class ReviewCreateRequest(BaseModel):
    name: str
    rating: Annotated[int, Field(ge=1, le=5)]
    content: str
    order_type: str
    order_amount: str
    working_days: Annotated[int, Field(ge=1)]
    is_visible: bool = True
