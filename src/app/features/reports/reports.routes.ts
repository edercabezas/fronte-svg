import { Routes } from '@angular/router';

export const REPORTS_ROUTES: Routes = [
  { path: 'events/:eventId/reports', loadComponent: () => import('./report-center/report-center.component').then(m => m.ReportCenterComponent) },
];
