from uuid import UUID

from fastapi import APIRouter, Depends, File, Form, HTTPException, Query, UploadFile, status
from sqlalchemy import func, select
from sqlalchemy.ext.asyncio import AsyncSession

from app.auth.dependencies import CurrentAdmin
from app.core.dependencies import get_db
from app.core.utils.file import save_upload_file
from app.core.utils.uuid_formatter import get_uuid_id
from app.dtos.common.paginated_response import PaginatedResponse
from app.dtos.portfolio.portfolio_response import PortfolioResponse
from app.log.route import LoggedRoute
from app.models.portfolio import Portfolio, PortfolioCategory, PortfolioVisibility

router = APIRouter(
    prefix="/portfolios",
    tags=["Portfolios"],
    route_class=LoggedRoute,
)


@router.get("", response_model=PaginatedResponse[PortfolioResponse])
async def list_portfolios(
    page: int = Query(1, ge=1, description="페이지 번호"),
    per_page: int = Query(12, ge=1, le=100, description="페이지당 항목 수"),
    session: AsyncSession = Depends(get_db),
) -> PaginatedResponse[PortfolioResponse]:
    total_count = await session.scalar(select(func.count()).select_from(Portfolio))
    if total_count is None:
        total_count = 0

    offset = (page - 1) * per_page
    result = await session.execute(
        select(Portfolio)
        .order_by(Portfolio.display_order.asc(), Portfolio.created_at.desc())
        .offset(offset)
        .limit(per_page)
    )
    portfolios = result.scalars().all()

    portfolio_responses = [
        PortfolioResponse(
            id=portfolio.id,
            title=portfolio.title,
            description=portfolio.description,
            category=portfolio.category,
            image_url=portfolio.image_url,
            display_order=portfolio.display_order,
            visibility=portfolio.visibility,
            created_at=portfolio.created_at,
            updated_at=portfolio.updated_at,
        )
        for portfolio in portfolios
    ]

    total_pages = (total_count + per_page - 1) // per_page

    return PaginatedResponse(
        items=portfolio_responses, total=total_count, page=page, per_page=per_page, total_pages=total_pages
    )


@router.get("/{portfolio_id}", response_model=PortfolioResponse)
async def get_portfolio(portfolio_id: UUID, session: AsyncSession = Depends(get_db)) -> PortfolioResponse:
    result = await session.execute(select(Portfolio).where(Portfolio.id == portfolio_id))
    portfolio = result.scalar_one_or_none()

    if not portfolio:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Portfolio not found",
        )

    return PortfolioResponse(
        id=portfolio.id,
        title=portfolio.title,
        description=portfolio.description,
        category=portfolio.category,
        image_url=portfolio.image_url,
        display_order=portfolio.display_order,
        visibility=portfolio.visibility,
        created_at=portfolio.created_at,
        updated_at=portfolio.updated_at,
    )


@router.post("", response_model=PortfolioResponse, status_code=status.HTTP_201_CREATED)
async def create_portfolio(
    _: CurrentAdmin,
    title: str = Form(...),
    description: str = Form(...),
    category: str = Form(...),
    display_order: int = Form(0),
    visibility: str = Form(...),
    image: UploadFile = File(...),
    session: AsyncSession = Depends(get_db),
) -> PortfolioResponse:
    image_url = await save_upload_file(image, subdir="portfolios")

    new_portfolio = Portfolio(
        title=title,
        description=description,
        category=PortfolioCategory(category),
        display_order=display_order,
        visibility=PortfolioVisibility(visibility),
        image_url=image_url,
    )
    session.add(new_portfolio)
    await session.commit()
    await session.refresh(new_portfolio)

    return PortfolioResponse(
        id=new_portfolio.id,
        title=new_portfolio.title,
        description=new_portfolio.description,
        category=new_portfolio.category,
        image_url=new_portfolio.image_url,
        display_order=new_portfolio.display_order,
        visibility=new_portfolio.visibility,
        created_at=new_portfolio.created_at,
        updated_at=new_portfolio.updated_at,
    )


@router.put("/{uuid}", response_model=PortfolioResponse)
async def update_portfolio(
    _: CurrentAdmin,
    portfolio_id: str = Depends(get_uuid_id),
    title: str | None = Form(None),
    description: str | None = Form(None),
    category: PortfolioCategory | None = Form(None),
    display_order: int | None = Form(None),
    visibility: PortfolioVisibility | None = Form(None),
    image: UploadFile | None = File(None),
    session: AsyncSession = Depends(get_db),
) -> PortfolioResponse:
    result = await session.execute(select(Portfolio).where(Portfolio.id == portfolio_id))
    portfolio = result.scalar_one_or_none()

    if not portfolio:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Portfolio not found",
        )

    if title is not None:
        portfolio.title = title
    if description is not None:
        portfolio.description = description
    if category is not None:
        portfolio.category = category
    if display_order is not None:
        portfolio.display_order = display_order
    if visibility is not None:
        portfolio.visibility = visibility

    # Update image if provided
    if image:
        image_url = await save_upload_file(image, subdir="portfolios")
        portfolio.image_url = image_url

    await session.commit()
    await session.refresh(portfolio)

    return PortfolioResponse(
        id=portfolio.id,
        title=portfolio.title,
        description=portfolio.description,
        category=portfolio.category,
        image_url=portfolio.image_url,
        display_order=portfolio.display_order,
        visibility=portfolio.visibility,
        created_at=portfolio.created_at,
        updated_at=portfolio.updated_at,
    )


@router.delete("/{uuid}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_portfolio(
    _: CurrentAdmin,
    portfolio_id: str = Depends(get_uuid_id),
    session: AsyncSession = Depends(get_db),
) -> None:
    try:
        result = await session.execute(select(Portfolio).where(Portfolio.id == portfolio_id))
        portfolio = result.scalar_one_or_none()

        if not portfolio:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Portfolio not found",
            )

        await session.delete(portfolio)
        await session.commit()
    except ValueError:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid portfolio ID format",
        )
