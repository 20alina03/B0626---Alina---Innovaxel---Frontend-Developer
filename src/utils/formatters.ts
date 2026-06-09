import type { Expense } from "../types/types";

export const CATEGORIES: string[] = [
  "Food",
  "Utilities",
  "Transport",
  "Health",
  "Education",
  "Entertainment",
  "Shopping",
  "Other",
];

export const CATEGORY_COLORS: Record<string, string> = {
  Food: "#10b981",
  Utilities: "#6366f1",
  Transport: "#f59e0b",
  Health: "#ef4444",
  Education: "#8b5cf6",
  Entertainment: "#ec4899",
  Shopping: "#06b6d4",
  Other: "#64748b",
};

export const CATEGORY_ICONS: Record<string, string> = {
  Food: "🍽️",
  Utilities: "⚡",
  Transport: "🚗",
  Health: "❤️",
  Education: "📚",
  Entertainment: "🎬",
  Shopping: "🛍️",
  Other: "📦",
};

export const formatCurrency = (amount: number): string =>
  new Intl.NumberFormat("en-PK", {
    style: "currency",
    currency: "PKR",
    maximumFractionDigits: 0,
  }).format(amount);

export const formatDate = (dateStr: string): string =>
  new Date(dateStr).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

export const sortByDateDesc = (expenses: Expense[]): Expense[] =>
  [...expenses].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

export const groupByCategory = (
  expenses: Expense[]
): Record<string, number> =>
  expenses.reduce<Record<string, number>>((acc, expense) => {
    acc[expense.category] = (acc[expense.category] || 0) + expense.amount;
    return acc;
  }, {});