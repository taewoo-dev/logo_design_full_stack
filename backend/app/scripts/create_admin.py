import asyncio

from sqlalchemy import text
from sqlalchemy.ext.asyncio import AsyncSession, async_sessionmaker, create_async_engine

from app.auth.password_hasher import PasswordHasher
from app.models.user import User

# Admin user details
ADMIN_EMAIL = "admin@example.com"
ADMIN_PASSWORD = "admin1234"
ADMIN_NAME = "Admin"

DATABASE_URL = "mysql+asyncmy://root:password@localhost:3307/logo_design_db"


async def create_admin() -> None:
    engine = create_async_engine(DATABASE_URL)
    async_session = async_sessionmaker(engine, class_=AsyncSession, expire_on_commit=False)

    async with async_session() as session:
        # Check if admin user already exists
        result = await session.execute(text("SELECT * FROM users WHERE email = :email"), {"email": ADMIN_EMAIL})
        existing_user = result.first()

        if existing_user is None:
            # Create new admin user
            hashed_password = PasswordHasher.hash_password(ADMIN_PASSWORD)
            new_admin = User(email=ADMIN_EMAIL, hashed_password=hashed_password, name=ADMIN_NAME, is_admin=True)
            session.add(new_admin)
            await session.commit()
            print("Admin user created successfully")
        else:
            print("Admin user already exists")


if __name__ == "__main__":
    asyncio.run(create_admin())
