"""
PGConnect API — PG Listing and related domain models.
"""

import enum
import uuid
from datetime import date, datetime

from sqlalchemy import (
    Boolean, Date, DateTime, Enum, Float, ForeignKey,
    Integer, Numeric, String, Text, UniqueConstraint, func
)
from sqlalchemy.dialects.postgresql import ARRAY, UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db.session import Base


class ListingStatus(str, enum.Enum):
    DRAFT = "DRAFT"
    PENDING = "PENDING"
    ACTIVE = "ACTIVE"
    REJECTED = "REJECTED"
    SUSPENDED = "SUSPENDED"
    ARCHIVED = "ARCHIVED"


class AvailabilityStatus(str, enum.Enum):
    AVAILABLE = "AVAILABLE"
    PARTIALLY_AVAILABLE = "PARTIALLY_AVAILABLE"
    FULL = "FULL"


class GenderPreference(str, enum.Enum):
    ANY = "ANY"
    MALE = "MALE"
    FEMALE = "FEMALE"


class MediaType(str, enum.Enum):
    IMAGE = "IMAGE"
    VIDEO = "VIDEO"


class PGListing(Base):
    __tablename__ = "pg_listings"

    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    owner_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True
    )
    name: Mapped[str] = mapped_column(String(255), nullable=False)
    slug: Mapped[str] = mapped_column(String(300), unique=True, nullable=False, index=True)
    description: Mapped[str | None] = mapped_column(Text, nullable=True)
    area: Mapped[str] = mapped_column(String(255), nullable=False, index=True)
    address: Mapped[str] = mapped_column(Text, nullable=False)
    latitude: Mapped[float | None] = mapped_column(Float, nullable=True)
    longitude: Mapped[float | None] = mapped_column(Float, nullable=True)
    price_from: Mapped[int] = mapped_column(Integer, nullable=False, index=True)
    price_to: Mapped[int | None] = mapped_column(Integer, nullable=True)
    security_deposit: Mapped[int | None] = mapped_column(Integer, nullable=True)
    availability_status: Mapped[AvailabilityStatus] = mapped_column(
        Enum(AvailabilityStatus), nullable=False, default=AvailabilityStatus.AVAILABLE
    )
    available_from: Mapped[date | None] = mapped_column(Date, nullable=True)
    gender_preference: Mapped[GenderPreference] = mapped_column(
        Enum(GenderPreference), nullable=False, default=GenderPreference.ANY
    )
    status: Mapped[ListingStatus] = mapped_column(
        Enum(ListingStatus), nullable=False, default=ListingStatus.DRAFT, index=True
    )
    is_verified: Mapped[bool] = mapped_column(Boolean, default=False)
    house_rules: Mapped[str | None] = mapped_column(Text, nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now(), onupdate=func.now()
    )

    # Relationships
    media: Mapped[list["PGMedia"]] = relationship(
        "PGMedia", back_populates="listing", cascade="all, delete-orphan",
        order_by="PGMedia.sort_order"
    )
    room_types: Mapped[list["RoomType"]] = relationship(
        "RoomType", back_populates="listing", cascade="all, delete-orphan"
    )
    listing_amenities: Mapped[list["PGListingAmenity"]] = relationship(
        "PGListingAmenity", back_populates="listing", cascade="all, delete-orphan"
    )
    promotions: Mapped[list["ListingPromotion"]] = relationship(
        "ListingPromotion", back_populates="listing"
    )


class PGMedia(Base):
    __tablename__ = "pg_media"

    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    listing_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), ForeignKey("pg_listings.id", ondelete="CASCADE"), nullable=False, index=True
    )
    media_type: Mapped[MediaType] = mapped_column(Enum(MediaType), nullable=False, default=MediaType.IMAGE)
    storage_path: Mapped[str] = mapped_column(Text, nullable=False)
    sort_order: Mapped[int] = mapped_column(Integer, nullable=False, default=0)

    listing: Mapped["PGListing"] = relationship("PGListing", back_populates="media")


class RoomSharingType(str, enum.Enum):
    SINGLE = "SINGLE"
    TWIN = "TWIN"
    TRIPLE = "TRIPLE"
    FOUR_PLUS = "FOUR_PLUS"


class RoomType(Base):
    """Separate room options within a single PG listing."""
    __tablename__ = "room_types"

    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    listing_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), ForeignKey("pg_listings.id", ondelete="CASCADE"), nullable=False, index=True
    )
    sharing_type: Mapped[RoomSharingType] = mapped_column(Enum(RoomSharingType), nullable=False)
    price_per_month: Mapped[int] = mapped_column(Integer, nullable=False)
    total_beds: Mapped[int] = mapped_column(Integer, nullable=False, default=1)
    available_beds: Mapped[int] = mapped_column(Integer, nullable=False, default=1)

    listing: Mapped["PGListing"] = relationship("PGListing", back_populates="room_types")


class Amenity(Base):
    __tablename__ = "amenities"

    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    name: Mapped[str] = mapped_column(String(100), nullable=False)
    slug: Mapped[str] = mapped_column(String(100), unique=True, nullable=False, index=True)
    icon: Mapped[str | None] = mapped_column(String(100), nullable=True)

    listing_amenities: Mapped[list["PGListingAmenity"]] = relationship(
        "PGListingAmenity", back_populates="amenity"
    )


class PGListingAmenity(Base):
    __tablename__ = "pg_listing_amenities"
    __table_args__ = (UniqueConstraint("listing_id", "amenity_id"),)

    listing_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), ForeignKey("pg_listings.id", ondelete="CASCADE"), primary_key=True
    )
    amenity_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), ForeignKey("amenities.id", ondelete="CASCADE"), primary_key=True
    )

    listing: Mapped["PGListing"] = relationship("PGListing", back_populates="listing_amenities")
    amenity: Mapped["Amenity"] = relationship("Amenity", back_populates="listing_amenities")


class PromotionType(str, enum.Enum):
    SPONSORED = "SPONSORED"
    FEATURED = "FEATURED"


class PromotionStatus(str, enum.Enum):
    PENDING_PAYMENT = "PENDING_PAYMENT"
    ACTIVE = "ACTIVE"
    EXPIRED = "EXPIRED"
    CANCELLED = "CANCELLED"


class ListingPromotion(Base):
    __tablename__ = "listing_promotions"

    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    listing_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), ForeignKey("pg_listings.id", ondelete="CASCADE"), nullable=False, index=True
    )
    promotion_type: Mapped[PromotionType] = mapped_column(Enum(PromotionType), nullable=False)
    status: Mapped[PromotionStatus] = mapped_column(
        Enum(PromotionStatus), nullable=False, default=PromotionStatus.PENDING_PAYMENT
    )
    starts_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True), nullable=True)
    ends_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True), nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())

    listing: Mapped["PGListing"] = relationship("PGListing", back_populates="promotions")
