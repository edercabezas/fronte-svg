import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpEventType } from '@angular/common/http';
import { Observable, of, delay } from 'rxjs';
import { environment } from '../../../environments/environment';
import { EvidenceFile, EvidenceType } from '../models/evidence.models';
import { MOCK_EVIDENCE } from '../mocks/mock-data';

@Injectable({ providedIn: 'root' })
export class EvidenceService {
  private http = inject(HttpClient);
  private readonly base = `${environment.apiUrl}/events`;

  getByEvent(eventId: number, type?: EvidenceType): Observable<EvidenceFile[]> {
    if (environment.useMocks) {
      let data = MOCK_EVIDENCE.filter(e => e.eventId === eventId);
      if (type) data = data.filter(e => e.type === type);
      return of(data).pipe(delay(environment.mockDelay));
    }
    const params = type ? `?type=${type}` : '';
    return this.http.get<EvidenceFile[]>(`${this.base}/${eventId}/evidence${params}`);
  }

  upload(eventId: number, files: File[], description?: string): Observable<EvidenceFile[]> {
    if (environment.useMocks) {
      const newFiles: EvidenceFile[] = files.map((f, i) => ({
        id: Date.now() + i,
        eventId,
        uploadedBy: 1,
        uploadedByName: 'Admin Master',
        type: f.type.startsWith('image') ? 'photo' : 'document',
        originalName: f.name,
        storedPath: `/uploads/events/${eventId}/${f.name}`,
        mimeType: f.type,
        fileSize: f.size,
        description,
        createdAt: new Date().toISOString(),
      }));
      MOCK_EVIDENCE.push(...newFiles);
      return of(newFiles).pipe(delay(environment.mockDelay * 2));
    }
    const form = new FormData();
    files.forEach(f => form.append('files', f));
    if (description) form.append('description', description);
    return this.http.post<EvidenceFile[]>(`${this.base}/${eventId}/evidence`, form);
  }

  delete(evidenceId: number): Observable<void> {
    if (environment.useMocks) {
      const idx = MOCK_EVIDENCE.findIndex(e => e.id === evidenceId);
      MOCK_EVIDENCE.splice(idx, 1);
      return of(undefined).pipe(delay(environment.mockDelay));
    }
    return this.http.delete<void>(`${environment.apiUrl}/evidence/${evidenceId}`);
  }

  getDownloadUrl(evidenceId: number): string {
    return `${environment.apiUrl}/evidence/${evidenceId}/download`;
  }
}
