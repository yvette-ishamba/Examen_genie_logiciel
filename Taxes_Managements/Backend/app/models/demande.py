from sqlalchemy import Column, Integer, String, DateTime
from datetime import datetime
from app.database import Base

class DemandeAcces(Base):
    __tablename__ = "demandes_acces"

    id = Column(Integer, primary_key=True, index=True)
    nom_complet = Column(String(255), index=True)
    telephone = Column(String(255))
    email = Column(String(255), unique=True, index=True, nullable=True) # Utilisateur donne son email
    password = Column(String(255), nullable=True) # Hashé ou stocké temporairement
    role = Column(String(100)) # Vendeur, Agent, Autorite
    statut = Column(String(50), default="En attente") # En attente, Acceptee, Refusee
    created_at = Column(DateTime, default=datetime.utcnow)
