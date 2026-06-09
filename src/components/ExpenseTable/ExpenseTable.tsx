import './ExpenseTable.css';
import { Pencil, Trash2 } from "lucide-react";
import {
  formatCurrency,
  formatDate,
  CATEGORY_COLORS,
} from "../../utils/formatters";
import ExpenseCard from "../ExpenseCard";
import type { Expense } from "../../types/types";

interface CategoryBadgeProps {
  category: string;
}

const CategoryBadge = ({ category }: CategoryBadgeProps) => {
  const color = CATEGORY_COLORS[category] || "#6B7280";
  return (
    <span
      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium border"
      style={{
        backgroundColor: `${color}15`,
        color,
        borderColor: `${color}30`,
      }}
    >
      <span
        className="w-1.5 h-1.5 rounded-full flex-shrink-0"
        style={{ backgroundColor: color }}
      />
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
      <div className="bg-white border border-gray-100 rounded-lg sm:rounded-xl text-center py-12 sm:py-20 shadow-sm">
        <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center mx-auto mb-4">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="2" y="5" width="20" height="14" rx="2"/>
            <line x1="2" y1="10" x2="22" y2="10"/>
          </svg>
        </div>
        <p className="text-gray-700 font-semibold text-sm">No expenses found</p>
        <p className="text-gray-400 text-xs mt-1">
          Add your first expense or adjust your filters.
        </p>
      </div>
    );
  }

  return (
    <>
      {/* Desktop Table */}
      <div className="hidden md:block bg-white border border-gray-100 rounded-lg sm:rounded-xl overflow-hidden shadow-sm">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-100 bg-gray-50/60">
              {["Date", "Title", "Category", "Amount", "Notes", ""].map((h, i) => (
                <th
                  key={i}
                  className="text-left text-xs font-semibold text-gray-400 uppercase tracking-wider px-3 sm:px-5 py-2.5 sm:py-3.5"
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {expenses.map((expense) => (
              <tr
                key={expense.id}
                className="hover:bg-gray-50/70 transition-colors group"
              >
                <td className="px-3 sm:px-5 py-3 sm:py-4 text-gray-400 whitespace-nowrap text-xs font-medium">
                  {formatDate(expense.date)}
                </td>
                <td className="px-3 sm:px-5 py-3 sm:py-4 font-semibold text-gray-900 text-xs sm:text-sm truncate">
                  {expense.title}
                </td>
                <td className="px-3 sm:px-5 py-3 sm:py-4">
                  <CategoryBadge category={expense.category} />
                </td>
                <td className="px-3 sm:px-5 py-3 sm:py-4 font-bold text-gray-900 text-xs sm:text-sm tabular-nums">
                  {formatCurrency(expense.amount)}
                </td>
                <td className="px-3 sm:px-5 py-3 sm:py-4 text-gray-400 max-w-[120px] sm:max-w-[160px] truncate text-xs">
                  {expense.notes || <span className="text-gray-200">—</span>}
                </td>
                <td className="px-3 sm:px-5 py-3 sm:py-4">
                  <div className="flex gap-1.5 sm:gap-2 items-center transition-all">
                    <button
                      onClick={() => onEdit(expense)}
                      className="btn-edit text-xs sm:text-sm px-2 sm:px-3 py-1 sm:py-1.5"
                    >
                      <Pencil size={11} /> <span className="hidden sm:inline">Edit</span>
                    </button>
                    <button
                      onClick={() => onDelete(expense.id)}
                      className="btn-danger text-xs sm:text-sm px-2 sm:px-3 py-1 sm:py-1.5"
                    >
                      <Trash2 size={11} /> <span className="hidden sm:inline">Delete</span>
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Card Grid */}
      <div className="md:hidden grid grid-cols-1 gap-2 sm:gap-3">
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
