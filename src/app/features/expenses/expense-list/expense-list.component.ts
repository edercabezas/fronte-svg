import { Component, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { NgClass, CurrencyPipe, DatePipe } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatDialogModule } from '@angular/material/dialog';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { ExpensesService } from '../../../core/services/expenses.service';
import { ToastService } from '../../../core/services/toast.service';
import { Expense, ExpenseCategory, ExpenseSummaryResponse } from '../../../core/models/expense.models';

@Component({
  selector: 'app-expense-list',
  standalone: true,
  imports: [RouterLink, NgClass, CurrencyPipe, DatePipe, ReactiveFormsModule, MatTableModule, MatButtonModule, MatIconModule, MatCardModule, MatFormFieldModule, MatInputModule, MatSelectModule, MatDialogModule, MatProgressBarModule],
  templateUrl: './expense-list.component.html',
  styleUrl: './expense-list.component.scss'
})
export class ExpenseListComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private svc = inject(ExpensesService);
  private toast = inject(ToastService);
  private fb = inject(FormBuilder);

  eventId = Number(this.route.snapshot.paramMap.get('eventId'));
  loading = signal(true);
  expenses = signal<Expense[]>([]);
  summary = signal<ExpenseSummaryResponse | null>(null);
  showForm = signal(false);
  columns = ['date', 'category', 'description', 'qty', 'unit', 'total', 'actions'];

  form = this.fb.group({
    category: ['refreshments' as ExpenseCategory, Validators.required],
    description: ['', Validators.required],
    quantity: [1, [Validators.required, Validators.min(1)]],
    unitPrice: [0, [Validators.required, Validators.min(0)]],
    expenseDate: [new Date().toISOString().split('T')[0], Validators.required],
  });

  ngOnInit(): void { this.load(); }

  load(): void {
    this.loading.set(true);
    this.svc.getByEvent(this.eventId).subscribe(data => { this.expenses.set(data); this.loading.set(false); });
    this.svc.getSummary(this.eventId).subscribe(s => this.summary.set(s));
  }

  onSubmit(): void {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }
    this.svc.create(this.eventId, this.form.value as any).subscribe({
      next: () => { this.toast.success('Gasto registrado'); this.showForm.set(false); this.form.reset(); this.load(); },
    });
  }

  delete(e: Expense): void {
    if (!confirm('¿Eliminar este gasto?')) return;
    this.svc.delete(this.eventId, e.id).subscribe(() => { this.toast.success('Gasto eliminado'); this.load(); });
  }

  categoryLabel(c: ExpenseCategory): string {
    const map: Record<ExpenseCategory, string> = { refreshments: 'Refrigerios', transport: 'Transporte', materials: 'Materiales', other: 'Otros' };
    return map[c];
  }

  categoryIcon(c: ExpenseCategory): string {
    const map: Record<ExpenseCategory, string> = { refreshments: 'local_cafe', transport: 'directions_car', materials: 'inventory_2', other: 'receipt' };
    return map[c];
  }
}
