import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { adminGuard, noCargadorGuard } from './core/guards/role.guard';
import { MainLayoutComponent } from './layout/main-layout/main-layout.component';

export const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./features/public/public.routes').then(m => m.PUBLIC_ROUTES),
  },
  {
    path: 'auth',
    loadChildren: () => import('./features/auth/auth.routes').then(m => m.AUTH_ROUTES),
  },
  {
    path: '',
    component: MainLayoutComponent,
    canActivate: [authGuard],
    children: [
      {
        path: 'dashboard',
        canActivate: [noCargadorGuard],
        loadChildren: () => import('./features/dashboard/dashboard.routes').then(m => m.DASHBOARD_ROUTES),
      },
      {
        path: 'events',
        loadChildren: () => import('./features/events/events.routes').then(m => m.EVENTS_ROUTES),
      },
      {
        path: '',
        canActivate: [noCargadorGuard],
        loadChildren: () => import('./features/participants/participants.routes').then(m => m.PARTICIPANTS_ROUTES),
      },
      {
        path: '',
        canActivate: [noCargadorGuard],
        loadChildren: () => import('./features/evidence/evidence.routes').then(m => m.EVIDENCE_ROUTES),
      },
      {
        path: '',
        canActivate: [noCargadorGuard],
        loadChildren: () => import('./features/expenses/expenses.routes').then(m => m.EXPENSES_ROUTES),
      },
      {
        path: '',
        canActivate: [noCargadorGuard],
        loadChildren: () => import('./features/reports/reports.routes').then(m => m.REPORTS_ROUTES),
      },
      {
        path: 'users',
        canActivate: [adminGuard],
        loadChildren: () => import('./features/users/users.routes').then(m => m.USERS_ROUTES),
      },
      {
        path: 'auth/change-password',
        loadComponent: () => import('./features/auth/change-password/change-password.component').then(m => m.ChangePasswordComponent),
      },
    ],
  },
  { path: '**', redirectTo: '/' },
];
