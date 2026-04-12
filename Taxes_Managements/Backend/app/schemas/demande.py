from pydantic import BaseModel
from datetime import datetime
from typing import Optional

class DemandeBase(BaseModel):
    nom_complet: str
    telephone: str
    role: str
    email: Optional[str] = None

class DemandeCreate(DemandeBase):
    password: Optional[str] = None

class DemandeOut(DemandeBase):
    id: int
    statut: str
    created_at: datetime

    class Config:
        from_attributes = True
