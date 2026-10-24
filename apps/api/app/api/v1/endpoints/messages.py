"""
PGConnect API — Messages and Conversations endpoints.
"""

import uuid
from typing import Annotated
from fastapi import APIRouter, Depends, Query, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.auth import get_current_user
from app.db.session import get_db
from app.models.interactions import Conversation, Message
from app.models.user import User
from app.schemas.interaction import ConversationRead, MessageCreate, MessageRead
from app.services.chat_service import ChatService

router = APIRouter()


@router.get("/conversations", response_model=list[ConversationRead])
async def list_conversations(
    current_user: Annotated[User, Depends(get_current_user)],
    db: Annotated[AsyncSession, Depends(get_db)],
) -> list[Conversation]:
    """Retrieve all conversation threads for current user."""
    service = ChatService(db)
    return await service.get_my_conversations(current_user)


@router.post("/conversations/roommate/{other_user_id}", response_model=ConversationRead)
async def start_roommate_conversation(
    other_user_id: uuid.UUID,
    current_user: Annotated[User, Depends(get_current_user)],
    db: Annotated[AsyncSession, Depends(get_db)],
) -> Conversation:
    """Get or initialize direct message thread with an accepted roommate connection."""
    service = ChatService(db)
    return await service.get_or_create_roommate_conversation(current_user, other_user_id)


@router.post("/conversations/owner/{listing_id}", response_model=ConversationRead)
async def start_owner_conversation(
    listing_id: uuid.UUID,
    current_user: Annotated[User, Depends(get_current_user)],
    db: Annotated[AsyncSession, Depends(get_db)],
) -> Conversation:
    """Get or initialize inquiry thread with a PG owner."""
    service = ChatService(db)
    return await service.get_or_create_owner_conversation(current_user, listing_id)


@router.get("/conversations/{conversation_id}/messages", response_model=list[MessageRead])
async def get_messages(
    conversation_id: uuid.UUID,
    current_user: Annotated[User, Depends(get_current_user)],
    db: Annotated[AsyncSession, Depends(get_db)],
    limit: int = Query(50, ge=1, le=100),
) -> list[Message]:
    """Fetch messages in a conversation and mark as read."""
    service = ChatService(db)
    return await service.get_messages(current_user, conversation_id, limit=limit)


@router.post("/conversations/{conversation_id}/messages", response_model=MessageRead, status_code=status.HTTP_201_CREATED)
async def send_message(
    conversation_id: uuid.UUID,
    msg_data: MessageCreate,
    current_user: Annotated[User, Depends(get_current_user)],
    db: Annotated[AsyncSession, Depends(get_db)],
) -> Message:
    """Send a message to an active conversation thread."""
    service = ChatService(db)
    return await service.send_message(current_user, conversation_id, msg_data.body)
