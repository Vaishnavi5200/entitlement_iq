from pydantic_settings import BaseSettings
from typing import Optional

class Settings(BaseSettings):
    PROJECT_NAME: str = "EntitlementIQ Backend"
    DATABASE_URL: str = "sqlite:///./entitlementiq.db"
    ANTHROPIC_API_KEY: Optional[str] = None
    CORS_ORIGINS: list[str] = ["http://localhost:5173", "http://127.0.0.1:5173", "http://localhost:3000"]

    class Config:
        env_file = ".env"
        extra = "ignore"

settings = Settings()
