"""
PGConnect API — Model registry.
Import all models here so Alembic autogenerate detects them.
"""

from app.models.user import User, UserRole, AccountStatus  # noqa: F401
from app.models.listing import (  # noqa: F401
    PGListing, PGMedia, RoomType, Amenity, PGListingAmenity,
    ListingPromotion, ListingStatus, AvailabilityStatus,
    GenderPreference, MediaType, RoomSharingType,
    PromotionType, PromotionStatus,
)
from app.models.roommate import (  # noqa: F401
    RoommateProfile, Occupation, FoodPreference,
    SleepSchedule, SmokingPreference, ProfileVisibility,
)
from app.models.interactions import (  # noqa: F401
    SavedPG, Interest, InterestStatus,
    Connection, ConnectionStatus,
    Conversation, ConversationParticipant, Message,
    Notification, NotificationDelivery, NotificationType,
    DeliveryChannel, DeliveryStatus,
    Report, ReportReason,
)
