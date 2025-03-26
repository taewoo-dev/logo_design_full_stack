
from fastapi import HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from app.core.utils.file import save_upload_file
from app.dtos.common.paginated_response import PaginatedResponse
from app.dtos.portfolio.portfolio_response import PortfolioResponse
from app.models.portfolio import Portfolio, PortfolioCategory, PortfolioVisibility
from fastapi import UploadFile, File

async def service_get_portfolios(
    session: AsyncSession,
    page: int = 1,
    per_page: int = 12
) -> PaginatedResponse[PortfolioResponse]:
    return await Portfolio.get_all_with_pagination(session, page, per_page)

async def service_get_portfolio(
    session: AsyncSession,
    portfolio_id: str
) -> PortfolioResponse:
    portfolio = await Portfolio.get_by_id(session, portfolio_id)

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

async def service_create_portfolio(
    session: AsyncSession,
    title: str,
    description: str,
    category: str,
    display_order: int,
    visibility: str,
    image: UploadFile = File(...)
) -> PortfolioResponse:
    image_url = await save_upload_file(image, subdir="portfolios")
    
    portfolio = await Portfolio.create_one(
        session=session,
        title=title,
        description=description,
        category=PortfolioCategory(category),
        display_order=display_order,
        visibility=PortfolioVisibility(visibility),
        image_url=image_url,
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

async def service_update_portfolio(
    session: AsyncSession,
    portfolio_id: str,
    title: str | None = None,
    description: str | None = None,
    category: str | None = None,
    display_order: int | None = None,
    visibility: str | None = None,
    image: UploadFile | None = None
) -> PortfolioResponse:
    portfolio = await Portfolio.get_by_id(session, portfolio_id)

    if not portfolio:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Portfolio not found",
        )

    update_data = {}
    if title is not None:
        update_data["title"] = title
    if description is not None:
        update_data["description"] = description
    if category is not None:
        update_data["category"] = PortfolioCategory(category)
    if display_order is not None:
        update_data["display_order"] = display_order
    if visibility is not None:
        update_data["visibility"] = PortfolioVisibility(visibility)
    if image is not None:
        update_data["image_url"] = await save_upload_file(image, subdir="portfolios")

    await portfolio.update(session, **update_data)

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

async def service_delete_portfolio(
    session: AsyncSession,
    portfolio_id: str
) -> None:
    portfolio = await Portfolio.get_by_id(session, portfolio_id)

    if not portfolio:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Portfolio not found",
        )

    await portfolio.delete(session) 