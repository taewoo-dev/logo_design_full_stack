from enum import Enum

from sqlalchemy import Integer, String, Text
from sqlalchemy.orm import Mapped, mapped_column

from app.models.base import Base, TimestampMixin, UUIDMixin


class PortfolioCategory(str, Enum):
    LOGO = "logo"
    BRANDING = "branding"
    PACKAGING = "packaging"
    ILLUSTRATION = "illustration"
    OTHER = "other"


class PortfolioVisibility(str, Enum):
    PUBLIC = "public"
    PRIVATE = "private"


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
    category: Mapped[PortfolioCategory] = mapped_column(
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
    display_order: Mapped[int] = mapped_column(
        Integer,
        nullable=False,
        default=0,
    )
    visibility: Mapped[PortfolioVisibility] = mapped_column(
        String(20),
        nullable=False,
        default=PortfolioVisibility.PUBLIC,
    )
