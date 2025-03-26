from typing import Optional

from sqlalchemy import Integer, String, Text, func, select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import Mapped, mapped_column

from app.dtos.column.column_response import ColumnResponse
from app.dtos.common.paginated_response import PaginatedResponse
from app.models.base import Base, TimestampMixin, UUIDMixin
from app.models.column_enums import ColumnStatus


class Column(Base, UUIDMixin, TimestampMixin):
    __tablename__ = "columns"

    title: Mapped[str] = mapped_column(String(100), nullable=False)
    content: Mapped[str] = mapped_column(Text, nullable=False)
    status: Mapped[ColumnStatus] = mapped_column(String(20), nullable=False, default=ColumnStatus.DRAFT)
    thumbnail_url: Mapped[str | None] = mapped_column(String(255), nullable=True)
    view_count: Mapped[int] = mapped_column(Integer, nullable=False, default=0)
    category: Mapped[str | None] = mapped_column(String(50), nullable=True)

    @classmethod
    async def get_all_with_pagination(
        cls, session: AsyncSession, page: int = 1, per_page: int = 12, status: ColumnStatus | None = None
    ) -> PaginatedResponse[ColumnResponse]:
        query = select(cls)
        if status:
            query = query.where(cls.status == status)

        total_count = await session.scalar(select(func.count()).select_from(query.subquery()))
        if total_count is None:
            total_count = 0

        offset = (page - 1) * per_page
        result = await session.execute(query.order_by(cls.created_at.desc()).offset(offset).limit(per_page))
        columns = result.scalars().all()

        column_responses = [
            ColumnResponse(
                id=column.id,
                title=column.title,
                content=column.content,
                status=column.status,
                thumbnail_url=column.thumbnail_url,
                view_count=column.view_count,
                created_at=column.created_at,
                updated_at=column.updated_at,
                category=column.category,
            )
            for column in columns
        ]

        total_pages = (total_count + per_page - 1) // per_page

        return PaginatedResponse(
            items=column_responses, total=total_count, page=page, per_page=per_page, total_pages=total_pages
        )

    @classmethod
    async def get_by_id(cls, session: AsyncSession, column_id: str) -> Optional["Column"]:
        result = await session.execute(select(cls).where(cls.id == column_id))
        return result.scalar_one_or_none()

    @classmethod
    async def get_prev_next_columns(
        cls, session: AsyncSession, column_id: str
    ) -> tuple[Optional["Column"], Optional["Column"]]:
        # 현재 컬럼 가져오기
        current_column = await cls.get_by_id(session, column_id)
        if not current_column:
            return None, None

        # 이전글 가져오기 (created_at이 현재 글보다 이전인 것 중 가장 최근)
        prev_query = (
            select(cls)
            .where(cls.created_at < current_column.created_at, cls.status == ColumnStatus.PUBLISHED)
            .order_by(cls.created_at.desc())
        )
        prev_result = await session.execute(prev_query)
        prev_column = prev_result.scalars().first()

        # 다음글 가져오기 (created_at이 현재 글보다 이후인 것 중 가장 오래된)
        next_query = (
            select(cls)
            .where(cls.created_at > current_column.created_at, cls.status == ColumnStatus.PUBLISHED)
            .order_by(cls.created_at.asc())
        )
        next_result = await session.execute(next_query)
        next_column = next_result.scalars().first()

        return prev_column, next_column

    @classmethod
    async def create_one(
        cls,
        session: AsyncSession,
        title: str,
        content: str,
        status: ColumnStatus,
        thumbnail_url: str | None = None,
        category: str | None = None,
    ) -> "Column":
        column = cls(
            title=title,
            content=content,
            status=status,
            thumbnail_url=thumbnail_url,
            category=category,
        )
        session.add(column)
        await session.flush()
        await session.refresh(column)
        return column

    async def update(
        self,
        session: AsyncSession,
        title: str | None = None,
        content: str | None = None,
        status: str | None = None,
        thumbnail_url: str | None = None,
        category: str | None = None,
    ) -> None:
        if title is not None:
            self.title = title
        if content is not None:
            self.content = content
        if status is not None:
            self.status = ColumnStatus(status)
        if thumbnail_url is not None:
            self.thumbnail_url = thumbnail_url
        if category is not None:
            self.category = category

        await session.flush()
        await session.refresh(self)

    async def delete(self, session: AsyncSession) -> None:
        await session.delete(self)
        await session.flush()
