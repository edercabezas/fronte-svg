import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, of, delay } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Event, CreateEventRequest, UpdateEventRequest, EventFilters, EventStatus, BulkImportResult } from '../models/event.models';
import { PaginatedResponse } from '../models/api.models';
import { MOCK_EVENTS } from '../mocks/mock-data';

@Injectable({ providedIn: 'root' })
export class EventsService {
  private http = inject(HttpClient);
  private readonly base = `${environment.apiUrl}/events`;

  getAll(filters: EventFilters = {}): Observable<PaginatedResponse<Event>> {
    if (environment.useMocks) {
      let data = [...MOCK_EVENTS];
      if (filters.status) data = data.filter(e => e.status === filters.status);
      if (filters.search) data = data.filter(e => e.name.toLowerCase().includes(filters.search!.toLowerCase()));
      const page = filters.page ?? 1;
      const limit = filters.limit ?? 10;
      const start = (page - 1) * limit;
      const paginated = data.slice(start, start + limit);
      return of({ data: paginated, total: data.length, page, limit, totalPages: Math.ceil(data.length / limit) }).pipe(delay(environment.mockDelay));
    }
    let params = new HttpParams();
    Object.entries(filters).forEach(([k, v]) => { if (v !== undefined && v !== '') params = params.set(k, String(v)); });
    return this.http.get<PaginatedResponse<Event>>(this.base, { params });
  }

  getById(id: number): Observable<Event> {
    if (environment.useMocks) {
      const event = MOCK_EVENTS.find(e => e.id === id)!;
      return of(event).pipe(delay(environment.mockDelay));
    }
    return this.http.get<Event>(`${this.base}/${id}`);
  }

  create(payload: CreateEventRequest): Observable<Event> {
    if (environment.useMocks) {
      const newEvent: Event = { id: Date.now(), ...payload, status: 'draft', createdBy: 1, createdByName: 'Admin Master', trainers: [], participantsCount: 0, certifiedCount: 0, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() };
      MOCK_EVENTS.push(newEvent);
      return of(newEvent).pipe(delay(environment.mockDelay));
    }
    return this.http.post<Event>(this.base, payload);
  }

  update(id: number, payload: UpdateEventRequest): Observable<Event> {
    if (environment.useMocks) {
      const idx = MOCK_EVENTS.findIndex(e => e.id === id);
      MOCK_EVENTS[idx] = { ...MOCK_EVENTS[idx], ...payload, updatedAt: new Date().toISOString() };
      return of(MOCK_EVENTS[idx]).pipe(delay(environment.mockDelay));
    }
    return this.http.put<Event>(`${this.base}/${id}`, payload);
  }

  updateStatus(id: number, status: EventStatus): Observable<Event> {
    if (environment.useMocks) {
      const idx = MOCK_EVENTS.findIndex(e => e.id === id);
      MOCK_EVENTS[idx] = { ...MOCK_EVENTS[idx], status, updatedAt: new Date().toISOString() };
      return of(MOCK_EVENTS[idx]).pipe(delay(environment.mockDelay));
    }
    return this.http.patch<Event>(`${this.base}/${id}/status`, { status });
  }

  delete(id: number): Observable<void> {
    if (environment.useMocks) {
      const idx = MOCK_EVENTS.findIndex(e => e.id === id);
      MOCK_EVENTS.splice(idx, 1);
      return of(undefined).pipe(delay(environment.mockDelay));
    }
    return this.http.delete<void>(`${this.base}/${id}`);
  }

  importBulk(file: File): Observable<BulkImportResult> {
    if (environment.useMocks) {
      return of({ success: 3, errors: [] }).pipe(delay(environment.mockDelay * 2));
    }
    const form = new FormData();
    form.append('file', file);
    return this.http.post<BulkImportResult>(`${this.base}/bulk`, form);
  }

  downloadBulkTemplate(): Observable<Blob> {
    return this.http.get(`${this.base}/bulk/template`, { responseType: 'blob' });
  }

  // Público: solo eventos activos, sin autenticación
  getPublicEvents(): Observable<Event[]> {
    if (environment.useMocks) {
      const active = MOCK_EVENTS.filter(e => e.status === 'active' || e.status === 'draft');
      return of(active).pipe(delay(environment.mockDelay));
    }
    return this.http.get<Event[]>(`${this.base}/public`);
  }
}
