from typing import Annotated

from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer

from app.auth.jwt_codec import JWTHandler, JWTPayload, UserRole

security = HTTPBearer()


async def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security)) -> JWTPayload:
    """현재 인증된 사용자의 정보를 반환합니다."""
    try:
        payload = JWTHandler.decode_token(credentials.credentials)
        return payload
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=str(e),
            headers={"WWW-Authenticate": "Bearer"},
        )


async def get_current_admin(current_user: Annotated[JWTPayload, Depends(get_current_user)]) -> JWTPayload:
    """현재 사용자가 관리자인지 확인합니다."""
    if current_user.role != UserRole.ADMIN:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not enough permissions",
        )
    return current_user


# Dependency shortcuts
CurrentUser = Annotated[JWTPayload, Depends(get_current_user)]
CurrentAdmin = Annotated[JWTPayload, Depends(get_current_admin)]
