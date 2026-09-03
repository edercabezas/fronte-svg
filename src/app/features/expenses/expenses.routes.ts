import { Routes } from '@angular/router';

export const EXPENSES_ROUTES: Routes = [
  { path: 'events/:eventId/expenses', loadComponent: () => import('./expense-list/expense-list.component').then(m => m.ExpenseListComponent) },
];
