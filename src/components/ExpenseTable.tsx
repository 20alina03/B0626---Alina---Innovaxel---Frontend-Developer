import { Pencil, Trash2 } from "lucide-react";
import {
  formatCurrency,
  formatDate,
  CATEGORY_COLORS,
  CATEGORY_ICONS,
} from "../utils/formatters";
import ExpenseCard from "./ExpenseCard";
import type { Expense } from "../types/types";

interface CategoryBadgeProps {
  category: string;
}

const CategoryBadge = ({ category }: CategoryBadgeProps) => {
  const color = CATEGORY_COLORS[category] || "#64748b";
  const icon = CATEGORY_ICONS[category] || "📦";
  return (
    <span
      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium"
      style={{
        backgroundColor: `${color}22`,
        color,
        border: `1px solid ${color}44`,
      }}
    >
      <span>{icon}</span>
      {category}
    </span>
  );
};

interface ExpenseTableProps {
  expenses: Expense[];
  onEdit: (expense: Expense) => void;
  onDelete: (id: string) => void;
}

const ExpenseTable = ({ expenses, onEdit, onDelete }: ExpenseTableProps) => {
  if (expenses.length === 0) {
    return (
      <div className="bg-[#0f1929] border border-[#1e3050] rounded-xl text-center py-20">
        <div className="text-5xl mb-4 opacity-40">💸</div>
        <p className="text-slate-400 font-medium">No expenses found</p>
        <p className="text-slate-600 text-sm mt-1">
          Add your first expense or adjust your filters.
        </p>
      </div>
    );
  }

  return (
    <>
      {/* Desktop Table */}
      <div className="hidden md:block bg-[#0f1929] border border-[#1e3050] rounded-xl overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-[#1e3050]">
              {["Date", "Title", "Category", "Amount", "Notes", "Actions"].map((h) => (
                <th
                  key={h}
                  className="text-left text-xs font-semibold text-slate-500 uppercase tracking-widest px-5 py-3.5"
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {expenses.map((expense, i) => (
              <tr
                key={expense.id}
                className={`transition-colors hover:bg-[#1a2a42] ${
                  i !== expenses.length - 1 ? "border-b border-[#1e3050]/60" : ""
                }`}
              >
                <td className="px-5 py-4 text-slate-500 whitespace-nowrap text-xs">
                  {formatDate(expense.date)}
                </td>
                <td className="px-5 py-4 font-medium text-white">
                  {expense.title}
                </td>
                <td className="px-5 py-4">
                  <CategoryBadge category={expense.category} />
                </td>
                <td className="px-5 py-4 font-semibold text-white">
                  {formatCurrency(expense.amount)}
                </td>
                <td className="px-5 py-4 text-slate-500 max-w-[160px] truncate text-xs">
                  {expense.notes || "-"}
                </td>
                <td className="px-5 py-4">
                  <div className="flex gap-2">
                    <button
                      onClick={() => onEdit(expense)}
                      className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 text-xs font-medium transition-colors"
                    >
                      <Pencil size={12} /> Edit
                    </button>
                    <button
                      onClick={() => onDelete(expense.id)}
                      className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 text-xs font-medium transition-colors"
                    >
                      <Trash2 size={12} /> Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Card Grid */}
      <div className="md:hidden grid grid-cols-1 gap-3">
        {expenses.map((expense) => (
          <ExpenseCard
            key={expense.id}
            expense={expense}
            onEdit={onEdit}
            onDelete={onDelete}
          />
        ))}
      </div>
    </>
  );
};

export default ExpenseTable;