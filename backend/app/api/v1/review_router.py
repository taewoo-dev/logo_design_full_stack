from typing import Annotated
from uuid import UUID

from fastapi import APIRouter, HTTPException, Query, UploadFile, status
from pydantic import BaseModel, Field
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.auth.dependencies import CurrentAdmin
from app.core.dependencies import CurrentSession
from app.log.route import LoggedRoute
from app.models.review import Review


class ReviewCreate(BaseModel):
    name: str
    rating: Annotated[int, Field(ge=1, le=5)]
    content: str
    order_type: str
    order_amount: str
    working_days: Annotated[int, Field(ge=1)]
    is_visible: bool = True


class ReviewUpdate(BaseModel):
    name: str | None = None
    rating: Annotated[int | None, Field(ge=1, le=5)] = None
    content: str | None = None
    order_type: str | None = None
    order_amount: str | None = None
    working_days: Annotated[int | None, Field(ge=1)] = None
    is_visible: bool | None = None


class ReviewResponse(BaseModel):
    id: UUID
    name: str
    rating: int
    content: str
    order_type: str
    order_amount: str
    working_days: int
    images: list[str]
    is_visible: bool

    class Config:
        from_attributes = True


class ReviewStats(BaseModel):
    total_reviews: int
    average_rating: float
    rating_distribution: dict[int, int]  # rating -> count


router = APIRouter(
    prefix="/reviews",
    tags=["Reviews"],
    route_class=LoggedRoute,
)


@router.get("", response_model=list[ReviewResponse])
async def list_reviews(
    session: AsyncSession = CurrentSession,
    page: Annotated[int, Query(ge=1)] = 1,
    limit: Annotated[int, Query(ge=1, le=100)] = 20,
) -> list[Review]:
    result = await session.execute(
        select(Review)
        .where(Review.is_visible == True)
        .order_by(Review.created_at.desc())
        .offset((page - 1) * limit)
        .limit(limit)
    )
    return result.scalars().all()


@router.get("/stats", response_model=ReviewStats)
async def get_review_stats(
    session: AsyncSession = CurrentSession,
) -> ReviewStats:
    # Get all visible reviews
    result = await session.execute(select(Review).where(Review.is_visible == True))
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
async def get_review(
    review_id: UUID,
    session: AsyncSession = CurrentSession,
) -> Review:
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
    data: ReviewCreate,
    images: list[UploadFile] | None = None,
    session: AsyncSession = CurrentSession,
) -> Review:
    # TODO: Handle image uploads
    review = Review(
        name=data.name,
        rating=data.rating,
        content=data.content,
        order_type=data.order_type,
        order_amount=data.order_amount,
        working_days=data.working_days,
        is_visible=data.is_visible,
        image_urls="",  # Temporary
    )

    session.add(review)
    await session.commit()
    await session.refresh(review)

    return review


@router.patch("/{review_id}", response_model=ReviewResponse)
async def update_review(
    review_id: UUID,
    data: ReviewUpdate,
    session: AsyncSession = CurrentSession,
    _: CurrentAdmin = None,  # Admin only
) -> Review:
    result = await session.execute(select(Review).where(Review.id == review_id))
    review = result.scalar_one_or_none()

    if not review:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Review not found",
        )

    # Update fields
    for field, value in data.model_dump(exclude_unset=True).items():
        setattr(review, field, value)

    await session.commit()
    await session.refresh(review)

    return review


@router.delete("/{review_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_review(
    review_id: UUID,
    session: AsyncSession = CurrentSession,
    _: CurrentAdmin = None,  # Admin only
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
