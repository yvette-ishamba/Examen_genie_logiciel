from pydantic import BaseModel
from datetime import datetime
from typing import Optional

class VendeurBase(BaseModel):
    nom: str
    prenom: str
    identifiant_national: str
    telephone: str
    emplacement: str
    is_active: Optional[bool] = True

class VendeurCreate(VendeurBase):
    pass

class VendeurOut(VendeurBase):
    id: int
    created_at: datetime

    class Config:
        from_attributes = True
