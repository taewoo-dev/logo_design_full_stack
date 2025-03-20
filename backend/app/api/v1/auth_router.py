from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from pydantic import BaseModel
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.auth.jwt_codec import JWTHandler, TokenType
from app.auth.password_hasher import PasswordHasher
from app.core.dependencies import CurrentSession
from app.log.route import LoggedRoute
from app.models.user import User


class Token(BaseModel):
    access_token: str
    refresh_token: str
    token_type: str = "bearer"


class TokenPayload(BaseModel):
    access_token: str


router = APIRouter(
    prefix="/auth",
    tags=["Authentication"],
    route_class=LoggedRoute,
)


@router.post("/login", response_model=Token)
async def login(
    form_data: OAuth2PasswordRequestForm = Depends(),
    session: AsyncSession = CurrentSession,
) -> Token:
    # Find user
    result = await session.execute(select(User).where(User.email == form_data.username))
    user = result.scalar_one_or_none()

    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
        )

    # Verify password
    if not PasswordHasher.verify_password(form_data.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
        )

    # Generate tokens
    access_token = JWTHandler.create_access_token(
        user_id=str(user.id),
        email=user.email,
        role=user.role,
    )
    refresh_token = JWTHandler.create_refresh_token(
        user_id=str(user.id),
        email=user.email,
        role=user.role,
    )

    return Token(
        access_token=access_token,
        refresh_token=refresh_token,
    )


@router.post("/refresh", response_model=TokenPayload)
async def refresh_token(
    current_token: str = Depends(OAuth2PasswordRequestForm),
) -> TokenPayload:
    try:
        # Verify refresh token
        payload = JWTHandler.decode_token(current_token)
        if payload.type != TokenType.REFRESH:
            raise ValueError("Not a refresh token")

        # Generate new access token
        access_token = JWTHandler.create_access_token(
            user_id=payload.sub,
            email=payload.email,
            role=payload.role,
        )

        return TokenPayload(access_token=access_token)

    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=str(e),
        )
