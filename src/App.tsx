import { useState, useMemo } from "react";
import { Plus, LayoutDashboard, List, BarChart2 } from "lucide-react";
import { useExpenses } from "./hooks/useExpenses";
import ExpenseForm from "./components/ExpenseForm";
import ExpenseTable from "./components/ExpenseTable";
import SummaryChart from "./components/SummaryChart";
import FilterBar from "./components/FilterBar";
import Modal from "./components/Modal";
import type { Expense, ExpenseFormData } from "./types/types";
// ExpenseFormData = Omit<Expense, "id"> — all fields required except id

const TABS = [
  { id: "expenses", label: "Expenses", icon: List },
  { id: "summary", label: "Summary", icon: BarChart2 },
];

const EMPTY_FILTERS = { search: "", category: "", dateFrom: "", dateTo: "" };

export default function App() {
  const { expenses, loading, error, addExpense, editExpense, removeExpense } =
    useExpenses();

  const [activeTab, setActiveTab] = useState("expenses");
  const [modalOpen, setModalOpen] = useState(false);
  const [editingExpense, setEditingExpense] = useState<Expense | null>(null); // Fix: typed instead of null (was inferred as `never`)
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

  const openAddModal = () => {
    setEditingExpense(null);
    setModalOpen(true);
  };

  const openEditModal = (expense: Expense) => { // Fix: was implicitly `any`
    setEditingExpense(expense);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setEditingExpense(null);
  };

  // ExpenseFormData = Omit<Expense, "id"> — has all required fields, matches what editExpense/addExpense expect
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

  const handleDelete = async (id: string) => { // Fix: was implicitly `any`
    if (!window.confirm("Delete this expense?")) return;
    await removeExpense(id);
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white border-b border-slate-100 sticky top-0 z-40">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 bg-emerald-600 rounded-lg flex items-center justify-center">
              <LayoutDashboard size={16} className="text-white" />
            </div>
            <span className="font-semibold text-slate-800 text-lg">
              SpendLens
            </span>
          </div>

          <button onClick={openAddModal} className="btn-primary">
            <Plus size={16} /> Add Expense
          </button>
        </div>
      </header>

      {/* Tabs */}
      <div className="bg-white border-b border-slate-100">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <nav className="flex gap-1">
            {TABS.map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setActiveTab(id)}
                className={`flex items-center gap-2 px-4 py-3.5 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === id
                    ? "border-emerald-600 text-emerald-600"
                    : "border-transparent text-slate-500 hover:text-slate-700"
                }`}
              >
                <Icon size={15} />
                {label}
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Content */}
      <main className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg px-4 py-3 mb-6 text-sm">
            {error}
          </div>
        )}

        {loading ? (
          <div className="flex items-center justify-center py-24">
            <div className="w-8 h-8 border-2 border-emerald-600 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : (
          <>
            {activeTab === "expenses" && (
              <>
                <FilterBar filters={filters} onChange={setFilters} />
                <div className="flex items-center justify-between mb-4">
                  <p className="text-sm text-slate-500">
                    {filteredExpenses.length} of {expenses.length} expense
                    {expenses.length !== 1 ? "s" : ""}
                  </p>
                </div>
                <ExpenseTable
                  expenses={filteredExpenses}
                  onEdit={openEditModal}
                  onDelete={handleDelete}
                />
              </>
            )}

            {activeTab === "summary" && (
              <SummaryChart expenses={filteredExpenses.length ? filteredExpenses : expenses} />
            )}
          </>
        )}
      </main>

      {/* Modal */}
      <Modal
        isOpen={modalOpen}
        onClose={closeModal}
        title={editingExpense ? "Edit Expense" : "Add New Expense"}
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