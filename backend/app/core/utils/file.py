import os
import uuid
from pathlib import Path
from typing import Optional

from fastapi import UploadFile

from app.core.configs import settings


async def save_upload_file(file: UploadFile, subdir: str) -> str:
    """
    업로드된 파일을 저장하고 URL을 반환합니다.

    Args:
        file: 업로드된 파일
        subdir: 저장할 하위 디렉토리 (예: "portfolios", "reviews")

    Returns:
        str: 저장된 파일의 URL
    """
    # 파일 확장자 추출
    ext = os.path.splitext(str(file.filename))[1]

    # 고유한 파일명 생성
    filename = f"{uuid.uuid4()}{ext}"

    # 저장 경로 생성
    upload_dir = Path(settings.UPLOAD_DIR) / subdir
    upload_dir.mkdir(parents=True, exist_ok=True)

    # 파일 저장
    file_path = upload_dir / filename
    content = await file.read()
    with open(file_path, "wb") as f:
        f.write(content)

    # URL 생성
    return f"/uploads/{subdir}/{filename}"


def delete_file(file_url: str) -> None:
    """
    파일 URL에 해당하는 파일을 삭제합니다.

    Args:
        file_url: 삭제할 파일의 URL
    """
    try:
        # URL에서 파일 경로 추출
        path = file_url.replace("/uploads", "")
        file_path = Path(settings.UPLOAD_DIR) / path.lstrip("/")

        # 파일이 존재하면 삭제
        if file_path.exists():
            file_path.unlink()
    except Exception:
        # 파일 삭제 실패 시 무시
        pass


def get_file_extension(filename: str) -> Optional[str]:
    """
    파일명에서 확장자를 추출합니다.

    Args:
        filename: 파일명

    Returns:
        Optional[str]: 확장자 (점 포함) 또는 None
    """
    return os.path.splitext(filename)[1] if filename else None


def is_allowed_file(filename: str) -> bool:
    """
    파일이 허용된 확장자인지 확인합니다.

    Args:
        filename: 파일명

    Returns:
        bool: 허용된 파일이면 True, 아니면 False
    """
    ALLOWED_EXTENSIONS = {".jpg", ".jpeg", ".png", ".gif", ".webp"}
    ext = get_file_extension(filename)
    return ext.lower() in ALLOWED_EXTENSIONS if ext else False
