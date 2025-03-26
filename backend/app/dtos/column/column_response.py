from datetime import datetime

from pydantic import BaseModel

from app.models.column_enums import ColumnStatus


class ColumnNavigation(BaseModel):
    id: str
    title: str
    thumbnail_url: str | None


class ColumnResponse(BaseModel):
    id: str
    title: str
    content: str
    status: ColumnStatus
    thumbnail_url: str | None
    view_count: int
    created_at: datetime
    updated_at: datetime
    category: str | None
    prev_column: ColumnNavigation | None = None
    next_column: ColumnNavigation | None = None
