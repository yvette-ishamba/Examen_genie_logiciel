from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime

class TaxDistributionPoint(BaseModel):
    label: str
    amount: float

class DashboardSummary(BaseModel):
    total_today: float
    growth_rate: float
    active_vendeurs: int
    active_agents: int
    unpaid_vendeurs_count: int
    pending_signals_count: int

class WeeklyRevenuePoint(BaseModel):
    label: str
    amount: float

class RecentCollection(BaseModel):
    id: int
    vendeur_name: str
    location: str
    time_ago: str
    amount: float
    status: str

class DashboardData(BaseModel):
    summary: DashboardSummary
    weekly_revenue: List[WeeklyRevenuePoint]
    recent_activity: List[RecentCollection]
    tax_distribution: List[TaxDistributionPoint]
