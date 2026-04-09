from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from app.utils.dependencies import get_db, get_current_user
from app.models.signalement import Signalement
from app.schemas.signalement import SignalementCreate, SignalementOut
from app.models.user import User

router = APIRouter(prefix="/signalements", tags=["signalements"])

@router.post("/", response_model=SignalementOut)
def create_signalement(
    signalement: SignalementCreate, 
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    new_signalement = Signalement(
        **signalement.dict(),
        user_id=current_user.id
    )
    db.add(new_signalement)
    db.commit()
    db.refresh(new_signalement)
    return new_signalement

@router.get("/", response_model=List[SignalementOut])
def read_signalements(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    return db.query(Signalement).offset(skip).limit(limit).all()
