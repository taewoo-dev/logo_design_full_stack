from pydantic import BaseModel, EmailStr

from app.dtos.frozen_config import FROZEN_CONFIG


class LoginRequest(BaseModel):
    model_config = FROZEN_CONFIG

    email: EmailStr
    password: str
