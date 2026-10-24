"""
PGConnect API — Roommate Connection workflow service.
"""

import uuid
from sqlalchemy import or_, select
from sqlalchemy.ext.asyncio import AsyncSession
from fastapi import HTTPException, status

from app.models.interactions import Connection, ConnectionStatus, NotificationType
from app.models.user import User
from app.services.notification_service import NotificationService


class ConnectionService:
    def __init__(self, db: AsyncSession):
        self.db = db
        self.notification_service = NotificationService(db)

    async def send_request(self, sender: User, receiver_id: uuid.UUID) -> Connection:
        if sender.id == receiver_id:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="You cannot connect with yourself",
            )

        # Check existing connection in either direction
        stmt = select(Connection).where(
            or_(
                (Connection.sender_id == sender.id) & (Connection.receiver_id == receiver_id),
                (Connection.sender_id == receiver_id) & (Connection.receiver_id == sender.id),
            )
        )
        existing = (await self.db.execute(stmt)).scalar_one_or_none()
        if existing:
            if existing.status == ConnectionStatus.BLOCKED:
                raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Unable to connect")
            if existing.status == ConnectionStatus.PENDING:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="A connection request is already pending",
                )
            if existing.status == ConnectionStatus.ACCEPTED:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="You are already connected",
                )

        connection = Connection(
            sender_id=sender.id,
            receiver_id=receiver_id,
            status=ConnectionStatus.PENDING,
        )
        self.db.add(connection)
        await self.db.commit()
        await self.db.refresh(connection)

        # Dispatch notification to recipient
        await self.notification_service.create_notification(
            user_id=receiver_id,
            type=NotificationType.CONNECTION_REQUEST,
            title="New Roommate Connection Request",
            body=f"{sender.name} sent you a connection request to team up as roommates.",
            resource_type="connection",
            resource_id=str(connection.id),
        )

        return connection

    async def update_status(
        self, connection_id: uuid.UUID, user: User, new_status: ConnectionStatus
    ) -> Connection:
        stmt = select(Connection).where(Connection.id == connection_id)
        connection = (await self.db.execute(stmt)).scalar_one_or_none()
        if not connection:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Connection not found")

        # Receiver can accept or reject; either party can block
        if new_status in (ConnectionStatus.ACCEPTED, ConnectionStatus.REJECTED):
            if connection.receiver_id != user.id:
                raise HTTPException(
                    status_code=status.HTTP_403_FORBIDDEN,
                    detail="Only recipient can accept or reject this request",
                )
        elif new_status == ConnectionStatus.BLOCKED:
            if user.id not in (connection.sender_id, connection.receiver_id):
                raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Not authorized")

        connection.status = new_status
        await self.db.commit()
        await self.db.refresh(connection)

        if new_status == ConnectionStatus.ACCEPTED:
            # Notify the sender
            await self.notification_service.create_notification(
                user_id=connection.sender_id,
                type=NotificationType.CONNECTION_ACCEPTED,
                title="Connection Request Accepted!",
                body=f"{user.name} accepted your roommate connection request. You can now chat!",
                resource_type="connection",
                resource_id=str(connection.id),
            )

        return connection

    async def get_my_connections(self, user: User) -> list[Connection]:
        stmt = (
            select(Connection)
            .where(or_(Connection.sender_id == user.id, Connection.receiver_id == user.id))
            .order_by(Connection.updated_at.desc())
        )
        return list((await self.db.execute(stmt)).scalars().all())
