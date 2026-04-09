from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from app.utils.dependencies import get_db, get_current_user
from app.models.paiement import Paiement
from app.schemas.paiement import PaiementCreate, PaiementOut
from app.models.user import User

router = APIRouter(prefix="/paiements", tags=["paiements"])

@router.post("/", response_model=PaiementOut)
def create_paiement(
    paiement: PaiementCreate, 
    db: Session = Depends(get_db), 
    current_user: User = Depends(get_current_user)
):
    db_paiement = db.query(Paiement).filter(Paiement.reference == paiement.reference).first()
    if db_paiement:
        raise HTTPException(status_code=400, detail="Paiement reference already exists")
    
    new_paiement = Paiement(
        **paiement.dict(),
        collection_user_id=current_user.id
    )
    db.add(new_paiement)
    db.commit()
    db.refresh(new_paiement)
    return new_paiement

@router.get("/", response_model=List[PaiementOut])
def read_paiements(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    return db.query(Paiement).offset(skip).limit(limit).all()
