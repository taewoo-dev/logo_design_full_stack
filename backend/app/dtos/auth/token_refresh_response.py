from pydantic import BaseModel

from app.dtos.frozen_config import FROZEN_CONFIG


class TokenRefreshResponse(BaseModel):
    model_config = FROZEN_CONFIG

    access_token: str
