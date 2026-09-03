import { Routes } from '@angular/router';

export const PARTICIPANTS_ROUTES: Routes = [
  { path: 'registrations', loadComponent: () => import('./registrations/registrations.component').then(m => m.RegistrationsComponent) },
  { path: 'events/:eventId/participants', loadComponent: () => import('./participant-list/participant-list.component').then(m => m.ParticipantListComponent) },
  { path: 'events/:eventId/participants/new', loadComponent: () => import('./participant-form/participant-form.component').then(m => m.ParticipantFormComponent) },
  { path: 'events/:eventId/participants/import', loadComponent: () => import('./participant-import/participant-import.component').then(m => m.ParticipantImportComponent) },
  { path: 'events/:eventId/participants/:id/edit', loadComponent: () => import('./participant-form/participant-form.component').then(m => m.ParticipantFormComponent) },
];
