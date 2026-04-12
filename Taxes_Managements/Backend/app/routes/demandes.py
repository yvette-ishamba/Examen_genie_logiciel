from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from app.utils.dependencies import get_db
from app.models.demande import DemandeAcces
from app.models.user import User
from app.schemas.demande import DemandeOut, DemandeCreate
from app.utils.security import get_password_hash

router = APIRouter(prefix="/demandes", tags=["demandes"])

@router.post("/", response_model=DemandeOut)
def create_demande(demande: DemandeCreate, db: Session = Depends(get_db)):
    db_demande = DemandeAcces(
        nom_complet=demande.nom_complet,
        telephone=demande.telephone,
        role=demande.role,
        email=demande.email,
        password=get_password_hash(demande.password) if demande.password else None
    )
    db.add(db_demande)
    db.commit()
    db.refresh(db_demande)
    return db_demande

@router.get("/", response_model=List[DemandeOut])
def read_demandes(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    # Récupérer uniquement les demandes en attente
    demandes = db.query(DemandeAcces).filter(DemandeAcces.statut == "En attente").offset(skip).limit(limit).all()
    return demandes

@router.put("/{demande_id}/statut", response_model=DemandeOut)
def update_statut(demande_id: int, statut: str, db: Session = Depends(get_db)):
    # statut attendu : "Acceptee" ou "Refusee"
    demande = db.query(DemandeAcces).filter(DemandeAcces.id == demande_id).first()
    if not demande:
        raise HTTPException(status_code=404, detail="Demande introuvable")
    demande.statut = statut
    
    # Création automatique de l'utilisateur si accepté et informations présentes
    if statut == "Acceptee" and demande.email and demande.password:
        existing_user = db.query(User).filter(User.email == demande.email).first()
        if not existing_user:
            new_user = User(
                email=demande.email,
                hashed_password=demande.password,
                full_name=demande.nom_complet,
                is_active=True,
                is_admin=(demande.role == "Autorité Locale")
            )
            db.add(new_user)
            
    db.commit()
    db.refresh(demande)
    return demande
