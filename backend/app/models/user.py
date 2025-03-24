from sqlalchemy import String
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.auth.jwt_codec import UserRole
from app.models.base import Base, TimestampMixin, UUIDMixin


class User(Base, UUIDMixin, TimestampMixin):
    __tablename__ = "users"

    email: Mapped[str] = mapped_column(
        String(255),
        unique=True,
        nullable=False,
        index=True,
    )
    hashed_password: Mapped[str] = mapped_column(
        String(255),
        nullable=False,
    )
    name: Mapped[str] = mapped_column(
        String(50),
        nullable=False,
    )
    role: Mapped[UserRole] = mapped_column(
        String(10),
        nullable=False,
        default=UserRole.USER,
    )

    # Relationships
    orders = relationship("Order", back_populates="user", cascade="all, delete-orphan")
