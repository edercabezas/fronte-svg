import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, of, delay, tap } from 'rxjs';
import { environment } from '../../../environments/environment';
import { LoginRequest, LoginResponse, User, ChangePasswordRequest } from '../models';
import { MOCK_USERS } from '../mocks/mock-data';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private http = inject(HttpClient);
  private router = inject(Router);
  private readonly TOKEN_KEY = 'cert_token';
  private readonly USER_KEY = 'cert_user';

  currentUser = signal<User | null>(this.getStoredUser());
  isAuthenticated = signal<boolean>(!!this.getStoredToken());

  login(credentials: LoginRequest): Observable<LoginResponse> {
    if (environment.useMocks) {
      const user = MOCK_USERS.find(u => u.email === credentials.email && u.isActive);
      if (user) {
        const response: LoginResponse = { token: 'mock-jwt-token-' + user.id, user };
        return of(response).pipe(
          delay(environment.mockDelay),
          tap(res => this.setSession(res))
        );
      }
      throw new Error('Credenciales inválidas');
    }
    return this.http.post<LoginResponse>(`${environment.apiUrl}/auth/login`, credentials).pipe(
      tap(res => this.setSession(res))
    );
  }

  logout(): void {
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.USER_KEY);
    this.currentUser.set(null);
    this.isAuthenticated.set(false);
    this.router.navigate(['/']);
  }

  getMe(): Observable<User> {
    if (environment.useMocks) {
      const user = this.currentUser();
      return of(user!).pipe(delay(environment.mockDelay));
    }
    return this.http.get<User>(`${environment.apiUrl}/auth/me`);
  }

  changePassword(payload: ChangePasswordRequest): Observable<void> {
    if (environment.useMocks) {
      return of(undefined).pipe(delay(environment.mockDelay));
    }
    return this.http.put<void>(`${environment.apiUrl}/auth/change-password`, payload);
  }

  getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  isAdmin(): boolean {
    return this.currentUser()?.role === 'administrador';
  }

  isAdministrativo(): boolean {
    return this.currentUser()?.role === 'administrativo';
  }

  isCapacitador(): boolean {
    return this.currentUser()?.role === 'capacitador';
  }

  // Rol restringido: solo puede crear eventos (manual o carga masiva), nada más
  isCargador(): boolean {
    return this.currentUser()?.role === 'cargador';
  }

  // Administrador y administrativo comparten permisos de gestión (eventos, participantes, gastos, reportes)
  isManager(): boolean {
    return this.isAdmin() || this.isAdministrativo();
  }

  // Administrador, administrativo o cargador: pueden crear eventos
  canCreateEvents(): boolean {
    return this.isManager() || this.isCargador();
  }

  private setSession(response: LoginResponse): void {
    localStorage.setItem(this.TOKEN_KEY, response.token);
    localStorage.setItem(this.USER_KEY, JSON.stringify(response.user));
    this.currentUser.set(response.user);
    this.isAuthenticated.set(true);
  }

  private getStoredToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  private getStoredUser(): User | null {
    const stored = localStorage.getItem(this.USER_KEY);
    return stored ? JSON.parse(stored) : null;
  }
}
