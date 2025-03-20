from fastapi import APIRouter

from app.log.route import LoggedRoute

router = APIRouter(
    prefix="/health",
    tags=["Health"],
    route_class=LoggedRoute,
)


@router.get("")
async def health_check() -> dict[str, str]:
    return {"status": "ok"}
