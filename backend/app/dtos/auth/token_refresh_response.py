from pydantic import BaseModel


class TokenRefreshResponse(BaseModel):
    access_token: str
