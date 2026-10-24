"""
PGConnect API — Chat and Messaging service.
"""

import uuid
from sqlalchemy import func, or_, select, update
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload
from fastapi import HTTPException, status

from app.models.interactions import (
    Connection,
    ConnectionStatus,
    Conversation,
    ConversationParticipant,
    Message,
    NotificationType,
)
from app.models.listing import PGListing
from app.models.user import User
from app.services.notification_service import NotificationService


class ChatService:
    def __init__(self, db: AsyncSession):
        self.db = db
        self.notification_service = NotificationService(db)

    async def get_or_create_roommate_conversation(
        self, user_a: User, user_b_id: uuid.UUID
    ) -> Conversation:
        # Verify accepted connection
        conn_stmt = select(Connection).where(
            or_(
                (Connection.sender_id == user_a.id) & (Connection.receiver_id == user_b_id),
                (Connection.sender_id == user_b_id) & (Connection.receiver_id == user_a.id),
            ),
            Connection.status == ConnectionStatus.ACCEPTED,
        )
        conn = (await self.db.execute(conn_stmt)).scalar_one_or_none()
        if not conn:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="You must have an accepted roommate connection before messaging",
            )

        # Check existing direct conversation
        conv_stmt = (
            select(Conversation)
            .join(ConversationParticipant, Conversation.id == ConversationParticipant.conversation_id)
            .where(
                Conversation.listing_id.is_(None),
                ConversationParticipant.user_id.in_([user_a.id, user_b_id]),
            )
            .group_by(Conversation.id)
            .having(func.count(ConversationParticipant.user_id) == 2)
        )
        existing = (await self.db.execute(conv_stmt)).scalar_one_or_none()
        if existing:
            return existing

        # Create new conversation
        conv = Conversation(listing_id=None)
        self.db.add(conv)
        await self.db.flush()

        part_a = ConversationParticipant(conversation_id=conv.id, user_id=user_a.id)
        part_b = ConversationParticipant(conversation_id=conv.id, user_id=user_b_id)
        self.db.add_all([part_a, part_b])

        await self.db.commit()
        await self.db.refresh(conv)
        return conv

    async def get_or_create_owner_conversation(
        self, tenant: User, listing_id: uuid.UUID
    ) -> Conversation:
        listing = (await self.db.execute(select(PGListing).where(PGListing.id == listing_id))).scalar_one_or_none()
        if not listing:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Listing not found")

        # Find existing conversation for this listing & tenant
        conv_stmt = (
            select(Conversation)
            .join(ConversationParticipant, Conversation.id == ConversationParticipant.conversation_id)
            .where(
                Conversation.listing_id == listing_id,
                ConversationParticipant.user_id == tenant.id,
            )
        )
        existing = (await self.db.execute(conv_stmt)).scalar_one_or_none()
        if existing:
            return existing

        conv = Conversation(listing_id=listing_id)
        self.db.add(conv)
        await self.db.flush()

        part_tenant = ConversationParticipant(conversation_id=conv.id, user_id=tenant.id)
        part_owner = ConversationParticipant(conversation_id=conv.id, user_id=listing.owner_id)
        self.db.add_all([part_tenant, part_owner])

        await self.db.commit()
        await self.db.refresh(conv)
        return conv

    async def send_message(self, user: User, conversation_id: uuid.UUID, body: str) -> Message:
        # Check participation
        part_stmt = select(ConversationParticipant).where(
            ConversationParticipant.conversation_id == conversation_id,
            ConversationParticipant.user_id == user.id,
        )
        participant = (await self.db.execute(part_stmt)).scalar_one_or_none()
        if not participant:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="You are not a participant in this conversation",
            )

        msg = Message(conversation_id=conversation_id, sender_id=user.id, body=body)
        self.db.add(msg)
        await self.db.commit()
        await self.db.refresh(msg)

        # Notify other participants
        other_parts_stmt = select(ConversationParticipant.user_id).where(
            ConversationParticipant.conversation_id == conversation_id,
            ConversationParticipant.user_id != user.id,
        )
        other_user_ids = (await self.db.execute(other_parts_stmt)).scalars().all()
        for recipient_id in other_user_ids:
            await self.notification_service.create_notification(
                user_id=recipient_id,
                type=NotificationType.NEW_MESSAGE,
                title=f"New message from {user.name}",
                body=body[:100] + ("..." if len(body) > 100 else ""),
                resource_type="conversation",
                resource_id=str(conversation_id),
            )

        return msg

    async def get_messages(
        self, user: User, conversation_id: uuid.UUID, limit: int = 50
    ) -> list[Message]:
        part_stmt = select(ConversationParticipant).where(
            ConversationParticipant.conversation_id == conversation_id,
            ConversationParticipant.user_id == user.id,
        )
        if not (await self.db.execute(part_stmt)).scalar_one_or_none():
            raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Not authorized")

        stmt = (
            select(Message)
            .where(Message.conversation_id == conversation_id)
            .order_by(Message.created_at.asc())
            .limit(limit)
        )
        messages = list((await self.db.execute(stmt)).scalars().all())

        # Mark unread messages as read
        unread_stmt = (
            update(Message)
            .where(
                Message.conversation_id == conversation_id,
                Message.sender_id != user.id,
                Message.read_at.is_(None),
            )
            .values(read_at=func.now())
        )
        await self.db.execute(unread_stmt)
        await self.db.commit()

        return messages

    async def get_my_conversations(self, user: User) -> list[Conversation]:
        stmt = (
            select(Conversation)
            .join(ConversationParticipant, Conversation.id == ConversationParticipant.conversation_id)
            .where(ConversationParticipant.user_id == user.id)
            .order_by(Conversation.created_at.desc())
        )
        return list((await self.db.execute(stmt)).scalars().all())
