from typing import Annotated
from uuid import UUID

from fastapi import APIRouter, HTTPException, Query, UploadFile, status
from pydantic import BaseModel
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.auth.dependencies import CurrentAdmin
from app.core.dependencies import CurrentSession
from app.log.route import LoggedRoute
from app.models.portfolio import Portfolio


class PortfolioCreate(BaseModel):
    title: str
    description: str
    category: str
    order: int = 0
    is_visible: bool = True


class PortfolioUpdate(BaseModel):
    title: str | None = None
    description: str | None = None
    category: str | None = None
    order: int | None = None
    is_visible: bool | None = None


class PortfolioResponse(BaseModel):
    id: UUID
    title: str
    description: str
    category: str
    image_url: str
    thumbnail_url: str
    order: int
    is_visible: bool

    class Config:
        from_attributes = True


router = APIRouter(
    prefix="/portfolios",
    tags=["Portfolio"],
    route_class=LoggedRoute,
)


@router.get("", response_model=list[PortfolioResponse])
async def list_portfolios(
    session: AsyncSession = CurrentSession,
    category: str | None = None,
    page: Annotated[int, Query(ge=1)] = 1,
    limit: Annotated[int, Query(ge=1, le=100)] = 20,
) -> list[Portfolio]:
    query = select(Portfolio).order_by(Portfolio.order.desc())

    if category:
        query = query.where(Portfolio.category == category)

    result = await session.execute(query.offset((page - 1) * limit).limit(limit))
    return result.scalars().all()


@router.get("/{portfolio_id}", response_model=PortfolioResponse)
async def get_portfolio(
    portfolio_id: UUID,
    session: AsyncSession = CurrentSession,
) -> Portfolio:
    result = await session.execute(select(Portfolio).where(Portfolio.id == portfolio_id))
    portfolio = result.scalar_one_or_none()

    if not portfolio:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Portfolio not found",
        )

    return portfolio


@router.post("", response_model=PortfolioResponse, status_code=status.HTTP_201_CREATED)
async def create_portfolio(
    data: PortfolioCreate,
    image: UploadFile,
    thumbnail: UploadFile,
    session: AsyncSession = CurrentSession,
    _: CurrentAdmin = None,  # Admin only
) -> Portfolio:
    # TODO: Handle file uploads
    portfolio = Portfolio(
        title=data.title,
        description=data.description,
        category=data.category,
        image_url="/temp/image.jpg",  # Temporary
        thumbnail_url="/temp/thumb.jpg",  # Temporary
        order=data.order,
        is_visible=data.is_visible,
    )

    session.add(portfolio)
    await session.commit()
    await session.refresh(portfolio)

    return portfolio


@router.patch("/{portfolio_id}", response_model=PortfolioResponse)
async def update_portfolio(
    portfolio_id: UUID,
    data: PortfolioUpdate,
    session: AsyncSession = CurrentSession,
    _: CurrentAdmin = None,  # Admin only
) -> Portfolio:
    result = await session.execute(select(Portfolio).where(Portfolio.id == portfolio_id))
    portfolio = result.scalar_one_or_none()

    if not portfolio:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Portfolio not found",
        )

    # Update fields
    for field, value in data.model_dump(exclude_unset=True).items():
        setattr(portfolio, field, value)

    await session.commit()
    await session.refresh(portfolio)

    return portfolio


@router.delete("/{portfolio_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_portfolio(
    portfolio_id: UUID,
    session: AsyncSession = CurrentSession,
    _: CurrentAdmin = None,  # Admin only
) -> None:
    result = await session.execute(select(Portfolio).where(Portfolio.id == portfolio_id))
    portfolio = result.scalar_one_or_none()

    if not portfolio:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Portfolio not found",
        )

    await session.delete(portfolio)
    await session.commit()
