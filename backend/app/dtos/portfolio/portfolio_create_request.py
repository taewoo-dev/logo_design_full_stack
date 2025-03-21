from pydantic import BaseModel


class PortfolioCreateRequest(BaseModel):
    title: str
    description: str
    category: str
    order: int = 0
    is_visible: bool = True
