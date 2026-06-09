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
  CATEGORY_ICONS,
} from "../utils/formatters";
import type { Expense } from "../types/types";

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
      <div className="bg-[#0f1929] border border-[#1e3050] rounded-lg shadow-xl px-3 py-2 text-sm">
        <p className="font-medium text-white">{name}</p>
        <p className="text-emerald-400 font-semibold mt-0.5">
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
      fill: CATEGORY_COLORS[name] || "#64748b",
    })
  );

  if (chartData.length === 0) {
    return (
      <div className="bg-[#0f1929] border border-[#1e3050] rounded-xl text-center py-16">
        <p className="text-slate-500">No data to display yet.</p>
      </div>
    );
  }

  const sorted = [...chartData].sort((a, b) => b.value - a.value);

  return (
    <div className="space-y-6">
      {/* Total + top categories */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Total */}
        <div className="bg-[#0f1929] border border-[#1e3050] rounded-xl p-5 sm:col-span-1">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-widest mb-2">
            Total Spent
          </p>
          <p className="text-3xl font-bold text-white">{formatCurrency(total)}</p>
          <p className="text-xs text-slate-500 mt-1">
            across {expenses.length} expense{expenses.length !== 1 ? "s" : ""}
          </p>
        </div>

        {/* Top 2 categories */}
        {sorted.slice(0, 2).map((item) => (
          <div
            key={item.name}
            className="bg-[#0f1929] border border-[#1e3050] rounded-xl p-5 relative overflow-hidden"
          >
            <div
              className="absolute inset-0 opacity-5"
              style={{ background: item.fill }}
            />
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-widest mb-2">
              {CATEGORY_ICONS[item.name]} Top Spend
            </p>
            <p className="text-lg font-bold text-white">{item.name}</p>
            <p className="text-sm font-semibold mt-0.5" style={{ color: item.fill }}>
              {formatCurrency(item.value)}
            </p>
          </div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Pie */}
        <div className="bg-[#0f1929] border border-[#1e3050] rounded-xl p-5">
          <h3 className="text-sm font-semibold text-slate-300 mb-5">
            Spending by Category
          </h3>
          <ResponsiveContainer width="100%" height={260}>
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                innerRadius={65}
                outerRadius={105}
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
                  <span className="text-xs text-slate-400">{value}</span>
                )}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Bar */}
        <div className="bg-[#0f1929] border border-[#1e3050] rounded-xl p-5">
          <h3 className="text-sm font-semibold text-slate-300 mb-5">
            Amount per Category
          </h3>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={chartData} barSize={26}>
              <XAxis
                dataKey="name"
                tick={{ fontSize: 10, fill: "#64748b" }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                tick={{ fontSize: 10, fill: "#64748b" }}
                axisLine={false}
                tickLine={false}
                tickFormatter={(v: number) => `Rs.${(v / 1000).toFixed(0)}k`}
              />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="value" radius={[6, 6, 0, 0]}>
                {chartData.map((entry) => (
                  <Cell key={entry.name} fill={entry.fill} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Category breakdown list */}
      <div className="bg-[#0f1929] border border-[#1e3050] rounded-xl p-5">
        <h3 className="text-sm font-semibold text-slate-300 mb-4">Breakdown</h3>
        <div className="space-y-3">
          {sorted.map((item) => {
            const pct = Math.round((item.value / total) * 100);
            return (
              <div key={item.name}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs text-slate-400 flex items-center gap-1.5">
                    {CATEGORY_ICONS[item.name]} {item.name}
                  </span>
                  <span className="text-xs font-semibold text-white">
                    {formatCurrency(item.value)}{" "}
                    <span className="text-slate-500 font-normal">({pct}%)</span>
                  </span>
                </div>
                <div className="h-1.5 bg-[#1e3050] rounded-full overflow-hidden">
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