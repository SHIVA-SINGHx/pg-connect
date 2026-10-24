"""
PGConnect API — PG Listing Pydantic Schemas.
"""

import uuid
from datetime import date, datetime
from pydantic import BaseModel, ConfigDict, Field

from app.models.listing import (
    AvailabilityStatus,
    GenderPreference,
    ListingStatus,
    MediaType,
    RoomSharingType,
)


class AmenityRead(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: uuid.UUID
    name: str
    slug: str
    icon: str | None = None


class PGMediaRead(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: uuid.UUID
    media_type: MediaType
    storage_path: str
    sort_order: int


class PGMediaCreate(BaseModel):
    media_type: MediaType = MediaType.IMAGE
    storage_path: str
    sort_order: int = 0


class RoomTypeRead(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: uuid.UUID
    sharing_type: RoomSharingType
    price_per_month: int
    total_beds: int
    available_beds: int


class RoomTypeCreate(BaseModel):
    sharing_type: RoomSharingType
    price_per_month: int
    total_beds: int = 1
    available_beds: int = 1


class PGListingBase(BaseModel):
    name: str
    description: str | None = None
    area: str
    address: str
    latitude: float | None = None
    longitude: float | None = None
    price_from: int = Field(..., ge=0)
    price_to: int | None = Field(None, ge=0)
    security_deposit: int | None = Field(None, ge=0)
    gender_preference: GenderPreference = GenderPreference.ANY
    house_rules: str | None = None
    available_from: date | None = None


class PGListingCreate(PGListingBase):
    room_types: list[RoomTypeCreate] = Field(default_factory=list)
    amenity_ids: list[uuid.UUID] = Field(default_factory=list)
    media: list[PGMediaCreate] = Field(default_factory=list)


class PGListingUpdate(BaseModel):
    name: str | None = None
    description: str | None = None
    area: str | None = None
    address: str | None = None
    latitude: float | None = None
    longitude: float | None = None
    price_from: int | None = Field(None, ge=0)
    price_to: int | None = Field(None, ge=0)
    security_deposit: int | None = Field(None, ge=0)
    gender_preference: GenderPreference | None = None
    house_rules: str | None = None
    available_from: date | None = None
    status: ListingStatus | None = None


class PGListingRead(PGListingBase):
    model_config = ConfigDict(from_attributes=True)

    id: uuid.UUID
    slug: str
    owner_id: uuid.UUID
    availability_status: AvailabilityStatus
    status: ListingStatus
    is_verified: bool
    created_at: datetime
    updated_at: datetime
    media: list[PGMediaRead] = Field(default_factory=list)
    room_types: list[RoomTypeRead] = Field(default_factory=list)


class PGListingSearchResult(BaseModel):
    items: list[PGListingRead]
    total: int
    page: int
    page_size: int
    pages: int
