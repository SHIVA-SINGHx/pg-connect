"""
PGConnect API — Roommate Profile Pydantic Schemas.
"""

import uuid
from datetime import date, datetime
from pydantic import BaseModel, ConfigDict, Field

from app.models.roommate import (
    FoodPreference,
    Occupation,
    ProfileVisibility,
    SleepSchedule,
    SmokingPreference,
)
from app.schemas.user import UserRead


class RoommateProfileBase(BaseModel):
    bio: str | None = None
    occupation: Occupation | None = None
    company_or_college: str | None = None
    budget_min: int | None = Field(None, ge=0)
    budget_max: int | None = Field(None, ge=0)
    preferred_areas: list[str] = Field(default_factory=list)
    move_in_date: date | None = None
    move_in_flexible: bool = True
    food_preference: FoodPreference = FoodPreference.ANY
    sleep_schedule: SleepSchedule = SleepSchedule.FLEXIBLE
    smoking_preference: SmokingPreference = SmokingPreference.NO_SMOKING
    has_pets: bool = False
    ok_with_pets: bool = True
    is_discoverable: bool = True
    profile_visibility: ProfileVisibility = ProfileVisibility.PUBLIC


class RoommateProfileCreate(RoommateProfileBase):
    pass


class RoommateProfileUpdate(BaseModel):
    bio: str | None = None
    occupation: Occupation | None = None
    company_or_college: str | None = None
    budget_min: int | None = Field(None, ge=0)
    budget_max: int | None = Field(None, ge=0)
    preferred_areas: list[str] | None = None
    move_in_date: date | None = None
    move_in_flexible: bool | None = None
    food_preference: FoodPreference | None = None
    sleep_schedule: SleepSchedule | None = None
    smoking_preference: SmokingPreference | None = None
    has_pets: bool | None = None
    ok_with_pets: bool | None = None
    is_discoverable: bool | None = None
    profile_visibility: ProfileVisibility | None = None


class RoommateProfileRead(RoommateProfileBase):
    model_config = ConfigDict(from_attributes=True)

    id: uuid.UUID
    user_id: uuid.UUID
    created_at: datetime
    updated_at: datetime
    user: UserRead | None = None
