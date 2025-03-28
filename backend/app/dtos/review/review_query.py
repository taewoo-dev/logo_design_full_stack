from enum import Enum
from typing import Optional

from pydantic import BaseModel


class ReviewSortBy(str, Enum):
    CREATED_AT = "created_at"
    RATING = "rating"
    WORKING_DAYS = "working_days"
    ORDER_AMOUNT = "order_amount"


class SortOrder(str, Enum):
    ASC = "asc"
    DESC = "desc"


class ReviewQueryParams(BaseModel):
    page: int = 1
    per_page: int = 12
    is_visible: Optional[bool] = None
    sort_by: ReviewSortBy = ReviewSortBy.CREATED_AT
    sort_order: SortOrder = SortOrder.DESC
