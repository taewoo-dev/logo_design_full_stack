from fastapi import HTTPException, UploadFile, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.utils.file import save_upload_file
from app.dtos.column.column_response import ColumnNavigation, ColumnResponse
from app.dtos.common.paginated_response import PaginatedResponse
from app.models.column import Column
from app.models.column_enums import ColumnStatus


async def service_get_columns(
    session: AsyncSession, page: int = 1, per_page: int = 12, status: ColumnStatus | None = None
) -> PaginatedResponse[ColumnResponse]:
    return await Column.get_all_with_pagination(session, page, per_page, status)


async def service_get_column(session: AsyncSession, column_id: str) -> ColumnResponse:
    column = await Column.get_by_id(session, column_id)

    if not column:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Column not found",
        )

    # 이전글/다음글 가져오기
    prev_column, next_column = await Column.get_prev_next_columns(session, column_id)

    return ColumnResponse(
        id=column.id,
        title=column.title,
        content=column.content,
        status=column.status,
        thumbnail_url=column.thumbnail_url,
        view_count=column.view_count,
        created_at=column.created_at,
        updated_at=column.updated_at,
        category=column.category,
        prev_column=(
            ColumnNavigation(
                id=prev_column.id,
                title=prev_column.title,
                thumbnail_url=prev_column.thumbnail_url,
            )
            if prev_column
            else None
        ),
        next_column=(
            ColumnNavigation(
                id=next_column.id,
                title=next_column.title,
                thumbnail_url=next_column.thumbnail_url,
            )
            if next_column
            else None
        ),
    )


async def service_create_column(
    session: AsyncSession,
    title: str,
    content: str,
    column_status: ColumnStatus,
    category: str,
    thumbnail: UploadFile,
) -> ColumnResponse:
    thumbnail_url = await save_upload_file(thumbnail, subdir="columns")

    column = await Column.create_one(
        session=session,
        title=title,
        content=content,
        status=column_status,
        thumbnail_url=thumbnail_url,
        category=category,
    )

    return ColumnResponse(
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


async def service_update_column(
    session: AsyncSession,
    column_id: str,
    title: str | None = None,
    content: str | None = None,
    column_status: str | None = None,
    thumbnail_image: UploadFile | None = None,
    category: str | None = None,
) -> ColumnResponse:
    column = await Column.get_by_id(session, column_id)

    if not column:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Column not found",
        )

    thumbnail_url = await save_upload_file(thumbnail_image, subdir="columns") if thumbnail_image else None

    await column.update(
        session=session,
        title=title,
        content=content,
        status=column_status,
        thumbnail_url=thumbnail_url,
        category=category,
    )

    return ColumnResponse(
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


async def service_delete_column(session: AsyncSession, column_id: str) -> None:
    column = await Column.get_by_id(session, column_id)

    if not column:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Column not found",
        )

    await column.delete(session=session)


async def service_increment_view_count(session: AsyncSession, column_id: str) -> None:
    column = await Column.get_by_id(session, column_id)

    if not column:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Column not found",
        )

    column.view_count += 1
    await session.flush()
