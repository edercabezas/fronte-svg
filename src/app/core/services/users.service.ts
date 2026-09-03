import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, delay } from 'rxjs';
import { environment } from '../../../environments/environment';
import { User, CreateUserRequest, UpdateUserRequest } from '../models/user.models';
import { MOCK_USERS } from '../mocks/mock-data';

@Injectable({ providedIn: 'root' })
export class UsersService {
  private http = inject(HttpClient);
  private readonly base = `${environment.apiUrl}/users`;

  getAll(): Observable<User[]> {
    if (environment.useMocks) return of([...MOCK_USERS]).pipe(delay(environment.mockDelay));
    return this.http.get<User[]>(this.base);
  }

  // Capacitadores activos, para el selector de asignación en el formulario de eventos
  getTrainers(): Observable<User[]> {
    if (environment.useMocks) {
      return of(MOCK_USERS.filter(u => u.role === 'capacitador' && u.isActive)).pipe(delay(environment.mockDelay));
    }
    return this.http.get<User[]>(this.base, { params: { role: 'capacitador', active: 'true' } });
  }

  getById(id: number): Observable<User> {
    if (environment.useMocks) return of(MOCK_USERS.find(u => u.id === id)!).pipe(delay(environment.mockDelay));
    return this.http.get<User>(`${this.base}/${id}`);
  }

  create(payload: CreateUserRequest): Observable<User> {
    if (environment.useMocks) {
      const newUser: User = { id: Date.now(), ...payload, isActive: true, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() };
      MOCK_USERS.push(newUser);
      return of(newUser).pipe(delay(environment.mockDelay));
    }
    return this.http.post<User>(this.base, payload);
  }

  update(id: number, payload: UpdateUserRequest): Observable<User> {
    if (environment.useMocks) {
      const idx = MOCK_USERS.findIndex(u => u.id === id);
      MOCK_USERS[idx] = { ...MOCK_USERS[idx], ...payload, updatedAt: new Date().toISOString() };
      return of(MOCK_USERS[idx]).pipe(delay(environment.mockDelay));
    }
    return this.http.put<User>(`${this.base}/${id}`, payload);
  }

  toggleActive(id: number): Observable<User> {
    if (environment.useMocks) {
      const idx = MOCK_USERS.findIndex(u => u.id === id);
      MOCK_USERS[idx] = { ...MOCK_USERS[idx], isActive: !MOCK_USERS[idx].isActive, updatedAt: new Date().toISOString() };
      return of(MOCK_USERS[idx]).pipe(delay(environment.mockDelay));
    }
    return this.http.patch<User>(`${this.base}/${id}/toggle-active`, {});
  }
}
