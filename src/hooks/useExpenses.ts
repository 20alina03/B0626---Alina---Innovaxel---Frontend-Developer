import { useState, useEffect, useCallback } from "react";
import {
  getExpenses,
  createExpense,
  updateExpense,
  deleteExpense,
} from "../api/expenseApi";
import { sortByDateDesc } from "../utils/formatters";
import type { Expense, ExpenseFormData } from "../types/types";

interface UseExpensesReturn {
  expenses: Expense[];
  loading: boolean;
  error: string | null;
  addExpense: (data: ExpenseFormData) => Promise<Expense>;
  editExpense: (id: string, data: ExpenseFormData) => Promise<Expense>;
  removeExpense: (id: string) => Promise<void>;
}

export const useExpenses = (): UseExpensesReturn => {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchExpenses = useCallback(async (): Promise<void> => {
    try {
      setLoading(true);
      setError(null);
      const data = await getExpenses();
      setExpenses(sortByDateDesc(data));
    } catch {
      setError("Failed to load expenses.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchExpenses();
  }, [fetchExpenses]);

  const addExpense = async (data: ExpenseFormData): Promise<Expense> => {
    const created = await createExpense(data);
    setExpenses((prev) => sortByDateDesc([created, ...prev]));
    return created;
  };

  const editExpense = async (
    id: string,
    data: ExpenseFormData
  ): Promise<Expense> => {
    const updated = await updateExpense(id, data);
    setExpenses((prev) =>
      sortByDateDesc(prev.map((e) => (e.id === id ? updated : e)))
    );
    return updated;
  };

  const removeExpense = async (id: string): Promise<void> => {
    await deleteExpense(id);
    setExpenses((prev) => prev.filter((e) => e.id !== id));
  };

  return { expenses, loading, error, addExpense, editExpense, removeExpense };
};