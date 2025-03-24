from enum import Enum

from sqlalchemy import ForeignKey, Integer, String
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.models.base import Base, TimestampMixin, UUIDMixin


class PaymentStatus(str, Enum):
    PENDING = "pending"
    COMPLETED = "completed"
    FAILED = "failed"
    REFUNDED = "refunded"


class PaymentMethod(str, Enum):
    CARD = "card"
    BANK_TRANSFER = "bank_transfer"
    VIRTUAL_ACCOUNT = "virtual_account"


class Payment(Base, UUIDMixin, TimestampMixin):
    __tablename__ = "payments"

    order_id: Mapped[str] = mapped_column(
        String(36),
        ForeignKey("orders.id"),
        nullable=False,
    )
    amount: Mapped[int] = mapped_column(
        Integer,
        nullable=False,
    )
    status: Mapped[PaymentStatus] = mapped_column(
        String(20),
        nullable=False,
        default=PaymentStatus.PENDING,
    )
    method: Mapped[PaymentMethod] = mapped_column(
        String(20),
        nullable=False,
    )
    transaction_id: Mapped[str] = mapped_column(
        String(100),
        nullable=True,
    )

    # Relationships
    order = relationship("Order", back_populates="payment")
