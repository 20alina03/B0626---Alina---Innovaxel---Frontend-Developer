import { useState, useMemo } from "react";
import { Plus, List, BarChart2, TrendingUp, TrendingDown, DollarSign } from "lucide-react";
import { useExpenses } from "./hooks/useExpenses";
import ExpenseForm from "./components/ExpenseForm";
import ExpenseTable from "./components/ExpenseTable";
import SummaryChart from "./components/SummaryChart";
import FilterBar from "./components/FilterBar";
import Modal from "./components/Modal";
import type { Expense, ExpenseFormData } from "./types/types";
import { formatCurrency } from "./utils/formatters";

const TABS = [
  { id: "expenses", label: "Transactions", icon: List },
  { id: "summary", label: "Analytics", icon: BarChart2 },
];

const EMPTY_FILTERS = { search: "", category: "", dateFrom: "", dateTo: "" };

export default function App() {
  const { expenses, loading, error, addExpense, editExpense, removeExpense } =
    useExpenses();

  const [activeTab, setActiveTab] = useState("expenses");
  const [modalOpen, setModalOpen] = useState(false);
  const [editingExpense, setEditingExpense] = useState<Expense | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [filters, setFilters] = useState(EMPTY_FILTERS);

  const filteredExpenses = useMemo(() => {
    return expenses.filter((e) => {
      const matchSearch =
        !filters.search ||
        e.title.toLowerCase().includes(filters.search.toLowerCase()) ||
        (e.notes || "").toLowerCase().includes(filters.search.toLowerCase());

      const matchCategory = !filters.category || e.category === filters.category;

      const matchFrom = !filters.dateFrom || e.date >= filters.dateFrom;
      const matchTo = !filters.dateTo || e.date <= filters.dateTo;

      return matchSearch && matchCategory && matchFrom && matchTo;
    });
  }, [expenses, filters]);

  // Summary stats
  const total = useMemo(() => expenses.reduce((s, e) => s + e.amount, 0), [expenses]);
  const thisMonth = useMemo(() => {
    const now = new Date();
    const m = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
    return expenses.filter(e => e.date.startsWith(m)).reduce((s, e) => s + e.amount, 0);
  }, [expenses]);
  const lastMonth = useMemo(() => {
    const now = new Date();
    now.setMonth(now.getMonth() - 1);
    const m = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
    return expenses.filter(e => e.date.startsWith(m)).reduce((s, e) => s + e.amount, 0);
  }, [expenses]);
  const monthDelta = thisMonth - lastMonth;

  const openAddModal = () => {
    setEditingExpense(null);
    setModalOpen(true);
  };

  const openEditModal = (expense: Expense) => {
    setEditingExpense(expense);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setEditingExpense(null);
  };

  const handleSubmit = async (data: ExpenseFormData) => {
    try {
      setIsSubmitting(true);
      if (editingExpense) {
        await editExpense(editingExpense.id, data);
      } else {
        await addExpense(data);
      }
      closeModal();
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Delete this expense?")) return;
    await removeExpense(id);
  };

  return (
    <div className="min-h-screen text-gray-900">
      <div aria-hidden className="bg-blobs" />
      {/* Top Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 h-14 sm:h-16 flex items-center justify-between gap-2">
          {/* Logo */}
          <div className="flex items-center gap-2.5 min-w-0">
            <img src="/logo.svg" alt="SpendSync" className="w-8 h-8 sm:w-9 sm:h-9 flex-shrink-0" />
            <span className="font-bold text-gray-900 text-base sm:text-lg tracking-tight truncate">SpendSync</span>
          </div>

          {/* Right */}
          <button onClick={openAddModal} className="btn-primary text-xs sm:text-sm px-2.5 sm:px-4 py-1.5 sm:py-2.5 flex-shrink-0">
            <Plus size={13} strokeWidth={2.5} />
            <span className="hidden sm:inline">Add Expense</span>
            <span className="sm:hidden">Add</span>
          </button>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-3 sm:px-6 py-4 sm:py-8">
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 rounded-lg px-4 py-3 mb-6 text-sm">
            {error}
          </div>
        )}

        {/* Stats Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-4 mb-6 sm:mb-8">
          {/* Total All Time */}
          <div className="bg-white border border-gray-100 rounded-lg sm:rounded-xl p-3 sm:p-5 shadow-sm">
            <div className="flex items-center justify-between mb-2 sm:mb-3">
              <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Total Spent</span>
              <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <DollarSign size={13} className="text-gray-500" />
              </div>
            </div>
            <p className="text-xl sm:text-2xl font-bold text-gray-900">{formatCurrency(total)}</p>
            <p className="text-xs text-gray-400 mt-1">{expenses.length} trans.</p>
          </div>

          {/* This Month */}
          <div className="bg-white border border-gray-100 rounded-lg sm:rounded-xl p-3 sm:p-5 shadow-sm">
            <div className="flex items-center justify-between mb-2 sm:mb-3">
              <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">This Month</span>
              <div className="w-8 h-8 bg-sky-50 rounded-lg flex items-center justify-center flex-shrink-0">
                <BarChart2 size={13} className="text-sky-500" />
              </div>
            </div>
            <p className="text-xl sm:text-2xl font-bold text-gray-900">{formatCurrency(thisMonth)}</p>
            <p className="text-xs text-gray-400 mt-1">This period</p>
          </div>

          {/* vs Last Month */}
          <div className="bg-white border border-gray-100 rounded-lg sm:rounded-xl p-3 sm:p-5 shadow-sm relative overflow-hidden sm:col-span-2 lg:col-span-1">
            <div
              className="absolute top-0 left-0 w-full h-1 rounded-t-lg sm:rounded-t-xl"
              style={{ backgroundColor: monthDelta >= 0 ? "#ef4444" : "#10b981" }}
            />
            <div className="flex items-center justify-between mb-2 sm:mb-3">
              <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">vs Last</span>
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${monthDelta >= 0 ? "bg-red-50" : "bg-green-50"}`}>
                {monthDelta >= 0
                  ? <TrendingUp size={13} className="text-red-500" />
                  : <TrendingDown size={13} className="text-green-500" />
                }
              </div>
            </div>
            <p className={`text-xl sm:text-2xl font-bold ${monthDelta >= 0 ? "text-red-500" : "text-green-600"}`}>
              {monthDelta >= 0 ? "+" : ""}{formatCurrency(monthDelta)}
            </p>
            <p className="text-xs text-gray-400 mt-1">Prior month</p>
          </div>
        </div>

        {/* Tab Bar */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4 mb-4 sm:mb-6">
          <div className="flex items-center gap-1 bg-gray-100 p-1 rounded-lg w-full sm:w-auto">
            {TABS.map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setActiveTab(id)}
                className={`flex items-center gap-1 sm:gap-2 px-2 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm font-medium rounded-md transition-all duration-150 cursor-pointer flex-1 sm:flex-none justify-center sm:justify-start ${
                  activeTab === id
                    ? "bg-white text-gray-900 shadow-sm border border-gray-200"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                <Icon size={13} />
                {label}
              </button>
            ))}
          </div>

          {activeTab === "expenses" && (
            <span className="text-xs sm:text-sm text-gray-400 whitespace-nowrap">
              <span className="font-semibold text-gray-700">{filteredExpenses.length}</span>
              <span className="hidden sm:inline">{" "}of{" "}</span>
              <span className="sm:hidden">/</span>
              <span className="font-semibold text-gray-700">{expenses.length}</span>
            </span>
          )}
        </div>

        {/* Content */}
        {loading ? (
          <div className="flex items-center justify-center py-16 sm:py-32">
            <div className="w-6 sm:w-8 h-6 sm:h-8 border-2 border-gray-300 border-t-gray-700 rounded-full animate-spin" />
          </div>
        ) : (
          <>
            {activeTab === "expenses" && (
              <div className="space-y-5">
                <FilterBar filters={filters} onChange={setFilters} />
                <ExpenseTable
                  expenses={filteredExpenses}
                  onEdit={openEditModal}
                  onDelete={handleDelete}
                />
              </div>
            )}

            {activeTab === "summary" && (
              <SummaryChart expenses={filteredExpenses.length ? filteredExpenses : expenses} />
            )}
          </>
        )}
      </div>

      {/* Modal */}
      <Modal
        isOpen={modalOpen}
        onClose={closeModal}
        title={editingExpense ? "Edit Expense" : "New Expense"}
      >
        <ExpenseForm
          initialValues={editingExpense || {}}
          onSubmit={handleSubmit}
          onCancel={closeModal}
          isSubmitting={isSubmitting}
        />
      </Modal>
    </div>
  );
}