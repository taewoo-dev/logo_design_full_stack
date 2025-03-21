from typing import List
from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException, UploadFile, status
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.auth.dependencies import CurrentAdmin
from app.core.dependencies import get_db
from app.dtos.portfolio import PortfolioCreateRequest, PortfolioResponse, PortfolioUpdateRequest
from app.log.route import LoggedRoute
from app.models.portfolio import Portfolio

router = APIRouter(
    prefix="/portfolios",
    tags=["Portfolio"],
    route_class=LoggedRoute,
)


@router.get("", response_model=List[PortfolioResponse])
async def list_portfolios(session: AsyncSession = Depends(get_db)) -> List[Portfolio]:
    result = await session.execute(select(Portfolio))
    portfolios = result.scalars().all()
    return list(portfolios)


@router.get("/{portfolio_id}", response_model=PortfolioResponse)
async def get_portfolio(portfolio_id: UUID, session: AsyncSession = Depends(get_db)) -> Portfolio:
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
    portfolio: PortfolioCreateRequest,
    image: UploadFile,
    thumbnail: UploadFile,
    _: CurrentAdmin,  # Admin only
    session: AsyncSession = Depends(get_db),
) -> Portfolio:
    # TODO: Handle file uploads
    new_portfolio = Portfolio(
        title=portfolio.title,
        description=portfolio.description,
        category=portfolio.category,
        image_url="/temp/image.jpg",  # Temporary
        thumbnail_url="/temp/thumb.jpg",  # Temporary
        order=portfolio.order,
        is_visible=portfolio.is_visible,
    )
    session.add(new_portfolio)
    await session.commit()
    await session.refresh(new_portfolio)
    return new_portfolio


@router.put("/{portfolio_id}", response_model=PortfolioResponse)
async def update_portfolio(
    portfolio_id: UUID,
    portfolio_update: PortfolioUpdateRequest,
    _: CurrentAdmin,  # Admin only
    session: AsyncSession = Depends(get_db),
) -> Portfolio:
    result = await session.execute(select(Portfolio).where(Portfolio.id == portfolio_id))
    portfolio = result.scalar_one_or_none()

    if not portfolio:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Portfolio not found",
        )

    # Update fields
    for field, value in portfolio_update.model_dump(exclude_unset=True).items():
        setattr(portfolio, field, value)

    await session.commit()
    await session.refresh(portfolio)

    return portfolio


@router.delete("/{portfolio_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_portfolio(
    portfolio_id: UUID,
    _: CurrentAdmin,
    session: AsyncSession = Depends(get_db),
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
