import { Pencil, Trash2 } from "lucide-react";
import { formatCurrency, formatDate, CATEGORY_COLORS, CATEGORY_ICONS } from "../utils/formatters";
import type { Expense } from "../types/types";

interface ExpenseCardProps {
  expense: Expense;
  onEdit: (expense: Expense) => void;
  onDelete: (id: string) => void;
}

const ExpenseCard = ({ expense, onEdit, onDelete }: ExpenseCardProps) => {
  const color = CATEGORY_COLORS[expense.category] || "#64748b";
  const icon = CATEGORY_ICONS[expense.category] || "📦";

  return (
    <div className="bg-[#0f1929] border border-[#1e3050] rounded-xl p-4 hover:border-[#2d4a72] transition-all duration-200 group">
      {/* Top row */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0">
          {/* Category icon circle */}
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center text-lg shrink-0"
            style={{ backgroundColor: `${color}22`, border: `1px solid ${color}44` }}
          >
            {icon}
          </div>

          <div className="min-w-0">
            <p className="font-semibold text-white text-sm leading-tight truncate">
              {expense.title}
            </p>
            <p className="text-xs text-slate-500 mt-0.5">{formatDate(expense.date)}</p>
          </div>
        </div>

        {/* Amount */}
        <span
          className="text-sm font-bold shrink-0"
          style={{ color }}
        >
          {formatCurrency(expense.amount)}
        </span>
      </div>

      {/* Category badge */}
      <div className="mt-3 flex items-center justify-between">
        <span
          className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium"
          style={{
            backgroundColor: `${color}22`,
            color,
            border: `1px solid ${color}44`,
          }}
        >
          {expense.category}
        </span>

        {/* Actions — visible on hover */}
        <div className="flex gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={() => onEdit(expense)}
            className="p-1.5 rounded-lg bg-[#1e3050] hover:bg-blue-500/20 text-slate-400 hover:text-blue-400 transition-colors"
            title="Edit"
          >
            <Pencil size={13} />
          </button>
          <button
            onClick={() => onDelete(expense.id)}
            className="p-1.5 rounded-lg bg-[#1e3050] hover:bg-red-500/20 text-slate-400 hover:text-red-400 transition-colors"
            title="Delete"
          >
            <Trash2 size={13} />
          </button>
        </div>
      </div>

      {/* Notes */}
      {expense.notes && (
        <p className="text-xs text-slate-500 mt-2 leading-relaxed line-clamp-2">
          {expense.notes}
        </p>
      )}
    </div>
  );
};

export default ExpenseCard;