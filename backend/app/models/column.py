from enum import Enum

from sqlalchemy import String, Text
from sqlalchemy.orm import Mapped, mapped_column

from app.models.base import Base, TimestampMixin, UUIDMixin


class ColumnStatus(str, Enum):
    DRAFT = "draft"
    PUBLISHED = "published"
    ARCHIVED = "archived"


class Column(Base, UUIDMixin, TimestampMixin):
    __tablename__ = "columns"

    title: Mapped[str] = mapped_column(
        String(200),
        nullable=False,
    )
    content: Mapped[str] = mapped_column(
        Text,
        nullable=False,
    )
    status: Mapped[ColumnStatus] = mapped_column(
        String(20),
        nullable=False,
        default=ColumnStatus.DRAFT,
    )
    thumbnail_url: Mapped[str] = mapped_column(
        String(255),
        nullable=True,
    )
    view_count: Mapped[int] = mapped_column(
        nullable=False,
        default=0,
    )
