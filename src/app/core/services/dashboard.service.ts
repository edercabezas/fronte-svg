import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, delay } from 'rxjs';
import { environment } from '../../../environments/environment';
import { DashboardStats, DashboardCharts, UpcomingEvent } from '../models/dashboard.models';
import { MOCK_EVENTS, MOCK_PARTICIPANTS, MOCK_EXPENSES } from '../mocks/mock-data';

@Injectable({ providedIn: 'root' })
export class DashboardService {
  private http = inject(HttpClient);
  private readonly base = `${environment.apiUrl}/dashboard`;

  getStats(): Observable<DashboardStats> {
    if (environment.useMocks) {
      const stats: DashboardStats = {
        totalEvents: MOCK_EVENTS.length,
        activeEvents: MOCK_EVENTS.filter(e => e.status === 'active').length,
        completedEvents: MOCK_EVENTS.filter(e => e.status === 'completed').length,
        totalParticipants: MOCK_PARTICIPANTS.length,
        totalCertified: MOCK_PARTICIPANTS.filter(p => p.certificationStatus === 'approved').length,
        totalFailed: MOCK_PARTICIPANTS.filter(p => p.certificationStatus === 'failed').length,
        totalPending: MOCK_PARTICIPANTS.filter(p => p.certificationStatus === 'pending').length,
        totalCosts: MOCK_EXPENSES.reduce((sum, e) => sum + e.amount, 0),
        approvalRate: Math.round((MOCK_PARTICIPANTS.filter(p => p.passed).length / MOCK_PARTICIPANTS.length) * 100),
      };
      return of(stats).pipe(delay(environment.mockDelay));
    }
    return this.http.get<DashboardStats>(`${this.base}/stats`);
  }

  getCharts(): Observable<DashboardCharts> {
    if (environment.useMocks) {
      const charts: DashboardCharts = {
        certificationsByMonth: [
          { label: 'Ene', approved: 0, pending: 0, failed: 0 }, { label: 'Feb', approved: 0, pending: 0, failed: 0 }, { label: 'Mar', approved: 0, pending: 0, failed: 0 },
          { label: 'Abr', approved: 20, pending: 2, failed: 2 }, { label: 'May', approved: 17, pending: 0, failed: 1 }, { label: 'Jun', approved: 0, pending: 12, failed: 0 },
        ],
        costsByCategory: [
          { label: 'Refrigerios', value: 636000 },
          { label: 'Materiales', value: 125000 },
          { label: 'Transporte', value: 85000 },
        ],
        approvalRateByEvent: [
          { label: 'Seg. Industrial', value: 83 },
          { label: 'EPP', value: 94 },
          { label: 'Maquinaria', value: 0 },
        ],
      };
      return of(charts).pipe(delay(environment.mockDelay));
    }
    return this.http.get<DashboardCharts>(`${this.base}/charts`);
  }

  getUpcomingEvents(): Observable<UpcomingEvent[]> {
    if (environment.useMocks) {
      const now = new Date();
      const upcoming = MOCK_EVENTS
        .filter(e => new Date(e.startDate) > now && e.status !== 'cancelled')
        .map(e => ({ event: e, daysUntilStart: Math.ceil((new Date(e.startDate).getTime() - now.getTime()) / 86400000) }))
        .sort((a, b) => a.daysUntilStart - b.daysUntilStart);
      return of(upcoming).pipe(delay(environment.mockDelay));
    }
    return this.http.get<UpcomingEvent[]>(`${this.base}/upcoming-events`);
  }
}
