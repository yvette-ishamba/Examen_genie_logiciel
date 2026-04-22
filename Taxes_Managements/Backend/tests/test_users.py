"""
test_users.py - Unit tests for User management endpoints.

Tested endpoints:
  POST /users/register
  GET  /users/me
  GET  /users/check-email
"""
from tests.conftest import make_user, get_token


class TestUserRegistration:
    """Tests for POST /users/register"""

    def test_register_agent(self, client):
        """Register a new Agent de Collect user successfully."""
        resp = client.post(
            "/users/register",
            json={
                "email": "newagent@test.com",
                "password": "pass1234",
                "full_name": "Nouveau Agent",
                "role": "Agent de Collect",
                "phone_number": "0800000001",
            },
        )
        assert resp.status_code == 200
        data = resp.json()
        assert data["email"] == "newagent@test.com"
        assert data["role"] == "Agent de Collect"
        assert "id" in data

    def test_register_duplicate_email_rejected(self, client):
        """Registering twice with the same email returns 400."""
        payload = {
            "email": "dup@test.com",
            "password": "pass1234",
            "full_name": "Dup User",
            "role": "Agent de Collect",
            "phone_number": "0800000002",
        }
        client.post("/users/register", json=payload)
        resp = client.post("/users/register", json=payload)
        assert resp.status_code == 400
        assert "already registered" in resp.json()["detail"]

    def test_register_vendeur_creates_profile(self, client):
        """Registering as a Vendeur automatically creates a vendeur profile."""
        resp = client.post(
            "/users/register",
            json={
                "email": "vendeur@test.com",
                "password": "pass1234",
                "full_name": "Jean Mbala",
                "role": "Vendeur",
                "phone_number": "0812345678",
                "emplacement": "Marché Central",
                "identifiant_national": "CD-001",
            },
        )
        assert resp.status_code == 200
        data = resp.json()
        assert data["role"] == "Vendeur"
        assert data.get("vendeur_id") is not None


class TestUserMe:
    """Tests for GET /users/me"""

    def test_get_me_authenticated(self, client, db):
        """An authenticated user receives their own profile."""
        make_user(db, email="me@test.com", password="mypass")
        token = get_token(client, "me@test.com", "mypass")

        resp = client.get("/users/me", headers={"Authorization": f"Bearer {token}"})
        assert resp.status_code == 200
        assert resp.json()["email"] == "me@test.com"

    def test_get_me_unauthenticated(self, client):
        """Without a token, /users/me returns 401."""
        resp = client.get("/users/me")
        assert resp.status_code == 401


class TestCheckEmail:
    """Tests for GET /users/check-email"""

    def test_existing_email(self, client, db):
        """Check returns exists=True for a registered email."""
        make_user(db, email="existing@test.com")
        resp = client.get("/users/check-email", params={"email": "existing@test.com"})
        assert resp.status_code == 200
        assert resp.json()["exists"] is True

    def test_nonexistent_email(self, client):
        """Check returns exists=False for an unknown email."""
        resp = client.get("/users/check-email", params={"email": "nobody@test.com"})
        assert resp.status_code == 200
        assert resp.json()["exists"] is False
