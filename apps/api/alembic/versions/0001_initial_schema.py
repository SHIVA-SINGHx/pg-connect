"""initial schema for users, listings, roommate profiles, and interactions

Revision ID: 0001_initial_schema
Revises: 
Create Date: 2026-10-25 20:30:00.000000

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

# revision identifiers, used by Alembic.
revision: str = "0001_initial_schema"
down_revision: Union[str, None] = None
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # 1. users
    op.create_table(
        "users",
        sa.Column("id", postgresql.UUID(as_uuid=True), primary_key=True),
        sa.Column("auth_user_id", sa.String(length=128), nullable=False, unique=True),
        sa.Column("email", sa.String(length=255), nullable=False, unique=True),
        sa.Column("name", sa.String(length=255), nullable=False),
        sa.Column("phone", sa.String(length=20), nullable=True),
        sa.Column("avatar_url", sa.String(length=512), nullable=True),
        sa.Column("role", sa.Enum("USER", "PG_OWNER", "ADMIN", name="userrole"), nullable=False, server_default="USER"),
        sa.Column("account_status", sa.Enum("ACTIVE", "SUSPENDED", "DELETED", name="accountstatus"), nullable=False, server_default="ACTIVE"),
        sa.Column("is_email_verified", sa.Boolean(), nullable=False, server_default=sa.text("false")),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False),
        sa.Column("updated_at", sa.DateTime(timezone=True), server_default=sa.func.now(), onupdate=sa.func.now(), nullable=False),
    )
    op.create_index("ix_users_auth_user_id", "users", ["auth_user_id"])
    op.create_index("ix_users_email", "users", ["email"])

    # 2. amenities
    op.create_table(
        "amenities",
        sa.Column("id", postgresql.UUID(as_uuid=True), primary_key=True),
        sa.Column("name", sa.String(length=100), nullable=False, unique=True),
        sa.Column("slug", sa.String(length=100), nullable=False, unique=True),
        sa.Column("icon", sa.String(length=50), nullable=True),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False),
    )
    op.create_index("ix_amenities_slug", "amenities", ["slug"])

    # 3. pg_listings
    op.create_table(
        "pg_listings",
        sa.Column("id", postgresql.UUID(as_uuid=True), primary_key=True),
        sa.Column("owner_id", postgresql.UUID(as_uuid=True), sa.ForeignKey("users.id", ondelete="CASCADE"), nullable=False),
        sa.Column("name", sa.String(length=255), nullable=False),
        sa.Column("slug", sa.String(length=255), nullable=False, unique=True),
        sa.Column("description", sa.Text(), nullable=True),
        sa.Column("area", sa.String(length=100), nullable=False),
        sa.Column("address", sa.Text(), nullable=False),
        sa.Column("latitude", sa.Float(), nullable=True),
        sa.Column("longitude", sa.Float(), nullable=True),
        sa.Column("price_from", sa.Integer(), nullable=False),
        sa.Column("price_to", sa.Integer(), nullable=True),
        sa.Column("security_deposit", sa.Integer(), nullable=True),
        sa.Column("gender_preference", sa.Enum("ANY", "MALE", "FEMALE", name="genderpreference"), nullable=False, server_default="ANY"),
        sa.Column("availability_status", sa.Enum("AVAILABLE", "PARTIALLY_AVAILABLE", "FULL", name="availabilitystatus"), nullable=False, server_default="AVAILABLE"),
        sa.Column("status", sa.Enum("DRAFT", "PENDING", "ACTIVE", "REJECTED", "SUSPENDED", "ARCHIVED", name="listingstatus"), nullable=False, server_default="PENDING"),
        sa.Column("house_rules", sa.Text(), nullable=True),
        sa.Column("available_from", sa.Date(), nullable=True),
        sa.Column("is_verified", sa.Boolean(), nullable=False, server_default=sa.text("false")),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False),
        sa.Column("updated_at", sa.DateTime(timezone=True), server_default=sa.func.now(), onupdate=sa.func.now(), nullable=False),
    )
    op.create_index("ix_pg_listings_owner_id", "pg_listings", ["owner_id"])
    op.create_index("ix_pg_listings_name", "pg_listings", ["name"])
    op.create_index("ix_pg_listings_slug", "pg_listings", ["slug"])
    op.create_index("ix_pg_listings_area", "pg_listings", ["area"])

    # 4. room_types
    op.create_table(
        "room_types",
        sa.Column("id", postgresql.UUID(as_uuid=True), primary_key=True),
        sa.Column("listing_id", postgresql.UUID(as_uuid=True), sa.ForeignKey("pg_listings.id", ondelete="CASCADE"), nullable=False),
        sa.Column("sharing_type", sa.Enum("SINGLE", "TWIN", "TRIPLE", "FOUR_PLUS", name="roomsharingtype"), nullable=False),
        sa.Column("price_per_month", sa.Integer(), nullable=False),
        sa.Column("total_beds", sa.Integer(), nullable=False, server_default="1"),
        sa.Column("available_beds", sa.Integer(), nullable=False, server_default="1"),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False),
    )
    op.create_index("ix_room_types_listing_id", "room_types", ["listing_id"])

    # 5. pg_media
    op.create_table(
        "pg_media",
        sa.Column("id", postgresql.UUID(as_uuid=True), primary_key=True),
        sa.Column("listing_id", postgresql.UUID(as_uuid=True), sa.ForeignKey("pg_listings.id", ondelete="CASCADE"), nullable=False),
        sa.Column("media_type", sa.Enum("IMAGE", "VIDEO", "FLOOR_PLAN", name="mediatype"), nullable=False, server_default="IMAGE"),
        sa.Column("storage_path", sa.String(length=512), nullable=False),
        sa.Column("sort_order", sa.Integer(), nullable=False, server_default="0"),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False),
    )
    op.create_index("ix_pg_media_listing_id", "pg_media", ["listing_id"])

    # 6. pg_listing_amenities
    op.create_table(
        "pg_listing_amenities",
        sa.Column("listing_id", postgresql.UUID(as_uuid=True), sa.ForeignKey("pg_listings.id", ondelete="CASCADE"), primary_key=True),
        sa.Column("amenity_id", postgresql.UUID(as_uuid=True), sa.ForeignKey("amenities.id", ondelete="CASCADE"), primary_key=True),
    )

    # 7. listing_promotions
    op.create_table(
        "listing_promotions",
        sa.Column("id", postgresql.UUID(as_uuid=True), primary_key=True),
        sa.Column("listing_id", postgresql.UUID(as_uuid=True), sa.ForeignKey("pg_listings.id", ondelete="CASCADE"), nullable=False),
        sa.Column("promotion_type", sa.Enum("FEATURED", "URGENT", name="promotiontype"), nullable=False),
        sa.Column("status", sa.Enum("ACTIVE", "EXPIRED", "PENDING", name="promotionstatus"), nullable=False, server_default="PENDING"),
        sa.Column("starts_at", sa.DateTime(timezone=True), nullable=False),
        sa.Column("ends_at", sa.DateTime(timezone=True), nullable=False),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False),
    )
    op.create_index("ix_listing_promotions_listing_id", "listing_promotions", ["listing_id"])

    # 8. roommate_profiles
    op.create_table(
        "roommate_profiles",
        sa.Column("id", postgresql.UUID(as_uuid=True), primary_key=True),
        sa.Column("user_id", postgresql.UUID(as_uuid=True), sa.ForeignKey("users.id", ondelete="CASCADE"), nullable=False, unique=True),
        sa.Column("bio", sa.Text(), nullable=True),
        sa.Column("occupation", sa.Enum("STUDENT", "WORKING_PROFESSIONAL", "SELF_EMPLOYED", "OTHER", name="occupation"), nullable=True),
        sa.Column("company_or_college", sa.String(length=255), nullable=True),
        sa.Column("budget_min", sa.Integer(), nullable=True),
        sa.Column("budget_max", sa.Integer(), nullable=True),
        sa.Column("preferred_areas", postgresql.ARRAY(sa.String()), nullable=True),
        sa.Column("move_in_date", sa.Date(), nullable=True),
        sa.Column("move_in_flexible", sa.Boolean(), nullable=False, server_default=sa.text("true")),
        sa.Column("food_preference", sa.Enum("VEGETARIAN", "NON_VEGETARIAN", "EGGETARIAN", "ANY", name="foodpreference"), nullable=False, server_default="ANY"),
        sa.Column("sleep_schedule", sa.Enum("EARLY_BIRD", "NIGHT_OWL", "FLEXIBLE", name="sleepschedule"), nullable=False, server_default="FLEXIBLE"),
        sa.Column("smoking_preference", sa.Enum("NO_SMOKING", "OUTSIDE_ONLY", "OK_WITH_SMOKING", name="smokingpreference"), nullable=False, server_default="NO_SMOKING"),
        sa.Column("has_pets", sa.Boolean(), nullable=False, server_default=sa.text("false")),
        sa.Column("ok_with_pets", sa.Boolean(), nullable=False, server_default=sa.text("true")),
        sa.Column("is_discoverable", sa.Boolean(), nullable=False, server_default=sa.text("true")),
        sa.Column("profile_visibility", sa.Enum("PUBLIC", "CONNECTIONS", "HIDDEN", name="profilevisibility"), nullable=False, server_default="PUBLIC"),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False),
        sa.Column("updated_at", sa.DateTime(timezone=True), server_default=sa.func.now(), onupdate=sa.func.now(), nullable=False),
    )
    op.create_index("ix_roommate_profiles_user_id", "roommate_profiles", ["user_id"])
    op.create_index("ix_roommate_profiles_is_discoverable", "roommate_profiles", ["is_discoverable"])

    # 9. saved_pgs
    op.create_table(
        "saved_pgs",
        sa.Column("user_id", postgresql.UUID(as_uuid=True), sa.ForeignKey("users.id", ondelete="CASCADE"), primary_key=True),
        sa.Column("listing_id", postgresql.UUID(as_uuid=True), sa.ForeignKey("pg_listings.id", ondelete="CASCADE"), primary_key=True),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False),
    )

    # 10. interests
    op.create_table(
        "interests",
        sa.Column("id", postgresql.UUID(as_uuid=True), primary_key=True),
        sa.Column("user_id", postgresql.UUID(as_uuid=True), sa.ForeignKey("users.id", ondelete="CASCADE"), nullable=False),
        sa.Column("listing_id", postgresql.UUID(as_uuid=True), sa.ForeignKey("pg_listings.id", ondelete="CASCADE"), nullable=False),
        sa.Column("status", sa.Enum("PENDING", "ACCEPTED", "REJECTED", name="intereststatus"), nullable=False, server_default="PENDING"),
        sa.Column("message", sa.Text(), nullable=True),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False),
    )
    op.create_index("ix_interests_user_id", "interests", ["user_id"])
    op.create_index("ix_interests_listing_id", "interests", ["listing_id"])

    # 11. connections
    op.create_table(
        "connections",
        sa.Column("id", postgresql.UUID(as_uuid=True), primary_key=True),
        sa.Column("sender_id", postgresql.UUID(as_uuid=True), sa.ForeignKey("users.id", ondelete="CASCADE"), nullable=False),
        sa.Column("receiver_id", postgresql.UUID(as_uuid=True), sa.ForeignKey("users.id", ondelete="CASCADE"), nullable=False),
        sa.Column("status", sa.Enum("PENDING", "ACCEPTED", "REJECTED", "BLOCKED", name="connectionstatus"), nullable=False, server_default="PENDING"),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False),
        sa.Column("updated_at", sa.DateTime(timezone=True), server_default=sa.func.now(), onupdate=sa.func.now(), nullable=False),
    )
    op.create_index("ix_connections_sender_id", "connections", ["sender_id"])
    op.create_index("ix_connections_receiver_id", "connections", ["receiver_id"])

    # 12. conversations
    op.create_table(
        "conversations",
        sa.Column("id", postgresql.UUID(as_uuid=True), primary_key=True),
        sa.Column("listing_id", postgresql.UUID(as_uuid=True), sa.ForeignKey("pg_listings.id", ondelete="SET NULL"), nullable=True),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False),
    )

    # 13. conversation_participants
    op.create_table(
        "conversation_participants",
        sa.Column("conversation_id", postgresql.UUID(as_uuid=True), sa.ForeignKey("conversations.id", ondelete="CASCADE"), primary_key=True),
        sa.Column("user_id", postgresql.UUID(as_uuid=True), sa.ForeignKey("users.id", ondelete="CASCADE"), primary_key=True),
        sa.Column("last_read_at", sa.DateTime(timezone=True), nullable=True),
    )

    # 14. messages
    op.create_table(
        "messages",
        sa.Column("id", postgresql.UUID(as_uuid=True), primary_key=True),
        sa.Column("conversation_id", postgresql.UUID(as_uuid=True), sa.ForeignKey("conversations.id", ondelete="CASCADE"), nullable=False),
        sa.Column("sender_id", postgresql.UUID(as_uuid=True), sa.ForeignKey("users.id", ondelete="CASCADE"), nullable=False),
        sa.Column("body", sa.Text(), nullable=False),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False),
    )
    op.create_index("ix_messages_conversation_id", "messages", ["conversation_id"])
    op.create_index("ix_messages_sender_id", "messages", ["sender_id"])
    op.create_index("ix_messages_created_at", "messages", ["created_at"])

    # 15. notifications
    op.create_table(
        "notifications",
        sa.Column("id", postgresql.UUID(as_uuid=True), primary_key=True),
        sa.Column("user_id", postgresql.UUID(as_uuid=True), sa.ForeignKey("users.id", ondelete="CASCADE"), nullable=False),
        sa.Column("type", sa.Enum("CONNECTION_REQUEST", "CONNECTION_ACCEPTED", "NEW_MESSAGE", "INTEREST_RECEIVED", "LISTING_APPROVED", "LISTING_REJECTED", "SYSTEM", name="notificationtype"), nullable=False),
        sa.Column("title", sa.String(length=255), nullable=False),
        sa.Column("body", sa.Text(), nullable=False),
        sa.Column("resource_type", sa.String(length=50), nullable=True),
        sa.Column("resource_id", sa.String(length=128), nullable=True),
        sa.Column("read_at", sa.DateTime(timezone=True), nullable=True),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False),
    )
    op.create_index("ix_notifications_user_id", "notifications", ["user_id"])
    op.create_index("ix_notifications_created_at", "notifications", ["created_at"])

    # 16. notification_deliveries
    op.create_table(
        "notification_deliveries",
        sa.Column("id", postgresql.UUID(as_uuid=True), primary_key=True),
        sa.Column("notification_id", postgresql.UUID(as_uuid=True), sa.ForeignKey("notifications.id", ondelete="CASCADE"), nullable=False),
        sa.Column("channel", sa.Enum("IN_APP", "EMAIL", "WHATSAPP", name="deliverychannel"), nullable=False),
        sa.Column("status", sa.Enum("PENDING", "SENT", "FAILED", name="deliverystatus"), nullable=False, server_default="PENDING"),
        sa.Column("sent_at", sa.DateTime(timezone=True), nullable=True),
        sa.Column("error_message", sa.Text(), nullable=True),
    )
    op.create_index("ix_notification_deliveries_notification_id", "notification_deliveries", ["notification_id"])

    # 17. reports
    op.create_table(
        "reports",
        sa.Column("id", postgresql.UUID(as_uuid=True), primary_key=True),
        sa.Column("reporter_id", postgresql.UUID(as_uuid=True), sa.ForeignKey("users.id", ondelete="CASCADE"), nullable=False),
        sa.Column("reported_user_id", postgresql.UUID(as_uuid=True), sa.ForeignKey("users.id", ondelete="SET NULL"), nullable=True),
        sa.Column("reported_listing_id", postgresql.UUID(as_uuid=True), sa.ForeignKey("pg_listings.id", ondelete="SET NULL"), nullable=True),
        sa.Column("reason", sa.Enum("SPAM", "HARASSMENT", "FRAUD", "INAPPROPRIATE_CONTENT", "OTHER", name="reportreason"), nullable=False),
        sa.Column("details", sa.Text(), nullable=True),
        sa.Column("resolved_at", sa.DateTime(timezone=True), nullable=True),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False),
    )
    op.create_index("ix_reports_reporter_id", "reports", ["reporter_id"])


def downgrade() -> None:
    op.drop_table("reports")
    op.drop_table("notification_deliveries")
    op.drop_table("notifications")
    op.drop_table("messages")
    op.drop_table("conversation_participants")
    op.drop_table("conversations")
    op.drop_table("connections")
    op.drop_table("interests")
    op.drop_table("saved_pgs")
    op.drop_table("roommate_profiles")
    op.drop_table("listing_promotions")
    op.drop_table("pg_listing_amenities")
    op.drop_table("pg_media")
    op.drop_table("room_types")
    op.drop_table("pg_listings")
    op.drop_table("amenities")
    op.drop_table("users")
