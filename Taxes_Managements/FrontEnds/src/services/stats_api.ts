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

export interface RecentSignal {
  id: number;
  sujet: string;
  auteur_name: string;
  time_ago: string;
  statut: string;
}

export interface UnpaidByTax {
  taxe_name: string;
  count: number;
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
  unpaid_by_tax: UnpaidByTax[];
  recent_signals: RecentSignal[];
}

export interface TaxMonthlyPoint {
  month: string;
  amount: number;
}

export interface TaxGlobalStats {
  total_amount: number;
  monthly_average: number;
  growth_rate: number;
  monthly_data: TaxMonthlyPoint[];
  tax_breakdown: TaxDistributionPoint[];
}

export interface ReportPoint {
  label: string;
  value: number;
  percentage?: number;
}

export interface GlobalReports {
  market_distribution: ReportPoint[];
  compliance_stats: ReportPoint[];
  agent_performance: ReportPoint[];
  revenue_by_category: ReportPoint[];
}

export const statsApi = {
  getDashboardData: async (): Promise<DashboardData> => {
    return request('/stats/dashboard');
  },
  getTaxGlobalStats: async (year?: number): Promise<TaxGlobalStats> => {
    return request(`/stats/taxes${year ? `?year=${year}` : ''}`);
  },
  getGlobalReports: async (): Promise<GlobalReports> => {
    return request('/stats/reports');
  }
};
