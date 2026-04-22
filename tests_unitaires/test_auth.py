"""
test_auth.py - Unit tests for Authentication endpoints.

Tested endpoints:
  POST /auth/login
"""
from tests.conftest import make_user, get_token


class TestAuthentication:
    """Tests for /auth/login"""

    def test_login_success(self, client, db):
        """A registered user can log in with correct credentials."""
        make_user(db, email="agent@test.com", password="secret99")

        resp = client.post(
            "/auth/login",
            data={"username": "agent@test.com", "password": "secret99"},
        )
        assert resp.status_code == 200
        body = resp.json()
        assert "access_token" in body
        assert body["token_type"] == "bearer"

    def test_login_wrong_password(self, client, db):
        """Login with a wrong password returns 401."""
        make_user(db, email="agent2@test.com", password="correct")

        resp = client.post(
            "/auth/login",
            data={"username": "agent2@test.com", "password": "wrong"},
        )
        assert resp.status_code == 401
        assert resp.json()["detail"] == "Incorrect email or password"

    def test_login_nonexistent_user(self, client):
        """Login with an email that does not exist returns 401."""
        resp = client.post(
            "/auth/login",
            data={"username": "ghost@test.com", "password": "whatever"},
        )
        assert resp.status_code == 401

    def test_jwt_token_is_usable(self, client, db):
        """A token obtained at login gives access to a protected endpoint."""
        make_user(db, email="metest@test.com", password="pass123")
        token = get_token(client, "metest@test.com", "pass123")

        resp = client.get("/users/me", headers={"Authorization": f"Bearer {token}"})
        assert resp.status_code == 200
        assert resp.json()["email"] == "metest@test.com"
