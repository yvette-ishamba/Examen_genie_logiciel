from pydantic import BaseModel
from typing import Optional

class TaxeBase(BaseModel):
    nom: str
    montant_base: float
    frequence: str
    description: Optional[str] = None

class TaxeCreate(TaxeBase):
    pass

class TaxeOut(TaxeBase):
    id: int

    class Config:
        from_attributes = True
