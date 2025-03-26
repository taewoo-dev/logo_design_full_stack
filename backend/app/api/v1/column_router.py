from fastapi import APIRouter, Depends, File, Form, Query, UploadFile, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.auth.dependencies import CurrentAdmin
from app.core.dependencies import get_db
from app.core.utils.uuid_formatter import get_uuid_id
from app.dtos.column.column_response import ColumnResponse
from app.dtos.common.paginated_response import PaginatedResponse
from app.log.route import LoggedRoute
from app.models.column_enums import ColumnStatus
from app.services.column_service import (
    service_create_column,
    service_delete_column,
    service_get_column,
    service_get_columns,
    service_increment_view_count,
    service_update_column,
)

router = APIRouter(
    prefix="/columns",
    tags=["Columns"],
    route_class=LoggedRoute,
)


@router.get("", response_model=PaginatedResponse[ColumnResponse])
async def api_get_columns(
    page: int = Query(1, ge=1, description="페이지 번호"),
    per_page: int = Query(12, ge=1, le=100, description="페이지당 항목 수"),
    status: ColumnStatus | None = Query(None, description="칼럼 상태"),
    session: AsyncSession = Depends(get_db),
) -> PaginatedResponse[ColumnResponse]:
    return await service_get_columns(session, page, per_page, status)


@router.get("/{uuid}", response_model=ColumnResponse)
async def api_get_column(
    column_id: str = Depends(get_uuid_id), session: AsyncSession = Depends(get_db)
) -> ColumnResponse:
    return await service_get_column(session, column_id)


@router.post("", response_model=ColumnResponse, status_code=status.HTTP_201_CREATED)
async def api_create_column(
    _: CurrentAdmin,
    title: str = Form(...),
    content: str = Form(...),
    status: str = Form("DRAFT"),
    category: str = Form(...),
    thumbnail: UploadFile = File(...),
    session: AsyncSession = Depends(get_db),
) -> ColumnResponse:
    return await service_create_column(
        session=session,
        title=title,
        content=content,
        column_status=ColumnStatus(status),
        category=category,
        thumbnail=thumbnail,
    )


@router.put("/{uuid}", response_model=ColumnResponse)
async def api_update_column(
    _: CurrentAdmin,
    column_id: str = Depends(get_uuid_id),
    title: str | None = Form(None),
    content: str | None = Form(None),
    status: str | None = Form(None),
    thumbnail_image: UploadFile | None = File(None),
    category: str | None = Form(None),
    session: AsyncSession = Depends(get_db),
) -> ColumnResponse:
    return await service_update_column(
        session=session,
        column_id=column_id,
        title=title,
        content=content,
        column_status=status,
        thumbnail_image=thumbnail_image,
        category=category,
    )


@router.delete("/{uuid}", status_code=status.HTTP_204_NO_CONTENT)
async def api_delete_column(
    _: CurrentAdmin,
    column_id: str = Depends(get_uuid_id),
    session: AsyncSession = Depends(get_db),
) -> None:
    await service_delete_column(session, column_id)


@router.post("/{uuid}/view", status_code=status.HTTP_200_OK)
async def api_increment_view_count(
    column_id: str = Depends(get_uuid_id),
    session: AsyncSession = Depends(get_db),
) -> None:
    await service_increment_view_count(session, column_id)
