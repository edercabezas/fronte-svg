import { Routes } from '@angular/router';
import { managerGuard, eventCreatorGuard, noCargadorGuard } from '../../core/guards/role.guard';

export const EVENTS_ROUTES: Routes = [
  { path: '', canActivate: [noCargadorGuard], loadComponent: () => import('./event-list/event-list.component').then(m => m.EventListComponent) },
  { path: 'new', canActivate: [eventCreatorGuard], loadComponent: () => import('./event-form/event-form.component').then(m => m.EventFormComponent) },
  { path: 'import', canActivate: [eventCreatorGuard], loadComponent: () => import('./event-import/event-import.component').then(m => m.EventImportComponent) },
  { path: ':id', canActivate: [noCargadorGuard], loadComponent: () => import('./event-detail/event-detail.component').then(m => m.EventDetailComponent) },
  { path: ':id/edit', canActivate: [managerGuard], loadComponent: () => import('./event-form/event-form.component').then(m => m.EventFormComponent) },
];
