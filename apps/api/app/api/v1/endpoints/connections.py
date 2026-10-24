"""
PGConnect API — Connections endpoints.
"""

import uuid
from typing import Annotated
from fastapi import APIRouter, Depends, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.auth import get_current_user
from app.db.session import get_db
from app.models.interactions import Connection
from app.models.user import User
from app.schemas.interaction import ConnectionCreate, ConnectionRead, ConnectionUpdate
from app.services.connection_service import ConnectionService

router = APIRouter()


@router.get("", response_model=list[ConnectionRead])
async def get_my_connections(
    current_user: Annotated[User, Depends(get_current_user)],
    db: Annotated[AsyncSession, Depends(get_db)],
) -> list[Connection]:
    """List all sent and received roommate connection requests."""
    service = ConnectionService(db)
    return await service.get_my_connections(current_user)


@router.post("", response_model=ConnectionRead, status_code=status.HTTP_201_CREATED)
async def send_connection_request(
    request_data: ConnectionCreate,
    current_user: Annotated[User, Depends(get_current_user)],
    db: Annotated[AsyncSession, Depends(get_db)],
) -> Connection:
    """Send a new roommate connection request (initiates PENDING state)."""
    service = ConnectionService(db)
    return await service.send_request(current_user, request_data.receiver_id)


@router.patch("/{connection_id}", response_model=ConnectionRead)
async def update_connection_status(
    connection_id: uuid.UUID,
    update_data: ConnectionUpdate,
    current_user: Annotated[User, Depends(get_current_user)],
    db: Annotated[AsyncSession, Depends(get_db)],
) -> Connection:
    """Accept, reject, or block a connection request."""
    service = ConnectionService(db)
    return await service.update_status(connection_id, current_user, update_data.status)
