import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, delay } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class ReportsService {
  private http = inject(HttpClient);
  private readonly base = `${environment.apiUrl}/events`;

  downloadFactoryReport(eventId: number): Observable<Blob> {
    if (environment.useMocks) {
      const blob = new Blob(['PDF Mock - Reporte de Fábrica'], { type: 'application/pdf' });
      return of(blob).pipe(delay(environment.mockDelay * 3));
    }
    return this.http.get(`${this.base}/${eventId}/reports/factory`, { responseType: 'blob' });
  }

  downloadAdminReport(eventId: number): Observable<Blob> {
    if (environment.useMocks) {
      const blob = new Blob(['PDF Mock - Reporte Administrativo'], { type: 'application/pdf' });
      return of(blob).pipe(delay(environment.mockDelay * 3));
    }
    return this.http.get(`${this.base}/${eventId}/reports/admin`, { responseType: 'blob' });
  }

  exportParticipants(eventId: number): Observable<Blob> {
    if (environment.useMocks) {
      const blob = new Blob(['Excel Mock - Participantes'], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      return of(blob).pipe(delay(environment.mockDelay * 2));
    }
    return this.http.get(`${this.base}/${eventId}/export/participants`, { responseType: 'blob' });
  }

  exportExpenses(eventId: number): Observable<Blob> {
    if (environment.useMocks) {
      const blob = new Blob(['Excel Mock - Gastos'], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      return of(blob).pipe(delay(environment.mockDelay * 2));
    }
    return this.http.get(`${this.base}/${eventId}/export/expenses`, { responseType: 'blob' });
  }

  triggerDownload(blob: Blob, filename: string): void {
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  }
}
