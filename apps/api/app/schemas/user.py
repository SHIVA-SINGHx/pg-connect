"""
PGConnect API — User and Identity Pydantic Schemas.
"""

import uuid
from datetime import datetime
from pydantic import BaseModel, ConfigDict, EmailStr

from app.models.user import AccountStatus, UserRole


class UserBase(BaseModel):
    name: str
    email: EmailStr
    phone: str | None = None
    avatar_url: str | None = None
    role: UserRole = UserRole.USER


class UserCreate(UserBase):
    auth_user_id: str


class UserUpdate(BaseModel):
    name: str | None = None
    phone: str | None = None
    avatar_url: str | None = None
    role: UserRole | None = None


class UserRead(UserBase):
    model_config = ConfigDict(from_attributes=True)

    id: uuid.UUID
    auth_user_id: str
    account_status: AccountStatus
    is_email_verified: bool
    created_at: datetime
    updated_at: datetime
