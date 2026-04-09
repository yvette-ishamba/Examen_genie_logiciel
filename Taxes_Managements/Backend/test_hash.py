from passlib.context import CryptContext
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
try:
    print("Hashing 1234")
    print(pwd_context.hash("1234"))
except Exception as e:
    import traceback
    traceback.print_exc()
