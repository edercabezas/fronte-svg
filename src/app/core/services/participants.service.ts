import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, delay } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Participant, CreateParticipantRequest, UpdateParticipantRequest, ImportResult, PublicRegistrationRequest } from '../models/participant.models';
import { MOCK_PARTICIPANTS } from '../mocks/mock-data';

@Injectable({ providedIn: 'root' })
export class ParticipantsService {
  private http = inject(HttpClient);
  private readonly base = `${environment.apiUrl}/events`;

  getByEvent(eventId: number): Observable<Participant[]> {
    if (environment.useMocks) {
      const data = MOCK_PARTICIPANTS.filter(p => p.eventId === eventId);
      return of(data).pipe(delay(environment.mockDelay));
    }
    return this.http.get<Participant[]>(`${this.base}/${eventId}/participants`);
  }

  create(eventId: number, payload: CreateParticipantRequest): Observable<Participant> {
    if (environment.useMocks) {
      const newP: Participant = { id: Date.now(), eventId, ...payload, documentType: payload.documentType ?? 'CC', passed: false, certificationStatus: 'pending', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() };
      MOCK_PARTICIPANTS.push(newP);
      return of(newP).pipe(delay(environment.mockDelay));
    }
    return this.http.post<Participant>(`${this.base}/${eventId}/participants`, payload);
  }

  update(eventId: number, participantId: number, payload: UpdateParticipantRequest): Observable<Participant> {
    if (environment.useMocks) {
      const idx = MOCK_PARTICIPANTS.findIndex(p => p.id === participantId);
      MOCK_PARTICIPANTS[idx] = { ...MOCK_PARTICIPANTS[idx], ...payload, updatedAt: new Date().toISOString() };
      return of(MOCK_PARTICIPANTS[idx]).pipe(delay(environment.mockDelay));
    }
    return this.http.put<Participant>(`${this.base}/${eventId}/participants/${participantId}`, payload);
  }

  delete(eventId: number, participantId: number): Observable<void> {
    if (environment.useMocks) {
      const idx = MOCK_PARTICIPANTS.findIndex(p => p.id === participantId);
      MOCK_PARTICIPANTS.splice(idx, 1);
      return of(undefined).pipe(delay(environment.mockDelay));
    }
    return this.http.delete<void>(`${this.base}/${eventId}/participants/${participantId}`);
  }

  downloadCertificate(eventId: number, participantId: number): Observable<Blob> {
    return this.http.get(`${this.base}/${eventId}/participants/${participantId}/certificate`, { responseType: 'blob' });
  }

  downloadImportTemplate(eventId: number): Observable<Blob> {
    return this.http.get(`${this.base}/${eventId}/participants/import/template`, { responseType: 'blob' });
  }

  importExcel(eventId: number, file: File): Observable<ImportResult> {
    if (environment.useMocks) {
      const result: ImportResult = { success: 5, errors: [] };
      return of(result).pipe(delay(environment.mockDelay * 2));
    }
    const form = new FormData();
    form.append('file', file);
    return this.http.post<ImportResult>(`${this.base}/${eventId}/participants/import`, form);
  }

  getAll(): Observable<Participant[]> {
    if (environment.useMocks) {
      return of([...MOCK_PARTICIPANTS]).pipe(delay(environment.mockDelay));
    }
    return this.http.get<Participant[]>(`${environment.apiUrl}/participants`);
  }

  // Registro público sin autenticación
  registerPublic(payload: PublicRegistrationRequest): Observable<Participant> {
    if (environment.useMocks) {
      const alreadyRegistered = MOCK_PARTICIPANTS.find(
        p => p.eventId === payload.eventId && p.documentId === payload.documentId
      );
      if (alreadyRegistered) throw new Error('Ya estás registrado en este evento');
      const newP: Participant = {
        id: Date.now(),
        eventId: payload.eventId,
        name: payload.name,
        documentType: payload.documentType,
        documentId: payload.documentId,
        email: payload.email,
        phone: payload.phone,
        address: payload.address,
        passed: false,
        certificationStatus: 'pending',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      MOCK_PARTICIPANTS.push(newP);
      return of(newP).pipe(delay(environment.mockDelay));
    }
    return this.http.post<Participant>(`${environment.apiUrl}/register`, payload);
  }
}
