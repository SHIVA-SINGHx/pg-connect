"""
PGConnect API — Interaction Pydantic Schemas.
"""

import uuid
from datetime import datetime
from pydantic import BaseModel, ConfigDict, Field

from app.models.interactions import (
    ConnectionStatus,
    InterestStatus,
    NotificationType,
    ReportReason,
)


class SavedPGRead(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    user_id: uuid.UUID
    listing_id: uuid.UUID
    created_at: datetime


class InterestCreate(BaseModel):
    message: str | None = None


class InterestRead(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: uuid.UUID
    user_id: uuid.UUID
    listing_id: uuid.UUID
    status: InterestStatus
    message: str | None = None
    created_at: datetime


class ConnectionCreate(BaseModel):
    receiver_id: uuid.UUID


class ConnectionUpdate(BaseModel):
    status: ConnectionStatus


class ConnectionRead(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: uuid.UUID
    sender_id: uuid.UUID
    receiver_id: uuid.UUID
    status: ConnectionStatus
    created_at: datetime
    updated_at: datetime


class MessageCreate(BaseModel):
    body: str = Field(..., min_length=1, max_length=5000)


class MessageRead(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: uuid.UUID
    conversation_id: uuid.UUID
    sender_id: uuid.UUID
    body: str
    read_at: datetime | None = None
    created_at: datetime


class ConversationRead(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: uuid.UUID
    listing_id: uuid.UUID | None = None
    created_at: datetime
    latest_message: MessageRead | None = None
    unread_count: int = 0


class NotificationRead(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: uuid.UUID
    user_id: uuid.UUID
    type: NotificationType
    title: str
    body: str
    resource_type: str | None = None
    resource_id: str | None = None
    read_at: datetime | None = None
    created_at: datetime


class ReportCreate(BaseModel):
    reported_user_id: uuid.UUID | None = None
    reported_listing_id: uuid.UUID | None = None
    reason: ReportReason
    details: str | None = None


class ReportRead(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: uuid.UUID
    reporter_id: uuid.UUID
    reported_user_id: uuid.UUID | None = None
    reported_listing_id: uuid.UUID | None = None
    reason: ReportReason
    details: str | None = None
    resolved_at: datetime | None = None
    created_at: datetime
