import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

// Ruta de inicio según el rol: el cargador solo tiene acceso a creación de eventos
export function homeRoute(auth: AuthService): string {
  return auth.isCargador() ? '/events/new' : '/dashboard';
}

export const adminGuard: CanActivateFn = () => {
  const auth = inject(AuthService);
  const router = inject(Router);
  if (auth.isAdmin()) return true;
  router.navigate([homeRoute(auth)]);
  return false;
};

export const managerGuard: CanActivateFn = () => {
  const auth = inject(AuthService);
  const router = inject(Router);
  if (auth.isManager()) return true;
  router.navigate([homeRoute(auth)]);
  return false;
};

// Puede crear eventos: administrador, administrativo o cargador
export const eventCreatorGuard: CanActivateFn = () => {
  const auth = inject(AuthService);
  const router = inject(Router);
  if (auth.canCreateEvents()) return true;
  router.navigate([homeRoute(auth)]);
  return false;
};

// Bloquea al rol cargador de pantallas que no le corresponden (dashboard, listados, registros, etc.)
export const noCargadorGuard: CanActivateFn = () => {
  const auth = inject(AuthService);
  const router = inject(Router);
  if (!auth.isCargador()) return true;
  router.navigate([homeRoute(auth)]);
  return false;
};
