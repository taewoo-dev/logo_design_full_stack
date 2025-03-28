from typing import Annotated

from fastapi import APIRouter, Depends, File, Form, HTTPException, UploadFile
from sqlalchemy.ext.asyncio import AsyncSession

from app.auth.dependencies import CurrentAdmin
from app.core.dependencies import get_db
from app.core.utils.uuid_formatter import get_uuid_id
from app.dtos.common.paginated_response import PaginatedResponse
from app.dtos.review import ReviewStatsResponse
from app.dtos.review.review_query import ReviewQueryParams
from app.dtos.review.review_response import ReviewResponse
from app.log.route import LoggedRoute
from app.services.review_service import (
    service_create_review,
    service_delete_review,
    service_get_review_by_id,
    service_get_review_stats,
    service_get_reviews,
    service_update_review,
)

router = APIRouter(
    prefix="/reviews",
    tags=["Reviews"],
    route_class=LoggedRoute,
)


@router.get("", response_model=PaginatedResponse[ReviewResponse])
async def api_get_reviews(
    query_params: ReviewQueryParams = Depends(),
    session: AsyncSession = Depends(get_db),
) -> PaginatedResponse[ReviewResponse]:
    """리뷰 목록을 조회합니다."""
    return await service_get_reviews(session=session, query_params=query_params)


@router.get("/stats", response_model=ReviewStatsResponse)
async def api_get_review_stats(session: AsyncSession = Depends(get_db)) -> ReviewStatsResponse:
    """리뷰 통계를 조회합니다."""
    return await service_get_review_stats(session=session)


@router.get("/{uuid}", response_model=ReviewResponse)
async def api_get_review(
    review_id: str = Depends(get_uuid_id),
    session: AsyncSession = Depends(get_db),
) -> ReviewResponse:
    """리뷰 상세 정보를 조회합니다."""
    review = await service_get_review_by_id(session=session, review_id=review_id)
    if not review:
        raise HTTPException(status_code=404, detail="Review not found")
    return review


@router.post("", response_model=ReviewResponse)
async def api_create_review(
    _: CurrentAdmin,
    name: Annotated[str, Form()],
    rating: Annotated[int, Form()],
    content: Annotated[str, Form()],
    order_type: Annotated[str, Form()],
    order_amount: Annotated[str, Form()],
    working_days: Annotated[int, Form()],
    is_visible: Annotated[bool, Form()] = True,
    images: list[UploadFile] = File(...),
    session: AsyncSession = Depends(get_db),
) -> ReviewResponse:
    """새로운 리뷰를 생성합니다."""
    return await service_create_review(
        session=session,
        name=name,
        rating=rating,
        content=content,
        order_type=order_type,
        order_amount=order_amount,
        working_days=working_days,
        is_visible=is_visible,
        images=images,
    )


@router.put("/{uuid}", response_model=ReviewResponse)
async def api_update_review(
    _: CurrentAdmin,
    review_id: str = Depends(get_uuid_id),
    name: Annotated[str | None, Form()] = None,
    rating: Annotated[int | None, Form()] = None,
    content: Annotated[str | None, Form()] = None,
    order_type: Annotated[str | None, Form()] = None,
    order_amount: Annotated[str | None, Form()] = None,
    working_days: Annotated[int | None, Form()] = None,
    is_visible: Annotated[bool | None, Form()] = None,
    images: list[UploadFile] = File(None),
    session: AsyncSession = Depends(get_db),
) -> ReviewResponse:
    """리뷰를 수정합니다."""
    return await service_update_review(
        session=session,
        review_id=review_id,
        name=name,
        rating=rating,
        content=content,
        order_type=order_type,
        order_amount=order_amount,
        working_days=working_days,
        is_visible=is_visible,
        images=images,
    )


@router.delete("/{uuid}")
async def api_delete_review(
    _: CurrentAdmin,
    review_id: str = Depends(get_uuid_id),
    session: AsyncSession = Depends(get_db),
) -> None:
    """리뷰를 삭제합니다."""
    return await service_delete_review(session=session, review_id=review_id)
