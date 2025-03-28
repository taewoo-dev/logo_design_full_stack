from typing import Optional

from sqlalchemy import Integer, String, Text, asc, desc, func, select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import Mapped, mapped_column

from app.dtos.common.paginated_response import PaginatedResponse
from app.dtos.review import ReviewStatsResponse
from app.dtos.review.review_query import ReviewSortBy, SortOrder
from app.dtos.review.review_response import ReviewResponse
from app.models.base import Base, TimestampMixin, UUIDMixin


class Review(Base, UUIDMixin, TimestampMixin):
    __tablename__ = "reviews"

    name: Mapped[str] = mapped_column(
        String(100),
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
        String(50),
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
    is_visible: Mapped[bool] = mapped_column(
        nullable=False,
        default=True,
    )
    image_urls: Mapped[str | None] = mapped_column(
        String(1000),  # Comma-separated URLs
        nullable=True,
    )

    @property
    def images(self) -> list[str]:
        """이미지 URL 목록을 반환합니다."""
        return self.image_urls.split(",") if self.image_urls else []

    @images.setter
    def images(self, urls: list[str]) -> None:
        """이미지 URL 목록을 설정합니다."""
        self.image_urls = ",".join(urls) if urls else None

    @classmethod
    async def get_all_with_pagination(
        cls,
        session: AsyncSession,
        page: int = 1,
        per_page: int = 12,
        is_visible: bool | None = None,
        sort_by: ReviewSortBy = ReviewSortBy.CREATED_AT,
        sort_order: SortOrder = SortOrder.DESC,
    ) -> PaginatedResponse[ReviewResponse]:
        query = select(cls)
        if is_visible is not None:
            query = query.where(cls.is_visible == is_visible)

        total_count = await session.scalar(select(func.count()).select_from(query.subquery()))
        if total_count is None:
            total_count = 0

        # 정렬 적용
        order_by_column = getattr(cls, sort_by)
        if sort_order == SortOrder.DESC:
            query = query.order_by(desc(order_by_column))
        else:
            query = query.order_by(asc(order_by_column))

        offset = (page - 1) * per_page
        result = await session.execute(query.offset(offset).limit(per_page))
        reviews = result.scalars().all()

        review_responses = [
            ReviewResponse(
                id=review.id,
                name=review.name,
                rating=review.rating,
                content=review.content,
                order_type=review.order_type,
                order_amount=review.order_amount,
                working_days=review.working_days,
                is_visible=review.is_visible,
                images=review.image_urls.split(",") if review.image_urls else [],
                created_at=review.created_at,
                updated_at=review.updated_at,
            )
            for review in reviews
        ]

        total_pages = (total_count + per_page - 1) // per_page

        return PaginatedResponse(
            items=review_responses,
            total=total_count,
            page=page,
            per_page=per_page,
            total_pages=total_pages,
        )

    @classmethod
    async def get_by_id(cls, session: AsyncSession, review_id: str) -> Optional["Review"]:
        result = await session.execute(select(cls).where(cls.id == review_id))
        return result.scalar_one_or_none()

    @classmethod
    async def create_one(
        cls,
        session: AsyncSession,
        name: str,
        rating: int,
        content: str,
        order_type: str,
        order_amount: str,
        working_days: int,
        is_visible: bool = True,
        image_urls: str | None = None,
    ) -> "Review":
        review = cls(
            name=name,
            rating=rating,
            content=content,
            order_type=order_type,
            order_amount=order_amount,
            working_days=working_days,
            is_visible=is_visible,
            image_urls=image_urls,
        )
        session.add(review)
        await session.flush()
        await session.refresh(review)
        return review

    async def update(
        self,
        session: AsyncSession,
        name: str | None = None,
        rating: int | None = None,
        content: str | None = None,
        order_type: str | None = None,
        order_amount: str | None = None,
        working_days: int | None = None,
        is_visible: bool | None = None,
        image_urls: str | None = None,
    ) -> "Review":
        if name is not None:
            self.name = name
        if rating is not None:
            self.rating = rating
        if content is not None:
            self.content = content
        if order_type is not None:
            self.order_type = order_type
        if order_amount is not None:
            self.order_amount = order_amount
        if working_days is not None:
            self.working_days = working_days
        if is_visible is not None:
            self.is_visible = is_visible
        if image_urls is not None:
            self.image_urls = image_urls

        await session.flush()
        await session.refresh(self)
        return self

    async def delete(self, session: AsyncSession) -> None:
        await session.delete(self)
        await session.flush()

    @classmethod
    async def get_stats(cls, session: AsyncSession) -> ReviewStatsResponse:
        result = await session.execute(select(cls).where(cls.is_visible))
        reviews = result.scalars().all()

        if not reviews:
            return ReviewStatsResponse(
                total_reviews=0,
                average_rating=0.0,
                rating_distribution={1: 0, 2: 0, 3: 0, 4: 0, 5: 0},
            )

        total = len(reviews)
        avg_rating = sum(r.rating for r in reviews) / total
        distribution = {i: sum(1 for r in reviews if r.rating == i) for i in range(1, 6)}

        return ReviewStatsResponse(
            total_reviews=total,
            average_rating=round(avg_rating, 1),
            rating_distribution=distribution,
        )
