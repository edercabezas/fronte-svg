import { Routes } from '@angular/router';
import { eventCreatorGuard } from '../../core/guards/role.guard';

export const EVENTS_ROUTES: Routes = [
  { path: '', loadComponent: () => import('./event-list/event-list.component').then(m => m.EventListComponent) },
  { path: 'new', canActivate: [eventCreatorGuard], loadComponent: () => import('./event-form/event-form.component').then(m => m.EventFormComponent) },
  { path: 'import', canActivate: [eventCreatorGuard], loadComponent: () => import('./event-import/event-import.component').then(m => m.EventImportComponent) },
  { path: ':id', loadComponent: () => import('./event-detail/event-detail.component').then(m => m.EventDetailComponent) },
  // Edición: administrador/administrativo (todos los eventos), capacitador y cargador (solo el suyo — el backend lo valida y devuelve 403)
  { path: ':id/edit', loadComponent: () => import('./event-form/event-form.component').then(m => m.EventFormComponent) },
];
