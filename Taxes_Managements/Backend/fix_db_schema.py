from sqlalchemy import create_engine, text

def migrate():
    try:
        engine = create_engine('mysql+pymysql://root:Yvette%40123@localhost:3306/taxe_app_db')
        with engine.connect() as conn:
            # Check if columns already exist to avoid errors
            result = conn.execute(text("SHOW COLUMNS FROM demandes_acces LIKE 'email'"))
            if not result.fetchone():
                print("Adding column email...")
                conn.execute(text("ALTER TABLE demandes_acces ADD COLUMN email VARCHAR(255) UNIQUE AFTER telephone"))
            
            result = conn.execute(text("SHOW COLUMNS FROM demandes_acces LIKE 'password'"))
            if not result.fetchone():
                print("Adding column password...")
                conn.execute(text("ALTER TABLE demandes_acces ADD COLUMN password VARCHAR(255) AFTER email"))
            
            conn.commit()
            print("Migration terminée avec succès.")
    except Exception as e:
        print(f"Erreur lors de la migration : {e}")

if __name__ == "__main__":
    migrate()
