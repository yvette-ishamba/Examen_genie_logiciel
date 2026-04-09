from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from app.utils.dependencies import get_db, get_current_user
from app.models.vendeur import Vendeur
from app.schemas.vendeur import VendeurCreate, VendeurOut

router = APIRouter(prefix="/vendeurs", tags=["vendeurs"])

@router.post("/", response_model=VendeurOut)
def create_vendeur(vendeur: VendeurCreate, db: Session = Depends(get_db)):
    db_vendeur = db.query(Vendeur).filter(Vendeur.identifiant_national == vendeur.identifiant_national).first()
    if db_vendeur:
        raise HTTPException(status_code=400, detail="Vendeur already registered")
    
    new_vendeur = Vendeur(**vendeur.dict())
    db.add(new_vendeur)
    db.commit()
    db.refresh(new_vendeur)
    return new_vendeur

@router.get("/", response_model=List[VendeurOut])
def read_vendeurs(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    return db.query(Vendeur).offset(skip).limit(limit).all()

@router.get("/{vendeur_id}", response_model=VendeurOut)
def read_vendeur(vendeur_id: int, db: Session = Depends(get_db)):
    vendeur = db.query(Vendeur).filter(Vendeur.id == vendeur_id).first()
    if vendeur is None:
        raise HTTPException(status_code=404, detail="Vendeur not found")
    return vendeur
