import { request } from './api';

export interface DashboardSummary {
  total_today: number;
  growth_rate: number;
  active_vendeurs: number;
  active_agents: number;
  unpaid_vendeurs_count: number;
  pending_signals_count: number;
}

export interface WeeklyRevenuePoint {
  label: string;
  amount: number;
}

export interface RecentCollection {
  id: number;
  vendeur_name: string;
  location: string;
  time_ago: string;
  amount: number;
  status: string;
}

export interface TaxDistributionPoint {
  label: string;
  amount: number;
}

export interface DashboardData {
  summary: DashboardSummary;
  weekly_revenue: WeeklyRevenuePoint[];
  recent_activity: RecentCollection[];
  tax_distribution: TaxDistributionPoint[];
}

export const statsApi = {
  getDashboardData: async (): Promise<DashboardData> => {
    return request('/stats/dashboard');
  }
};
