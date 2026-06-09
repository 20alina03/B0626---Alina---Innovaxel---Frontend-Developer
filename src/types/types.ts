export interface Expense {
  id: string;
  title: string;
  amount: number;
  category: string;
  date: string;
  notes?: string;
}

export type ExpenseFormData = Omit<Expense, "id">;

export interface Filters {
  search: string;
  category: string;
  dateFrom: string;
  dateTo: string;
}