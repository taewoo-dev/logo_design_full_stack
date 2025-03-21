from pydantic import BaseModel


class PortfolioUpdateRequest(BaseModel):
    title: str | None = None
    description: str | None = None
    category: str | None = None
    order: int | None = None
    is_visible: bool | None = None
