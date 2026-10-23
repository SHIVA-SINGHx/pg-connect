"""
PGConnect API — Application Configuration
Reads from environment variables. Never hardcode credentials here.
"""

from functools import lru_cache
from typing import Literal

from pydantic import Field
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        case_sensitive=False,
        extra="ignore",
    )

    # ---- Application ----------------------------------------
    environment: Literal["development", "staging", "production"] = "development"
    api_secret_key: str = Field(..., description="Random 256-bit secret for signing")
    api_cors_origins: list[str] = ["http://localhost:3000"]

    # ---- Database -------------------------------------------
    database_url: str = Field(..., description="asyncpg connection URL for app")
    database_url_direct: str | None = None  # For Alembic migrations

    # ---- Redis ----------------------------------------------
    redis_url: str = "redis://localhost:6379/0"

    # ---- Supabase -------------------------------------------
    next_public_supabase_url: str = ""
    supabase_jwt_secret: str = Field(..., description="JWT secret from Supabase dashboard")
    supabase_service_role_key: str = ""
    supabase_storage_bucket_pg_media: str = "pg-media"

    # ---- Email (optional) -----------------------------------
    email_provider: str | None = None
    email_api_key: str | None = None
    email_from_address: str = "noreply@pgconnect.in"

    # ---- Pagination defaults --------------------------------
    default_page_size: int = 20
    max_page_size: int = 100


@lru_cache
def get_settings() -> Settings:
    return Settings()  # type: ignore[call-arg]
