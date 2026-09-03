import { Routes } from '@angular/router';

export const EVIDENCE_ROUTES: Routes = [
  { path: 'events/:eventId/evidence', loadComponent: () => import('./evidence-gallery/evidence-gallery.component').then(m => m.EvidenceGalleryComponent) },
];
