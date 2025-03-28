from typing import Optional

from fastapi import HTTPException, UploadFile, status, File
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.utils.file import save_upload_file
from app.dtos.common.paginated_response import PaginatedResponse
from app.dtos.review import ReviewStatsResponse
from app.dtos.review.review_query import ReviewQueryParams
from app.dtos.review.review_response import ReviewResponse
from app.models.review import Review


def _to_review_response(review: Review) -> ReviewResponse:
    """Review 모델을 ReviewResponse로 변환합니다."""
    return ReviewResponse(
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


async def service_get_reviews(
    session: AsyncSession,
    query_params: ReviewQueryParams,
) -> PaginatedResponse[ReviewResponse]:
    """리뷰 목록을 조회합니다."""
    return await Review.get_all_with_pagination(
        session=session,
        page=query_params.page,
        per_page=query_params.per_page,
        is_visible=query_params.is_visible,
        sort_by=query_params.sort_by,
        sort_order=query_params.sort_order,
    )


async def service_get_review_by_id(session: AsyncSession, review_id: str) -> Optional[ReviewResponse]:
    """ID로 리뷰를 조회합니다."""
    review = await Review.get_by_id(session=session, review_id=review_id)
    if review:
        return _to_review_response(review)
    return None


async def service_create_review(
    session: AsyncSession,
    name: str,
    rating: int,
    content: str,
    order_type: str,
    order_amount: str,
    working_days: int,
    is_visible: bool = True,
    images: list[UploadFile] = File(...),
) -> ReviewResponse:
    """새로운 리뷰를 생성합니다."""
    image_urls = ",".join([await save_upload_file(image, subdir="reviews") for image in images])

    review = await Review.create_one(
        session=session,
        name=name,
        rating=rating,
        content=content,
        order_type=order_type,
        order_amount=order_amount,
        working_days=working_days,
        is_visible=is_visible,
        image_urls=image_urls,
    )
    return _to_review_response(review)


async def service_update_review(
    session: AsyncSession,
    review_id: str,
    name: str | None = None,
    rating: int | None = None,
    content: str | None = None,
    order_type: str | None = None,
    order_amount: str | None = None,
    working_days: int | None = None,
    is_visible: bool | None = None,
    images: list[UploadFile] | None = None,
) -> ReviewResponse:
    """리뷰를 수정합니다."""
    review = await Review.get_by_id(session=session, review_id=review_id)

    if not review:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Review not found",
        )

    image_urls = ",".join([await save_upload_file(image, subdir="reviews") for image in images]) if images else None

    await review.update(
        session=session,
        name=name,
        rating=rating,
        content=content,
        order_type=order_type,
        order_amount=order_amount,
        working_days=working_days,
        is_visible=is_visible,
        image_urls=image_urls,
    )
    return _to_review_response(review)


async def service_delete_review(session: AsyncSession, review_id: str) -> None:
    review = await Review.get_by_id(session=session, review_id=review_id)

    if not review:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Review not found")

    await review.delete(session=session)


async def service_get_review_stats(session: AsyncSession) -> ReviewStatsResponse:
    """리뷰 통계를 조회합니다."""
    return await Review.get_stats(session=session)
