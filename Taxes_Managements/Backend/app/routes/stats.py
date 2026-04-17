from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func, desc
from datetime import datetime, timedelta
from typing import List

from app.utils.dependencies import get_db, get_current_user
from app.models.paiement import Paiement
from app.models.vendeur import Vendeur
from app.models.user import User
from app.models.signalement import Signalement
from app.models.taxe import Taxe
from app.schemas.stats import DashboardData, DashboardSummary, WeeklyRevenuePoint, RecentCollection, TaxDistributionPoint

router = APIRouter(prefix="/stats", tags=["statistics"])

@router.get("/dashboard", response_model=DashboardData)
def get_dashboard_data(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    now = datetime.utcnow()
    today = now.date()
    yesterday = today - timedelta(days=1)

    # 1. Total Today
    total_today = db.query(func.sum(Paiement.montant)).filter(
        func.date(Paiement.date_paiement) == today
    ).scalar() or 0.0

    # 2. Total Yesterday (for growth)
    total_yesterday = db.query(func.sum(Paiement.montant)).filter(
        func.date(Paiement.date_paiement) == yesterday
    ).scalar() or 0.0

    growth_rate = 0.0
    if total_yesterday > 0:
        growth_rate = ((total_today - total_yesterday) / total_yesterday) * 100

    # 3. Active counts
    active_vendeurs = db.query(func.count(Vendeur.id)).scalar() or 0
    active_agents = db.query(func.count(User.id)).filter(User.role == "Agent de Collecte").scalar() or 0

    # 4. Alerts counts
    # Simple logic for unpaid: count vendors who haven't paid today (This might be too broad, but let's use a placeholder count)
    # Actually, let's count vendors who don't have a payment in the last 2 days
    paid_recently_subquery = db.query(Paiement.vendeur_id).filter(
        Paiement.date_paiement >= (now - timedelta(days=2))
    ).subquery()
    unpaid_vendeurs_count = db.query(func.count(Vendeur.id)).filter(
        ~Vendeur.id.in_(paid_recently_subquery)
    ).scalar() or 0

    pending_signals_count = db.query(func.count(Signalement.id)).scalar() or 0

    summary = DashboardSummary(
        total_today=total_today,
        growth_rate=growth_rate,
        active_vendeurs=active_vendeurs,
        active_agents=active_agents,
        unpaid_vendeurs_count=unpaid_vendeurs_count,
        pending_signals_count=pending_signals_count
    )

    # 5. Weekly Revenue (Last 7 days)
    weekly_revenue = []
    days_map = ["Dim", "Lun", "Mar", "Mer", "Jeu", "Ven", "Sam"]
    
    for i in range(6, -1, -1):
        target_date = today - timedelta(days=i)
        day_name = days_map[target_date.weekday() if target_date.weekday() != 6 else 0] # Adjusting for Python's Mon=0, Sun=6
        # Fix: datetime.weekday() returns 0 for Monday, 6 for Sunday.
        # My map starts with Dim (Sunday).
        day_names = ["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"]
        label = day_names[target_date.weekday()]
        
        amount = db.query(func.sum(Paiement.montant)).filter(
            func.date(Paiement.date_paiement) == target_date
        ).scalar() or 0.0
        
        weekly_revenue.append(WeeklyRevenuePoint(label=label, amount=amount))

    # 6. Recent Activity
    recent_query = db.query(
        Paiement.id,
        Vendeur.nom.label("v_nom"),
        Vendeur.prenom.label("v_prenom"),
        Vendeur.emplacement.label("v_loc"),
        Paiement.date_paiement,
        Paiement.montant
    ).join(Vendeur, Paiement.vendeur_id == Vendeur.id).order_by(desc(Paiement.date_paiement)).limit(5).all()

    recent_activity = []
    for row in recent_query:
        # Simple time_ago logic
        diff = now - row.date_paiement
        if diff.seconds < 3600:
            time_ago = f"Il y a {diff.seconds // 60} min"
        elif diff.days == 0:
            time_ago = f"Il y a {diff.seconds // 3600} h"
        else:
            time_ago = f"Il y a {diff.days} j"

        recent_activity.append(RecentCollection(
            id=row.id,
            vendeur_name=f"{row.v_nom} {row.v_prenom}",
            location=row.v_loc or "Inconnu",
            time_ago=time_ago,
            amount=row.montant,
            status="PAYÉ"
        ))

    # 7. Tax Distribution (total amount per tax type)
    tax_dist_query = db.query(
        Taxe.nom.label("taxe_nom"),
        func.sum(Paiement.montant).label("total")
    ).join(Taxe, Paiement.taxe_id == Taxe.id).group_by(Taxe.nom).all()

    tax_distribution = [
        TaxDistributionPoint(label=row.taxe_nom, amount=row.total or 0.0)
        for row in tax_dist_query
    ]

    return DashboardData(
        summary=summary,
        weekly_revenue=weekly_revenue,
        recent_activity=recent_activity,
        tax_distribution=tax_distribution
    )
