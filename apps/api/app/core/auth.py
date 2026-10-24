"""
PGConnect API — Authentication and Authorization dependencies.
Verifies Supabase JWTs, extracts user identity, and applies RBAC.
"""

from typing import Annotated
import jwt
from fastapi import Depends, HTTPException, Security, status
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
import structlog

from app.core.config import get_settings
from app.db.session import get_db
from app.models.user import AccountStatus, User, UserRole

logger = structlog.get_logger(__name__)
security = HTTPBearer(auto_error=False)


class AuthUserPayload:
    def __init__(self, auth_user_id: str, email: str, name: str = "User", role: UserRole = UserRole.USER):
        self.auth_user_id = auth_user_id
        self.email = email
        self.name = name
        self.role = role


async def get_token_payload(
    credentials: Annotated[HTTPAuthorizationCredentials | None, Security(security)]
) -> AuthUserPayload:
    """Decodes and validates JWT token or development bearer token."""
    if not credentials:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Missing authentication credentials",
            headers={"WWW-Authenticate": "Bearer"},
        )

    token = credentials.credentials
    settings = get_settings()

    # Development convenience: support mock / dev tokens when in development
    if settings.environment == "development" and token.startswith("dev-"):
        parts = token.split("-")
        role = UserRole.USER
        if "owner" in parts:
            role = UserRole.PG_OWNER
        elif "admin" in parts:
            role = UserRole.ADMIN

        auth_id = f"auth-{token}"
        email = f"{token}@pgconnect.local"
        name = token.replace("dev-", "").replace("-", " ").title()
        return AuthUserPayload(auth_user_id=auth_id, email=email, name=name, role=role)

    # Supabase JWT validation
    try:
        # If secret is available, verify signature; otherwise attempt decode
        secret = settings.supabase_jwt_secret
        if secret and secret != "dev-supabase-jwt-secret-placeholder":
            payload = jwt.decode(
                token,
                secret,
                algorithms=["HS256"],
                options={"verify_aud": False},
            )
        else:
            payload = jwt.decode(
                token,
                options={"verify_signature": False, "verify_aud": False},
            )

        auth_user_id = payload.get("sub")
        email = payload.get("email") or f"{auth_user_id}@user.supabase"
        user_metadata = payload.get("user_metadata", {})
        name = user_metadata.get("full_name") or user_metadata.get("name") or "PGConnect User"

        app_metadata = payload.get("app_metadata", {})
        role_str = app_metadata.get("role") or user_metadata.get("role") or "USER"
        try:
            role = UserRole(role_str.upper())
        except ValueError:
            role = UserRole.USER

        if not auth_user_id:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Token has no subject identifier",
            )

        return AuthUserPayload(
            auth_user_id=str(auth_user_id),
            email=str(email),
            name=str(name),
            role=role,
        )
    except jwt.PyJWTError as e:
        logger.warning("jwt_verification_failed", error=str(e))
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=f"Invalid or expired token: {str(e)}",
            headers={"WWW-Authenticate": "Bearer"},
        )


async def get_current_user(
    token_payload: Annotated[AuthUserPayload, Depends(get_token_payload)],
    db: Annotated[AsyncSession, Depends(get_db)],
) -> User:
    """
    Retrieves or creates user matching the auth token subject.
    Never exposes auth credentials.
    """
    stmt = select(User).where(User.auth_user_id == token_payload.auth_user_id)
    result = await db.execute(stmt)
    user = result.scalar_one_or_none()

    if not user:
        # Create user on first login
        user = User(
            auth_user_id=token_payload.auth_user_id,
            email=token_payload.email,
            name=token_payload.name,
            role=token_payload.role,
            account_status=AccountStatus.ACTIVE,
            is_email_verified=True,
        )
        db.add(user)
        await db.commit()
        await db.refresh(user)
        logger.info("user_created_on_first_login", user_id=str(user.id), email=user.email)

    if user.account_status != AccountStatus.ACTIVE:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail=f"Account is {user.account_status.value.lower()}",
        )

    return user


def require_role(*allowed_roles: UserRole):
    """Factory dependency for role-based access control."""
    async def role_checker(current_user: Annotated[User, Depends(get_current_user)]) -> User:
        if current_user.role not in allowed_roles:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail=f"Action requires one of roles: {[r.value for r in allowed_roles]}",
            )
        return current_user

    return role_checker
