from sqlalchemy import String, Text, Integer
from sqlalchemy.orm import Mapped, mapped_column

from app.models.base import Base, TimestampMixin, UUIDMixin


class Review(Base, UUIDMixin, TimestampMixin):
    __tablename__ = "reviews"

    name: Mapped[str] = mapped_column(
        String(50),
        nullable=False,
    )
    rating: Mapped[int] = mapped_column(
        Integer,
        nullable=False,
    )
    content: Mapped[str] = mapped_column(
        Text,
        nullable=False,
    )
    order_type: Mapped[str] = mapped_column(
        String(100),
        nullable=False,
    )
    order_amount: Mapped[str] = mapped_column(
        String(50),
        nullable=False,
    )
    working_days: Mapped[int] = mapped_column(
        Integer,
        nullable=False,
    )
    image_urls: Mapped[str] = mapped_column(
        String(1000),  # Comma-separated URLs
        nullable=False,
        default="",
    )
    is_visible: Mapped[bool] = mapped_column(
        nullable=False,
        default=True,
    )
    
    @property
    def images(self) -> list[str]:
        """이미지 URL 목록을 반환합니다."""
        return self.image_urls.split(",") if self.image_urls else []
    
    @images.setter
    def images(self, urls: list[str]) -> None:
        """이미지 URL 목록을 설정합니다."""
        self.image_urls = ",".join(urls) if urls else ""
