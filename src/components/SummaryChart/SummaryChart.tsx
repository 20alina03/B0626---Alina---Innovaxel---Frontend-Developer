import './SummaryChart.css';
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import {
  formatCurrency,
  groupByCategory,
  CATEGORY_COLORS,
} from "../../utils/formatters";
import type { Expense } from "../../types/types";

interface ChartDataItem {
  name: string;
  value: number;
  fill: string;
}

interface CustomTooltipProps {
  active?: boolean;
  payload?: Array<{ name?: string; value?: number | string }>;
}

const CustomTooltip = ({ active, payload }: CustomTooltipProps) => {
  if (active && payload && payload.length) {
    const item = payload[0];
    const name = item?.name;
    const value = item?.value;
    return (
      <div className="bg-white border border-gray-200 rounded-lg shadow-lg px-3 py-2.5 text-sm">
        <p className="font-semibold text-gray-900 text-xs">{name}</p>
        <p className="text-gray-700 font-bold mt-0.5 text-sm">
          {formatCurrency(typeof value === "number" ? value : 0)}
        </p>
      </div>
    );
  }
  return null;
};

interface SummaryChartProps {
  expenses: Expense[];
}

const SummaryChart = ({ expenses }: SummaryChartProps) => {
  const total = expenses.reduce((s, e) => s + e.amount, 0);
  const grouped = groupByCategory(expenses);

  const chartData: ChartDataItem[] = Object.entries(grouped).map(
    ([name, value]) => ({
      name,
      value,
      fill: CATEGORY_COLORS[name] || "#6B7280",
    })
  );

  if (chartData.length === 0) {
    return (
      <div className="bg-white border border-gray-100 rounded-lg sm:rounded-xl text-center py-12 sm:py-20 shadow-sm">
        <p className="text-gray-400 text-xs sm:text-sm">No data to display yet.</p>
      </div>
    );
  }

  const sorted = [...chartData].sort((a, b) => b.value - a.value);

  return (
    <div className="space-y-3 sm:space-y-5">
      {/* Top summary cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-4">
        {/* Total */}
        <div className="bg-white border border-gray-100 rounded-lg sm:rounded-xl p-3 sm:p-5 shadow-sm">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1.5 sm:mb-2">
            Total Spent
          </p>
          <p className="text-2xl sm:text-3xl font-bold text-gray-900">{formatCurrency(total)}</p>
          <p className="text-xs text-gray-400 mt-1">
            {expenses.length} expense{expenses.length !== 1 ? "s" : ""}
          </p>
        </div>

        {/* Top 2 categories */}
        {sorted.slice(0, 2).map((item) => (
          <div
            key={item.name}
            className="bg-white border border-gray-100 rounded-lg sm:rounded-xl p-3 sm:p-5 shadow-sm relative overflow-hidden sm:col-span-1"
          >
            <div
              className="absolute top-0 left-0 w-full h-1 rounded-t-lg sm:rounded-t-xl"
              style={{ backgroundColor: item.fill }}
            />
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1.5 sm:mb-2">
              Top Category
            </p>
            <p className="text-base sm:text-lg font-bold text-gray-900">{item.name}</p>
            <p className="text-xs sm:text-sm font-semibold mt-0.5" style={{ color: item.fill }}>
              {formatCurrency(item.value)}
            </p>
          </div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-5">
        {/* Pie */}
        <div className="bg-white border border-gray-100 rounded-lg sm:rounded-xl p-3 sm:p-5 shadow-sm">
          <h3 className="text-xs sm:text-sm font-bold text-gray-800 mb-3 sm:mb-5">
            Spending by Category
          </h3>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                innerRadius={50}
                outerRadius={80}
                paddingAngle={3}
                dataKey="value"
              >
                {chartData.map((entry) => (
                  <Cell key={entry.name} fill={entry.fill} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
              <Legend
                formatter={(value: string) => (
                  <span className="text-xs text-gray-500">{value}</span>
                )}
                wrapperStyle={{ fontSize: '11px' }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Bar */}
        <div className="bg-white border border-gray-100 rounded-lg sm:rounded-xl p-3 sm:p-5 shadow-sm">
          <h3 className="text-xs sm:text-sm font-bold text-gray-800 mb-3 sm:mb-5">
            Amount per Category
          </h3>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={chartData} barSize={20}>
              <XAxis
                dataKey="name"
                tick={{ fontSize: 10, fill: "#9CA3AF" }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                tick={{ fontSize: 9, fill: "#9CA3AF" }}
                axisLine={false}
                tickLine={false}
                tickFormatter={(v: number) => `Rs.${(v / 1000).toFixed(0)}k`}
              />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                {chartData.map((entry) => (
                  <Cell key={entry.name} fill={entry.fill} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Category breakdown */}
      <div className="bg-white border border-gray-100 rounded-lg sm:rounded-xl p-3 sm:p-5 shadow-sm">
        <h3 className="text-xs sm:text-sm font-bold text-gray-800 mb-3 sm:mb-5">Breakdown</h3>
        <div className="space-y-3 sm:space-y-4">
          {sorted.map((item) => {
            const pct = Math.round((item.value / total) * 100);
            return (
              <div key={item.name}>
                <div className="flex items-center justify-between mb-1 sm:mb-1.5 gap-2">
                  <div className="flex items-center gap-2 min-w-0">
                    <span
                      className="w-2 h-2 rounded-full flex-shrink-0"
                      style={{ backgroundColor: item.fill }}
                    />
                    <span className="text-xs sm:text-sm text-gray-700 font-medium truncate">{item.name}</span>
                  </div>
                  <span className="text-xs sm:text-sm font-semibold text-gray-900 tabular-nums flex-shrink-0">
                    {formatCurrency(item.value)}{" "}
                    <span className="text-gray-400 font-normal text-xs">({pct}%)</span>
                  </span>
                </div>
                <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{ width: `${pct}%`, backgroundColor: item.fill }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default SummaryChart;
