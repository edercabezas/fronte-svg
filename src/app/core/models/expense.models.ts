export type ExpenseCategory = 'refreshments' | 'transport' | 'materials' | 'other';

export interface Expense {
  id: number;
  eventId: number;
  registeredBy: number;
  registeredByName?: string;
  category: ExpenseCategory;
  description: string;
  quantity: number;
  unitPrice: number;
  amount: number;
  expenseDate: string;
  receiptFile?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateExpenseRequest {
  category: ExpenseCategory;
  description: string;
  quantity: number;
  unitPrice: number;
  expenseDate: string;
}

export interface UpdateExpenseRequest extends Partial<CreateExpenseRequest> {}

export interface ExpenseSummary {
  category: ExpenseCategory;
  total: number;
  count: number;
}

export interface ExpenseSummaryResponse {
  items: ExpenseSummary[];
  grandTotal: number;
}
