"""
test_security.py - Unit tests for security utility functions.

Tests password hashing and JWT token creation/validation
without requiring any HTTP calls.
"""
import pytest
from app.utils.security import (
    get_password_hash,
    verify_password,
    create_access_token,
    SECRET_KEY,
    ALGORITHM,
)
from jose import jwt
from datetime import timedelta


class TestPasswordHashing:
    """Tests for get_password_hash() and verify_password()"""

    def test_hash_is_not_plaintext(self):
        """The hashed password must differ from the original."""
        hashed = get_password_hash("mysecret")
        assert hashed != "mysecret"

    def test_verify_correct_password(self):
        """verify_password returns True for the correct plaintext."""
        hashed = get_password_hash("correct_pass")
        assert verify_password("correct_pass", hashed) is True

    def test_verify_wrong_password(self):
        """verify_password returns False for the wrong plaintext."""
        hashed = get_password_hash("correct_pass")
        assert verify_password("wrong_pass", hashed) is False

    def test_same_password_gives_different_hashes(self):
        """bcrypt salts mean the same password produces different hashes each time."""
        h1 = get_password_hash("samepassword")
        h2 = get_password_hash("samepassword")
        assert h1 != h2


class TestJWT:
    """Tests for create_access_token()"""

    def test_token_contains_subject(self):
        """The generated token encodes the 'sub' claim correctly."""
        token = create_access_token(data={"sub": "user@example.com"})
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        assert payload["sub"] == "user@example.com"

    def test_token_has_expiry(self):
        """The generated token includes an 'exp' claim."""
        token = create_access_token(data={"sub": "user@example.com"}, expires_delta=timedelta(minutes=30))
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        assert "exp" in payload

    def test_invalid_token_raises(self):
        """A tampered or invalid token cannot be decoded."""
        from jose import JWTError
        with pytest.raises(JWTError):
            jwt.decode("not.a.valid.token", SECRET_KEY, algorithms=[ALGORITHM])

    def test_token_with_custom_expiry(self):
        """A token with a custom expiry encodes the correct data."""
        token = create_access_token(
            data={"sub": "admin@example.com"},
            expires_delta=timedelta(hours=2),
        )
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        assert payload["sub"] == "admin@example.com"
