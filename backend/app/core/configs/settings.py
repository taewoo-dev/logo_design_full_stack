import os
from enum import StrEnum
from pathlib import Path
from typing import List

from pydantic_settings import BaseSettings, SettingsConfigDict


class Env(StrEnum):
    LOCAL = "local"
    STAGE = "stage"
    PROD = "prod"


class Settings(BaseSettings):
    # Environment
    ENV: Env = Env.LOCAL
    LOG_PATH: Path = Path(__file__).resolve().parent.parent.parent / "log/app.log"

    # Database
    DB_HOST: str = "localhost"
    DB_PORT: int = 3307
    DB_USER: str = "root"
    DB_PASSWORD: str = "password"
    DB_NAME: str = "logo_design_db"

    # JWT
    JWT_SECRET_KEY: str = "your-secret-key-here"
    JWT_ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    REFRESH_TOKEN_EXPIRE_DAYS: int = 7

    # CORS
    CORS_ORIGINS: str = "http://localhost:3000,http://127.0.0.1:3000"

    # File Upload
    UPLOAD_DIR: Path = Path(__file__).resolve().parent.parent.parent.parent / "uploads"
    MAX_UPLOAD_SIZE: int = 10 * 1024 * 1024  # 10MB

    # Debug
    DEBUG: bool = True

    model_config = SettingsConfigDict(
        env_file=f".env.{os.getenv('ENV', 'local')}",
        env_file_encoding="utf-8",
        case_sensitive=True,
    )

    @property
    def database_url(self) -> str:
        return f"mysql+asyncmy://{self.DB_USER}:{self.DB_PASSWORD}@{self.DB_HOST}:{self.DB_PORT}/{self.DB_NAME}"
    
    @property
    def cors_origin_list(self) -> List[str]:
        return [origin.strip() for origin in self.CORS_ORIGINS.split(",")]


settings = Settings()
