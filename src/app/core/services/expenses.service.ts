import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, delay } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Expense, CreateExpenseRequest, UpdateExpenseRequest, ExpenseSummaryResponse } from '../models/expense.models';
import { MOCK_EXPENSES } from '../mocks/mock-data';

@Injectable({ providedIn: 'root' })
export class ExpensesService {
  private http = inject(HttpClient);
  private readonly base = `${environment.apiUrl}/events`;

  getByEvent(eventId: number): Observable<Expense[]> {
    if (environment.useMocks) {
      const data = MOCK_EXPENSES.filter(e => e.eventId === eventId);
      return of(data).pipe(delay(environment.mockDelay));
    }
    return this.http.get<Expense[]>(`${this.base}/${eventId}/expenses`);
  }

  getSummary(eventId: number): Observable<ExpenseSummaryResponse> {
    if (environment.useMocks) {
      const expenses = MOCK_EXPENSES.filter(e => e.eventId === eventId);
      const grouped: Record<string, { total: number; count: number }> = {};
      expenses.forEach(e => {
        if (!grouped[e.category]) grouped[e.category] = { total: 0, count: 0 };
        grouped[e.category].total += e.amount;
        grouped[e.category].count++;
      });
      const items = Object.entries(grouped).map(([category, val]) => ({ category: category as any, ...val }));
      const grandTotal = expenses.reduce((sum, e) => sum + e.amount, 0);
      return of({ items, grandTotal }).pipe(delay(environment.mockDelay));
    }
    return this.http.get<ExpenseSummaryResponse>(`${this.base}/${eventId}/expenses/summary`);
  }

  create(eventId: number, payload: CreateExpenseRequest): Observable<Expense> {
    if (environment.useMocks) {
      const newE: Expense = { id: Date.now(), eventId, registeredBy: 1, registeredByName: 'Admin Master', ...payload, amount: payload.quantity * payload.unitPrice, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() };
      MOCK_EXPENSES.push(newE);
      return of(newE).pipe(delay(environment.mockDelay));
    }
    return this.http.post<Expense>(`${this.base}/${eventId}/expenses`, payload);
  }

  update(eventId: number, expenseId: number, payload: UpdateExpenseRequest): Observable<Expense> {
    if (environment.useMocks) {
      const idx = MOCK_EXPENSES.findIndex(e => e.id === expenseId);
      MOCK_EXPENSES[idx] = { ...MOCK_EXPENSES[idx], ...payload, updatedAt: new Date().toISOString() };
      return of(MOCK_EXPENSES[idx]).pipe(delay(environment.mockDelay));
    }
    return this.http.put<Expense>(`${this.base}/${eventId}/expenses/${expenseId}`, payload);
  }

  delete(eventId: number, expenseId: number): Observable<void> {
    if (environment.useMocks) {
      const idx = MOCK_EXPENSES.findIndex(e => e.id === expenseId);
      MOCK_EXPENSES.splice(idx, 1);
      return of(undefined).pipe(delay(environment.mockDelay));
    }
    return this.http.delete<void>(`${this.base}/${eventId}/expenses/${expenseId}`);
  }
}
