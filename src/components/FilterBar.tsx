import { Search, X } from "lucide-react";
import { CATEGORIES } from "../utils/formatters";
import type { Filters } from "../types/types";

interface FilterBarProps {
  filters: Filters;
  onChange: (filters: Filters) => void;
}

const FilterBar = ({ filters, onChange }: FilterBarProps) => {
  const handleChange = (key: keyof Filters, value: string): void =>
    onChange({ ...filters, [key]: value });

  const clearFilters = (): void =>
    onChange({ search: "", category: "", dateFrom: "", dateTo: "" });

  const hasActive =
    filters.search || filters.category || filters.dateFrom || filters.dateTo;

  return (
    <div className="bg-[#0f1929] border border-[#1e3050] rounded-xl p-4 mb-6">
      <div className="flex flex-wrap gap-3 items-end">
        {/* Search */}
        <div className="flex-1 min-w-[180px]">
          <label className="block text-xs font-medium text-slate-400 mb-1.5">Search</label>
          <div className="relative">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
            <input
              type="text"
              value={filters.search}
              onChange={(e) => handleChange("search", e.target.value)}
              placeholder="Search expenses..."
              className="input-dark pl-9"
            />
          </div>
        </div>

        {/* Category */}
        <div className="min-w-[150px]">
          <label className="block text-xs font-medium text-slate-400 mb-1.5">Category</label>
          <select
            value={filters.category}
            onChange={(e) => handleChange("category", e.target.value)}
            className="input-dark"
          >
            <option value="">All categories</option>
            {CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>

        {/* Date From */}
        <div>
          <label className="block text-xs font-medium text-slate-400 mb-1.5">From</label>
          <input
            type="date"
            value={filters.dateFrom}
            onChange={(e) => handleChange("dateFrom", e.target.value)}
            className="input-dark"
          />
        </div>

        {/* Date To */}
        <div>
          <label className="block text-xs font-medium text-slate-400 mb-1.5">To</label>
          <input
            type="date"
            value={filters.dateTo}
            onChange={(e) => handleChange("dateTo", e.target.value)}
            className="input-dark"
          />
        </div>

        {hasActive && (
          <button onClick={clearFilters} className="btn-ghost self-end">
            <X size={14} /> Clear
          </button>
        )}
      </div>
    </div>
  );
};

export default FilterBar;