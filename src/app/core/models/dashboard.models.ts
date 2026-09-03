import { Event } from './event.models';

export interface DashboardStats {
  totalEvents: number;
  activeEvents: number;
  completedEvents: number;
  totalParticipants: number;
  totalCertified: number;
  totalFailed: number;
  totalPending: number;
  totalCosts: number;
  approvalRate: number;
}

export interface ChartDataPoint {
  label: string;
  value: number;
}

export interface MonthlyStatusPoint {
  label: string;
  approved: number;
  pending: number;
  failed: number;
}

export interface DashboardCharts {
  certificationsByMonth: MonthlyStatusPoint[];
  costsByCategory: ChartDataPoint[];
  approvalRateByEvent: ChartDataPoint[];
}

export interface UpcomingEvent {
  event: Event;
  daysUntilStart: number;
}
