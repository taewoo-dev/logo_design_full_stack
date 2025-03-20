from sqlalchemy import String, Text
from sqlalchemy.orm import Mapped, mapped_column

from app.models.base import Base, TimestampMixin, UUIDMixin


class Portfolio(Base, UUIDMixin, TimestampMixin):
    __tablename__ = "portfolios"

    title: Mapped[str] = mapped_column(
        String(100),
        nullable=False,
    )
    description: Mapped[str] = mapped_column(
        Text,
        nullable=False,
    )
    category: Mapped[str] = mapped_column(
        String(50),
        nullable=False,
        index=True,
    )
    image_url: Mapped[str] = mapped_column(
        String(255),
        nullable=False,
    )
    thumbnail_url: Mapped[str] = mapped_column(
        String(255),
        nullable=False,
    )
    order: Mapped[int] = mapped_column(
        nullable=False,
        default=0,
    )
    is_visible: Mapped[bool] = mapped_column(
        nullable=False,
        default=True,
    )
