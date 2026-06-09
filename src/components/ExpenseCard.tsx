import { Pencil, Trash2 } from "lucide-react";
import { formatCurrency, formatDate, CATEGORY_COLORS } from "../utils/formatters";
import type { Expense } from "../types/types";

interface ExpenseCardProps {
  expense: Expense;
  onEdit: (expense: Expense) => void;
  onDelete: (id: string) => void;
}

const ExpenseCard = ({ expense, onEdit, onDelete }: ExpenseCardProps) => {
  const color = CATEGORY_COLORS[expense.category] || "#6B7280";

  return (
    <div className="bg-white border border-gray-100 rounded-xl p-4 hover:border-gray-300 transition-all duration-150 shadow-sm group">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0">
          {/* Color dot */}
          <div
            className="w-2.5 h-2.5 rounded-full shrink-0 mt-1"
            style={{ backgroundColor: color }}
          />
          <div className="min-w-0">
            <p className="font-semibold text-gray-900 text-sm leading-snug truncate">
              {expense.title}
            </p>
            <p className="text-xs text-gray-400 mt-0.5">{formatDate(expense.date)}</p>
          </div>
        </div>

        <span className="text-sm font-bold text-gray-900 shrink-0">
          {formatCurrency(expense.amount)}
        </span>
      </div>

      <div className="mt-3 flex items-center justify-between">
        <span
          className="inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-medium border"
          style={{
            backgroundColor: `${color}15`,
            color,
            borderColor: `${color}30`,
          }}
        >
          {expense.category}
        </span>

        <div className="flex gap-2 items-center">
          <button
            onClick={() => onEdit(expense)}
            className="btn-edit"
            title="Edit"
          >
            <Pencil size={14} /> <span className="ml-1.5">Edit</span>
          </button>
          <button
            onClick={() => onDelete(expense.id)}
            className="btn-danger"
            title="Delete"
          >
            <Trash2 size={14} /> <span className="ml-1.5">Delete</span>
          </button>
        </div>
      </div>

      {expense.notes && (
        <p className="text-xs text-gray-400 mt-2 leading-relaxed line-clamp-2">
          {expense.notes}
        </p>
      )}
    </div>
  );
};

export default ExpenseCard;