"""
PGConnect API — Roommate profile and lifestyle preferences.
"""

import enum
import uuid
from datetime import date, datetime

from sqlalchemy import (
    Boolean, Date, DateTime, Enum, ForeignKey,
    Integer, String, Text, func
)
from sqlalchemy.dialects.postgresql import ARRAY, UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db.session import Base


class Occupation(str, enum.Enum):
    STUDENT = "STUDENT"
    WORKING_PROFESSIONAL = "WORKING_PROFESSIONAL"
    SELF_EMPLOYED = "SELF_EMPLOYED"
    OTHER = "OTHER"


class FoodPreference(str, enum.Enum):
    VEGETARIAN = "VEGETARIAN"
    NON_VEGETARIAN = "NON_VEGETARIAN"
    EGGETARIAN = "EGGETARIAN"
    ANY = "ANY"


class SleepSchedule(str, enum.Enum):
    EARLY_BIRD = "EARLY_BIRD"
    NIGHT_OWL = "NIGHT_OWL"
    FLEXIBLE = "FLEXIBLE"


class SmokingPreference(str, enum.Enum):
    NO_SMOKING = "NO_SMOKING"
    OUTSIDE_ONLY = "OUTSIDE_ONLY"
    OK_WITH_SMOKING = "OK_WITH_SMOKING"


class ProfileVisibility(str, enum.Enum):
    PUBLIC = "PUBLIC"      # Visible to all logged-in users
    CONNECTIONS = "CONNECTIONS"  # Visible only to accepted connections
    HIDDEN = "HIDDEN"


class RoommateProfile(Base):
    __tablename__ = "roommate_profiles"

    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"),
        nullable=False, unique=True, index=True
    )
    bio: Mapped[str | None] = mapped_column(Text, nullable=True)
    occupation: Mapped[Occupation | None] = mapped_column(Enum(Occupation), nullable=True)
    company_or_college: Mapped[str | None] = mapped_column(String(255), nullable=True)

    # Budget preferences
    budget_min: Mapped[int | None] = mapped_column(Integer, nullable=True)
    budget_max: Mapped[int | None] = mapped_column(Integer, nullable=True)

    # Location preferences (comma-separated area slugs, stored as text array)
    preferred_areas: Mapped[list[str] | None] = mapped_column(ARRAY(String), nullable=True)

    # Move-in preference
    move_in_date: Mapped[date | None] = mapped_column(Date, nullable=True)
    move_in_flexible: Mapped[bool] = mapped_column(Boolean, default=True)

    # Lifestyle
    food_preference: Mapped[FoodPreference] = mapped_column(
        Enum(FoodPreference), nullable=False, default=FoodPreference.ANY
    )
    sleep_schedule: Mapped[SleepSchedule] = mapped_column(
        Enum(SleepSchedule), nullable=False, default=SleepSchedule.FLEXIBLE
    )
    smoking_preference: Mapped[SmokingPreference] = mapped_column(
        Enum(SmokingPreference), nullable=False, default=SmokingPreference.NO_SMOKING
    )
    has_pets: Mapped[bool] = mapped_column(Boolean, default=False)
    ok_with_pets: Mapped[bool] = mapped_column(Boolean, default=True)

    # Discoverability
    is_discoverable: Mapped[bool] = mapped_column(Boolean, default=True, index=True)
    profile_visibility: Mapped[ProfileVisibility] = mapped_column(
        Enum(ProfileVisibility), nullable=False, default=ProfileVisibility.PUBLIC
    )

    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now(), onupdate=func.now()
    )
