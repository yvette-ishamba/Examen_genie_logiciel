import bcrypt
from passlib.context import CryptContext

try:
    print(f"Bcrypt version: {bcrypt.__version__}")
    pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
    password = "test_password"
    hashed = pwd_context.hash(password)
    print(f"Hashed: {hashed}")
    is_valid = pwd_context.verify(password, hashed)
    print(f"Verify: {is_valid}")
except Exception as e:
    print(f"Error: {e}")
    import traceback
    traceback.print_exc()
