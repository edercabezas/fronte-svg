import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, delay } from 'rxjs';
import { environment } from '../../../environments/environment';
import { CertificationTemplate } from '../models/template.models';
import { MOCK_TEMPLATES } from '../mocks/mock-data';

@Injectable({ providedIn: 'root' })
export class TemplatesService {
  private http = inject(HttpClient);
  private readonly base = `${environment.apiUrl}/templates`;

  getAll(): Observable<CertificationTemplate[]> {
    if (environment.useMocks) return of([...MOCK_TEMPLATES]).pipe(delay(environment.mockDelay));
    return this.http.get<CertificationTemplate[]>(this.base);
  }
}
