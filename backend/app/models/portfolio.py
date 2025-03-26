from sqlalchemy import Integer, String, Text, func, select
from sqlalchemy.orm import Mapped, mapped_column
from sqlalchemy.ext.asyncio import AsyncSession
from typing import List, Optional
from uuid import UUID

from app.models.base import Base, TimestampMixin, UUIDMixin
from app.dtos.common.paginated_response import PaginatedResponse
from app.dtos.portfolio.portfolio_response import PortfolioResponse
from app.models.portfolio_enums import PortfolioCategory, PortfolioVisibility


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

    @classmethod
    async def get_all_with_pagination(
        cls,
        session: AsyncSession,
        page: int = 1,
        per_page: int = 12
    ) -> PaginatedResponse[PortfolioResponse]:
        total_count = await session.scalar(select(func.count()).select_from(cls))
        if total_count is None:
            total_count = 0

        offset = (page - 1) * per_page
        result = await session.execute(
            select(cls)
            .order_by(cls.display_order.asc(), cls.created_at.desc())
            .offset(offset)
            .limit(per_page)
        )
        portfolios = result.scalars().all()

        portfolio_responses = [
            PortfolioResponse(
                id=portfolio.id,
                title=portfolio.title,
                description=portfolio.description,
                category=portfolio.category,
                image_url=portfolio.image_url,
                display_order=portfolio.display_order,
                visibility=portfolio.visibility,
                created_at=portfolio.created_at,
                updated_at=portfolio.updated_at,
            )
            for portfolio in portfolios
        ]

        total_pages = (total_count + per_page - 1) // per_page

        return PaginatedResponse(
            items=portfolio_responses,
            total=total_count,
            page=page,
            per_page=per_page,
            total_pages=total_pages
        )

    @classmethod
    async def get_by_id(
        cls,
        session: AsyncSession,
        portfolio_id: str
    ) -> Optional["Portfolio"]:
        result = await session.execute(select(cls).where(cls.id == portfolio_id))
        return result.scalar_one_or_none()

    @classmethod
    async def create_one(
        cls,
        session: AsyncSession,
        title: str,
        description: str,
        category: PortfolioCategory,
        display_order: int,
        visibility: PortfolioVisibility,
        image_url: str
    ) -> "Portfolio":
        portfolio = cls(
            title=title,
            description=description,
            category=category,
            display_order=display_order,
            visibility=visibility,
            image_url=image_url,
        )
        session.add(portfolio)
        await session.flush()
        await session.refresh(portfolio)
        return portfolio

    async def update(
        self,
        session: AsyncSession,
        title: str | None = None,
        description: str | None = None,
        category: PortfolioCategory | None = None,
        display_order: int | None = None,
        visibility: PortfolioVisibility | None = None,
        image_url: str | None = None
    ) -> None:
        if title is not None:
            self.title = title
        if description is not None:
            self.description = description
        if category is not None:
            self.category = category
        if display_order is not None:
            self.display_order = display_order
        if visibility is not None:
            self.visibility = visibility
        if image_url is not None:
            self.image_url = image_url

        await session.flush()
        await session.refresh(self)

    async def delete(self, session: AsyncSession) -> None:
        await session.delete(self)
        await session.flush()
