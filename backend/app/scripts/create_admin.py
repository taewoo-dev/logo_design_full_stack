import asyncio
from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession
from sqlalchemy.orm import sessionmaker

from app.auth.jwt_codec import UserRole
from app.auth.password_hasher import PasswordHasher
from app.models.user import User
from app.core.configs import settings

# Admin user details
ADMIN_EMAIL = "admin@example.com"
ADMIN_PASSWORD = "admin1234"
ADMIN_NAME = "관리자"


async def create_admin():
    # Create engine
    engine = create_async_engine(settings.database_url)
    async_session = sessionmaker(engine, class_=AsyncSession, expire_on_commit=False)

    async with async_session() as session:
        # Check if admin already exists
        admin = await session.get(User, ADMIN_EMAIL)
        if admin:
            print(f"Admin user '{ADMIN_EMAIL}' already exists.")
            return

        # Create admin user
        admin = User(
            email=ADMIN_EMAIL,
            hashed_password=PasswordHasher.hash_password(ADMIN_PASSWORD),
            name=ADMIN_NAME,
            role=UserRole.ADMIN,
        )
        session.add(admin)
        await session.commit()
        print(f"Admin user '{ADMIN_EMAIL}' created successfully.")


if __name__ == "__main__":
    asyncio.run(create_admin()) 