import sys
import os

# Add Backend to path
sys.path.append(os.getcwd())

from app.database import engine
from sqlalchemy import text

def check_users():
    with engine.connect() as conn:
        res = conn.execute(text('SELECT id, email, role, vendeur_id FROM users'))
        users = res.fetchall()
        print("Users in database:")
        for u in users:
            print(f"ID: {u[0]}, Email: {u[1]}, Role: {u[2]}, VendeurID: {u[3]}")
            
        res_v = conn.execute(text('SELECT id, nom, prenom, telephone FROM vendeurs'))
        vendeurs = res_v.fetchall()
        print("\nVendeurs in database:")
        for v in vendeurs:
            print(f"ID: {v[0]}, Nom: {v[1]}, Prenom: {v[2]}, Phone: {v[3]}")

if __name__ == "__main__":
    check_users()
