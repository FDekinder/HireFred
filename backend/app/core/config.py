from pydantic_settings import BaseSettings
from typing import Optional

class Settings(BaseSettings):
    PROJECT_NAME: str = "ReleaseNoteHub"
    DATABASE_URL: str = "sqlite:///./releasenotes.db"
    SECRET_KEY: str = "your-secret-key-change-in-production-min-32-chars!"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24 * 7  # 7 days

    class Config:
        env_file = ".env"

settings = Settings()
