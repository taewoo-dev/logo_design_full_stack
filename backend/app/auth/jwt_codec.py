from datetime import datetime, timedelta, timezone
from enum import StrEnum

import jwt
from pydantic import BaseModel

from app.core.configs import settings


class UserRole(StrEnum):
    ADMIN = "ADMIN"
    USER = "USER"


class TokenType(StrEnum):
    ACCESS = "access"
    REFRESH = "refresh"


class JWTPayload(BaseModel):
    sub: str  # user_id
    email: str
    role: UserRole
    type: TokenType
    exp: datetime


class JWTHandler:
    @classmethod
    def create_access_token(
        cls,
        user_id: str,
        email: str,
        role: UserRole,
    ) -> str:
        return cls._create_token(
            user_id=user_id,
            email=email,
            role=role,
            token_type=TokenType.ACCESS,
            expires_delta=timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES),
        )

    @classmethod
    def create_refresh_token(
        cls,
        user_id: str,
        email: str,
        role: UserRole,
    ) -> str:
        return cls._create_token(
            user_id=user_id,
            email=email,
            role=role,
            token_type=TokenType.REFRESH,
            expires_delta=timedelta(days=settings.REFRESH_TOKEN_EXPIRE_DAYS),
        )

    @classmethod
    def _create_token(
        cls,
        user_id: str,
        email: str,
        role: UserRole,
        token_type: TokenType,
        expires_delta: timedelta,
    ) -> str:
        expire = datetime.now(timezone.utc) + expires_delta
        payload = JWTPayload(
            sub=user_id,
            email=email,
            role=role,
            type=token_type,
            exp=expire,
        )

        return jwt.encode(
            payload.model_dump(),
            settings.JWT_SECRET_KEY,
            algorithm=settings.JWT_ALGORITHM,
        )

    @classmethod
    def decode_token(
        cls,
        token: str,
        verify_exp: bool = True,
    ) -> JWTPayload:
        try:
            payload = jwt.decode(
                token,
                settings.JWT_SECRET_KEY,
                algorithms=[settings.JWT_ALGORITHM],
                options={"verify_exp": verify_exp},
            )
            return JWTPayload(**payload)
        except jwt.ExpiredSignatureError:
            raise ValueError("Token has expired")
        except jwt.InvalidTokenError:
            raise ValueError("Invalid token")
