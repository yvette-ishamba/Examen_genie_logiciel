"""
conftest.py - Shared fixtures for all unit tests.

Strategy: Connect to the REAL MySQL database (same as the app).
Each test runs inside a nested transaction (savepoint) that is rolled
back at the end, so no data is permanently written.

This means all MySQL views, stored procedures and FKs work exactly
as in production — no SQLite shim needed.
"""
import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

from app.database import SQLALCHEMY_DATABASE_URL
from app.main import app
from app.utils.dependencies import get_db
from app.utils.security import get_password_hash

# ─── Connect to the real MySQL database ─────────────────────────────────────
engine = create_engine(
    SQLALCHEMY_DATABASE_URL,
    # Keep a single connection open for the whole test session so that
    # savepoints are visible within the same connection.
    pool_pre_ping=True,
)

# ─── Session factory (shared connection) ────────────────────────────────────
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


# ─────────────────────────────────────────────────────────────────────────────
# Core fixtures
# ─────────────────────────────────────────────────────────────────────────────

@pytest.fixture(scope="function")
def db():
    """
    Yield a DB session that lives inside a savepoint.
    Everything written during a test is rolled back automatically.
    """
    connection = engine.connect()
    trans = connection.begin()                    # outer transaction
    session = TestingSessionLocal(bind=connection)

    # Nested savepoints mean SQLAlchemy's internal BEGIN calls don't break
    # our outer transaction.
    session.begin_nested()

    yield session

    session.close()
    trans.rollback()     # ← undo ALL changes made during the test
    connection.close()


@pytest.fixture(scope="function")
def client(db):
    """
    TestClient whose every request shares the same rolled-back session.
    """
    def _override_get_db():
        yield db

    app.dependency_overrides[get_db] = _override_get_db
    yield TestClient(app)
    app.dependency_overrides.pop(get_db, None)


# ─────────────────────────────────────────────────────────────────────────────
# Helper utilities (used by multiple test modules)
# ─────────────────────────────────────────────────────────────────────────────

def make_user(
    db,
    email="user@test.com",
    password="pass123",
    full_name="Test User",
    role="Agent de Collect",
    phone="0811111111",
):
    """Insert a User row directly (bypasses the HTTP layer)."""
    from app.models.user import User

    user = User(
        email=email,
        hashed_password=get_password_hash(password),
        full_name=full_name,
        role=role,
        phone_number=phone,
        is_active=True,
        is_admin=(role == "Autorité locale"),
    )
    db.add(user)
    db.commit()
    db.refresh(user)
    return user


def get_token(client, email: str, password: str) -> str:
    """Obtain a JWT bearer token for *email* / *password*."""
    resp = client.post(
        "/auth/login",
        data={"username": email, "password": password},
    )
    assert resp.status_code == 200, f"Login failed: {resp.text}"
    return resp.json()["access_token"]
