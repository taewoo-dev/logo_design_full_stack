from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.auth.jwt_codec import JWTHandler, TokenType
from app.auth.password_hasher import PasswordHasher
from app.core.dependencies import CurrentSession
from app.dtos.auth import LoginRequest, TokenRefreshResponse, TokenResponse
from app.log.route import LoggedRoute
from app.models.user import User

router = APIRouter(
    prefix="/auth",
    tags=["Authentication"],
    route_class=LoggedRoute,
)


@router.post("/login", response_model=TokenResponse)
async def login(
    login_data: LoginRequest,
    session: AsyncSession = CurrentSession,
) -> TokenResponse:
    # Find user
    result = await session.execute(select(User).where(User.email == login_data.email))
    user = result.scalar_one_or_none()

    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
        )

    # Verify password
    if not PasswordHasher.verify_password(login_data.password, user.hashed_password):
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

    return TokenResponse(
        access_token=access_token,
        refresh_token=refresh_token,
    )


@router.post("/refresh", response_model=TokenRefreshResponse)
async def refresh_token(
    credentials: HTTPAuthorizationCredentials = Depends(HTTPBearer()),
) -> TokenRefreshResponse:
    try:
        # Verify refresh token
        payload = JWTHandler.decode_token(credentials.credentials)
        if payload.type != TokenType.REFRESH:
            raise ValueError("Not a refresh token")

        # Generate new access token
        access_token = JWTHandler.create_access_token(
            user_id=payload.sub,
            email=payload.email,
            role=payload.role,
        )

        return TokenRefreshResponse(access_token=access_token)

    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=str(e),
        )
