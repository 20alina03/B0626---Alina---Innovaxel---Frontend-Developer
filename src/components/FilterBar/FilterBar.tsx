import './FilterBar.css';
import { Search, X, SlidersHorizontal } from "lucide-react";
import { CATEGORIES } from "../../utils/formatters";
import type { Filters } from "../../types/types";

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
    <div className="bg-white border border-gray-100 rounded-lg sm:rounded-xl p-3 sm:p-4 shadow-sm">
      <div className="flex flex-wrap gap-2 sm:gap-3 items-end">
        {/* Label */}
        <div className="hidden md:flex items-center gap-1.5 text-xs font-semibold text-gray-400 uppercase tracking-wider self-center mr-1">
          <SlidersHorizontal size={13} />
          Filters
        </div>

        {/* Search */}
        <div className="flex-1 min-w-[150px] sm:min-w-[180px]">
          <div className="relative">
            <Search size={12} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={filters.search}
              onChange={(e) => handleChange("search", e.target.value)}
              placeholder="Search…"
              className="input-dark pl-8 text-xs sm:text-sm py-1.5 sm:py-2"
            />
          </div>
        </div>

        {/* Category */}
        <div className="min-w-[130px] sm:min-w-[150px]">
          <select
            value={filters.category}
            onChange={(e) => handleChange("category", e.target.value)}
            className="input-dark text-xs sm:text-sm py-1.5 sm:py-2"
          >
            <option value="">All categories</option>
            {CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>

        {/* Date From */}
        <div className="min-w-[140px]">
          <input
            type="date"
            value={filters.dateFrom}
            onChange={(e) => handleChange("dateFrom", e.target.value)}
            className="input-dark text-xs sm:text-sm py-1.5 sm:py-2 text-gray-500 w-full"
            title="From date"
          />
        </div>

        {/* Date To */}
        <div className="min-w-[140px]">
          <input
            type="date"
            value={filters.dateTo}
            onChange={(e) => handleChange("dateTo", e.target.value)}
            className="input-dark text-xs sm:text-sm py-1.5 sm:py-2 text-gray-500 w-full"
            title="To date"
          />
        </div>

        {hasActive && (
          <button onClick={clearFilters} className="btn-ghost text-xs px-2 sm:px-3 py-1.5 sm:py-2.5 self-end flex-shrink-0">
            <X size={12} /> <span className="hidden sm:inline">Clear</span>
          </button>
        )}
      </div>
    </div>
  );
};

export default FilterBar;
