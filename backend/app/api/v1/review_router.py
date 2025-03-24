from typing import List
from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException, UploadFile, status
from pydantic import BaseModel
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.auth.dependencies import CurrentAdmin, CurrentUser
from app.core.dependencies import get_db
from app.core.utils.file import save_upload_file
from app.dtos.review import (
    ReviewCreateRequest,
    ReviewResponse,
    ReviewUpdateRequest,
)
from app.log.route import LoggedRoute
from app.models.review import Review


class ReviewStats(BaseModel):
    total_reviews: int
    average_rating: float
    rating_distribution: dict[int, int]  # rating -> count


router = APIRouter(
    prefix="/reviews",
    tags=["Reviews"],
    route_class=LoggedRoute,
)


@router.get("", response_model=List[ReviewResponse])
async def list_reviews(session: AsyncSession = Depends(get_db)) -> List[Review]:
    result = await session.execute(select(Review))
    reviews = result.scalars().all()
    return list(reviews)


@router.get("/stats", response_model=ReviewStats)
async def get_review_stats(session: AsyncSession = Depends(get_db)) -> ReviewStats:
    # Get all visible reviews
    result = await session.execute(select(Review).where(Review.is_visible))
    reviews = result.scalars().all()

    if not reviews:
        return ReviewStats(
            total_reviews=0,
            average_rating=0.0,
            rating_distribution={1: 0, 2: 0, 3: 0, 4: 0, 5: 0},
        )

    # Calculate stats
    total = len(reviews)
    avg_rating = sum(r.rating for r in reviews) / total
    distribution = {i: sum(1 for r in reviews if r.rating == i) for i in range(1, 6)}

    return ReviewStats(
        total_reviews=total,
        average_rating=round(avg_rating, 1),
        rating_distribution=distribution,
    )


@router.get("/{review_id}", response_model=ReviewResponse)
async def get_review(review_id: UUID, session: AsyncSession = Depends(get_db)) -> Review:
    result = await session.execute(select(Review).where(Review.id == review_id))
    review = result.scalar_one_or_none()

    if not review:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Review not found",
        )

    return review


@router.post("", response_model=ReviewResponse, status_code=status.HTTP_201_CREATED)
async def create_review(
    review: ReviewCreateRequest,
    current_user: CurrentUser,
    images: list[UploadFile] | None = None,
    session: AsyncSession = Depends(get_db),
) -> Review:
    # Handle image uploads
    image_urls = []
    if images:
        for image in images:
            image_url = await save_upload_file(image, subdir="reviews")
            image_urls.append(image_url)

    new_review = Review(
        name=review.name,
        rating=review.rating,
        content=review.content,
        order_type=review.order_type,
        order_amount=review.order_amount,
        working_days=review.working_days,
        is_visible=review.is_visible,
        image_urls=",".join(image_urls) if image_urls else "",
    )

    session.add(new_review)
    await session.commit()
    await session.refresh(new_review)

    return new_review


@router.put("/{review_id}", response_model=ReviewResponse)
async def update_review(
    review_id: UUID,
    review_update: ReviewUpdateRequest,
    _: CurrentAdmin,
    images: list[UploadFile] | None = None,
    session: AsyncSession = Depends(get_db),
) -> Review:
    result = await session.execute(select(Review).where(Review.id == review_id))
    review = result.scalar_one_or_none()

    if not review:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Review not found",
        )

    # Update fields
    for field, value in review_update.model_dump(exclude_unset=True).items():
        setattr(review, field, value)

    # Handle image uploads
    if images:
        image_urls = []
        for image in images:
            image_url = await save_upload_file(image, subdir="reviews")
            image_urls.append(image_url)
        review.image_urls = ",".join(image_urls)

    await session.commit()
    await session.refresh(review)

    return review


@router.delete("/{review_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_review(
    review_id: UUID,
    _: CurrentAdmin,
    session: AsyncSession = Depends(get_db),
) -> None:
    result = await session.execute(select(Review).where(Review.id == review_id))
    review = result.scalar_one_or_none()

    if not review:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Review not found",
        )

    await session.delete(review)
    await session.commit()
