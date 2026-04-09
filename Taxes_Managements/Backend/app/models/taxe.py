from sqlalchemy import Column, Integer, String, Float
from app.database import Base

class Taxe(Base):
    __tablename__ = "taxes"

    id = Column(Integer, primary_key=True, index=True)
    nom = Column(String(255), index=True) # e.g. "Taxe de place", "Taxe d'hygiène"
    montant_base = Column(Float)
    frequence = Column(String(255)) # e.g. "Journalière", "Mensuelle"
    description = Column(String(255), nullable=True)
