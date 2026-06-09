import './ExpenseForm.css';
import { useState, type ChangeEvent, type FormEvent } from "react";
import { CATEGORIES } from "../../utils/formatters";
import type { Expense, ExpenseFormData } from "../../types/types";

interface FormState {
  title: string;
  amount: string;
  category: string;
  date: string;
  notes: string;
}

interface FormErrors {
  title?: string;
  amount?: string;
  category?: string;
  date?: string;
}

interface ExpenseFormProps {
  initialValues?: Partial<Expense>;
  onSubmit: (data: ExpenseFormData) => void;
  onCancel: () => void;
  isSubmitting: boolean;
}

const EMPTY_FORM: FormState = {
  title: "",
  amount: "",
  category: "",
  date: "",
  notes: "",
};

const ExpenseForm = ({
  initialValues = {},
  onSubmit,
  onCancel,
  isSubmitting,
}: ExpenseFormProps) => {
  const [form, setForm] = useState<FormState>({
    ...EMPTY_FORM,
    ...initialValues,
    amount: initialValues.amount?.toString() ?? "",
  });
  const [errors, setErrors] = useState<FormErrors>({});

  const validate = (): FormErrors => {
    const newErrors: FormErrors = {};
    if (!form.title.trim()) newErrors.title = "Title is required.";
    if (!form.amount || isNaN(Number(form.amount)) || Number(form.amount) <= 0)
      newErrors.amount = "Enter a valid positive amount.";
    if (!form.category) newErrors.category = "Please select a category.";
    if (!form.date) newErrors.date = "Date is required.";
    return newErrors;
  };

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ): void => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    onSubmit({ ...form, amount: Number(form.amount) });
  };

  return (
    <form onSubmit={handleSubmit} noValidate>
      <div className="space-y-4">
        {/* Title */}
        <div>
          <label className="form-label">Title</label>
          <input
            name="title"
            value={form.title}
            onChange={handleChange}
            placeholder='e.g., "Dinner with clients"'
            className="input-dark"
          />
          {errors.title && <p className="error-text">{errors.title}</p>}
        </div>

        {/* Amount */}
        <div>
          <label className="form-label">Amount (PKR)</label>
          <input
            name="amount"
            type="number"
            min="0"
            step="any"
            value={form.amount}
            onChange={handleChange}
            placeholder="0.00"
            className="input-dark"
          />
          {errors.amount && <p className="error-text">{errors.amount}</p>}
        </div>

        {/* Category & Date */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="form-label">Category</label>
            <select
              name="category"
              value={form.category}
              onChange={handleChange}
              className="input-dark"
            >
              <option value="">Select…</option>
              {CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
            {errors.category && <p className="error-text">{errors.category}</p>}
          </div>

          <div>
            <label className="form-label">Date</label>
            <input
              name="date"
              type="date"
              value={form.date}
              onChange={handleChange}
              className="input-dark"
            />
            {errors.date && <p className="error-text">{errors.date}</p>}
          </div>
        </div>

        {/* Notes */}
        <div>
          <label className="form-label">Notes <span className="normal-case font-normal text-gray-400">(optional)</span></label>
          <textarea
            name="notes"
            value={form.notes}
            onChange={handleChange}
            placeholder="Add any context or notes…"
            rows={2}
            className="input-dark resize-none"
          />
        </div>
      </div>

      <div className="flex gap-3 mt-6 pt-5 border-t border-gray-100">
        <button
          type="submit"
          disabled={isSubmitting}
          className="btn-primary flex-1 justify-center disabled:opacity-50"
        >
          {isSubmitting ? "Saving…" : "Save Expense"}
        </button>
        <button type="button" onClick={onCancel} className="btn-ghost">
          Cancel
        </button>
      </div>
    </form>
  );
};

export default ExpenseForm;
