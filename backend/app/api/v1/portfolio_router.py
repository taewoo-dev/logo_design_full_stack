from fastapi import APIRouter, Depends, File, Form, Query, UploadFile, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.auth.dependencies import CurrentAdmin
from app.core.dependencies import get_db
from app.core.utils.uuid_formatter import get_uuid_id
from app.dtos.common.paginated_response import PaginatedResponse
from app.dtos.portfolio.portfolio_response import PortfolioResponse
from app.log.route import LoggedRoute
from app.services.portfolio_service import (
    service_create_portfolio,
    service_delete_portfolio,
    service_get_portfolio,
    service_get_portfolios,
    service_update_portfolio,
)

router = APIRouter(
    prefix="/portfolios",
    tags=["Portfolios"],
    route_class=LoggedRoute,
)


@router.get("", response_model=PaginatedResponse[PortfolioResponse])
async def api_get_portfolios(
    page: int = Query(1, ge=1, description="페이지 번호"),
    per_page: int = Query(12, ge=1, le=100, description="페이지당 항목 수"),
    session: AsyncSession = Depends(get_db),
) -> PaginatedResponse[PortfolioResponse]:
    return await service_get_portfolios(session, page, per_page)


@router.get("/{uuid}", response_model=PortfolioResponse)
async def api_get_portfolio(
    portfolio_id: str = Depends(get_uuid_id), session: AsyncSession = Depends(get_db)
) -> PortfolioResponse:
    return await service_get_portfolio(session, portfolio_id)


@router.post("", response_model=PortfolioResponse, status_code=status.HTTP_201_CREATED)
async def api_create_portfolio(
    _: CurrentAdmin,
    title: str = Form(...),
    description: str = Form(...),
    category: str = Form(...),
    display_order: int = Form(0),
    visibility: str = Form(...),
    image: UploadFile = File(...),
    session: AsyncSession = Depends(get_db),
) -> PortfolioResponse:
    return await service_create_portfolio(
        session=session,
        title=title,
        description=description,
        category=category,
        display_order=display_order,
        visibility=visibility,
        image=image,
    )


@router.put("/{uuid}", response_model=PortfolioResponse)
async def api_update_portfolio(
    _: CurrentAdmin,
    portfolio_id: str = Depends(get_uuid_id),
    title: str | None = Form(None),
    description: str | None = Form(None),
    category: str | None = Form(None),
    display_order: int | None = Form(None),
    visibility: str | None = Form(None),
    image: UploadFile | None = File(None),
    session: AsyncSession = Depends(get_db),
) -> PortfolioResponse:
    return await service_update_portfolio(
        session=session,
        portfolio_id=portfolio_id,
        title=title,
        description=description,
        category=category,
        display_order=display_order,
        visibility=visibility,
        image=image,
    )


@router.delete("/{uuid}", status_code=status.HTTP_204_NO_CONTENT)
async def api_delete_portfolio(
    _: CurrentAdmin,
    portfolio_id: str = Depends(get_uuid_id),
    session: AsyncSession = Depends(get_db),
) -> None:
    await service_delete_portfolio(session, portfolio_id)
