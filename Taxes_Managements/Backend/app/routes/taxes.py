from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from sqlalchemy import text
from app.utils.dependencies import get_db, get_current_user
from app.models.taxe import Taxe
from app.schemas.taxe import TaxeCreate, TaxeOut, TaxeBase

router = APIRouter(prefix="/taxes", tags=["taxes"])

@router.get("/view", response_model=List[TaxeOut])
def read_taxes_view(db: Session = Depends(get_db)):
    result = db.execute(text("SELECT * FROM vue_taxes")).fetchall()
    # Map raw SQL results to the schema
    return [TaxeOut(id=row[0], nom=row[1], montant_base=row[2], frequence=row[3], description=row[4]) for row in result]

@router.post("/", response_model=TaxeOut)
def create_taxe(taxe: TaxeCreate, db: Session = Depends(get_db)):
    # Protect this route in a real scenario to admins only
    new_taxe = Taxe(**taxe.dict())
    db.add(new_taxe)
    db.commit()
    db.refresh(new_taxe)
    return new_taxe

@router.get("/", response_model=List[TaxeOut])
def read_taxes(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    return db.query(Taxe).offset(skip).limit(limit).all()

@router.get("/{taxe_id}", response_model=TaxeOut)
def read_taxe(taxe_id: int, db: Session = Depends(get_db)):
    taxe = db.query(Taxe).filter(Taxe.id == taxe_id).first()
    if taxe is None:
        raise HTTPException(status_code=404, detail="Taxe not found")
    return taxe
