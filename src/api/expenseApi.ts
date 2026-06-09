// Fake API layer — simulates async REST-like CRUD with localStorage persistence.
// No backend needed. Data is seeded from initialData.json on first load.

import { v4 as uuidv4 } from "uuid";
import type { Expense, ExpenseFormData } from "../types/types";
import initialData from "../data/initialData.json";

const STORAGE_KEY = "expense_tracker_data";
const SIMULATED_DELAY = 150;

const delay = (ms: number): Promise<void> =>
  new Promise((res) => setTimeout(res, ms));

const readStorage = (): Expense[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw) as Expense[];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(initialData));
    return initialData as Expense[];
  } catch {
    return [];
  }
};

const writeStorage = (data: Expense[]): void => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
};

// GET /expenses
export const getExpenses = async (): Promise<Expense[]> => {
  await delay(SIMULATED_DELAY);
  return readStorage();
};

// POST /expenses
export const createExpense = async (
  expenseData: ExpenseFormData
): Promise<Expense> => {
  await delay(SIMULATED_DELAY);
  const expenses = readStorage();
  const newExpense: Expense = { ...expenseData, id: uuidv4() };
  writeStorage([newExpense, ...expenses]);
  return newExpense;
};

// PUT /expenses/:id
export const updateExpense = async (
  id: string,
  expenseData: ExpenseFormData
): Promise<Expense> => {
  await delay(SIMULATED_DELAY);
  const expenses = readStorage();
  const index = expenses.findIndex((e: Expense) => e.id === id);
  if (index === -1) throw new Error(`Expense with id "${id}" not found`);
  const updated: Expense = { ...expenses[index], ...expenseData, id };
  expenses[index] = updated;
  writeStorage(expenses);
  return updated;
};

// DELETE /expenses/:id
export const deleteExpense = async (id: string): Promise<string> => {
  await delay(SIMULATED_DELAY);
  const expenses = readStorage();
  const filtered = expenses.filter((e: Expense) => e.id !== id);
  writeStorage(filtered);
  return id;
};