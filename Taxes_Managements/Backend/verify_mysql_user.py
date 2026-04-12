from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from app.models.user import User
from app.utils.security import verify_password, get_password_hash
import os
from dotenv import load_dotenv

load_dotenv()

DATABASE_URL = "mysql+pymysql://root:Yvette%40123@localhost:3306/taxe_app_db"

def verify_db_user():
    try:
        engine = create_engine(DATABASE_URL)
        Session = sessionmaker(bind=engine)
        session = Session()

        # Check if user exists
        user = session.query(User).filter(User.email == "test@example.com").first()
        
        if not user:
            print("User test@example.com not found in MySQL database.")
            # Create user if missing
            print("Creating test@example.com with password '1234'...")
            new_user = User(
                email="test@example.com",
                hashed_password=get_password_hash("1234"),
                full_name="Test User",
                is_active=True,
                is_admin=True
            )
            session.add(new_user)
            session.commit()
            user = new_user
            print("User created successfully.")

        # Verify password
        print(f"User email: {user.email}")
        result = verify_password("1234", user.hashed_password)
        print(f"Verification for '1234': {result}")
        
    except Exception as e:
        print(f"Error during verification: {e}")

if __name__ == "__main__":
    verify_db_user()
