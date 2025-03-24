from uuid import UUID

from fastapi import HTTPException, Path, status


async def get_uuid_id(uuid: str = Path(...)) -> str:
    try:
        return str(UUID(uuid))
    except ValueError:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid UUID format",
        )


async def get_uuid_str(
    id_str: str,
) -> str:
    try:
        uuid_id = UUID(id_str)
        return str(uuid_id)
    except ValueError:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid UUID format",
        )
