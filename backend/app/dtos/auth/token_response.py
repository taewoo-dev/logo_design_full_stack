from pydantic import BaseModel

from app.dtos.frozen_config import FROZEN_CONFIG


class TokenResponse(BaseModel):
    model_config = FROZEN_CONFIG

    access_token: str
    refresh_token: str
    token_type: str = "bearer"
