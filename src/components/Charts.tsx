import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import type { Expense } from './lib/supabase';
import { formatCurrency } from './utils/formatCurrency';

type ChartsProps = {
  expenses: Expense[];
};

const COLORS = [
  '#EF4444',
  '#F59E0B',
  '#8B5CF6',
  '#EC4899',
  '#3B82F6',
  '#10B981',
  '#6366F1',
  '#14B8A6',
  '#F97316',
  '#6B7280',
];

export function Charts({ expenses }: ChartsProps) {
  const categoryData = expenses.reduce((acc, exp) => {
    const existing = acc.find((item) => item.name === exp.category);
    if (existing) {
      existing.value += Number(exp.amount);
    } else {
      acc.push({ name: exp.category, value: Number(exp.amount) });
    }
    return acc;
  }, [] as Array<{ name: string; value: number }>);

  const dailyData = expenses.reduce((acc, exp) => {
    const date = new Date(exp.date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
    });
    const existing = acc.find((item) => item.date === date);
    if (existing) {
      existing.amount += Number(exp.amount);
    } else {
      acc.push({ date, amount: Number(exp.amount) });
    }
    return acc;
  }, [] as Array<{ date: string; amount: number }>);

  dailyData.sort((a, b) => {
    const dateA = new Date(a.date + ' ' + new Date().getFullYear());
    const dateB = new Date(b.date + ' ' + new Date().getFullYear());
    return dateA.getTime() - dateB.getTime();
  });

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 p-3 rounded-lg shadow-lg">
          <p className="text-gray-900 dark:text-white font-medium">
            {payload[0].name}
          </p>
          <p className="text-blue-600 dark:text-blue-400 font-bold">
            {formatCurrency(payload[0].value)}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-100 dark:border-gray-700">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Expenses by Category
        </h3>
        {categoryData.length > 0 ? (
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={categoryData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) =>
                  `${name} (${(percent * 100).toFixed(0)}%)`
                }
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {categoryData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>
        ) : (
          <div className="h-[300px] flex items-center justify-center text-gray-500 dark:text-gray-400">
            No expense data available
          </div>
        )}
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-100 dark:border-gray-700">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Spending Over Time
        </h3>
        {dailyData.length > 0 ? (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={dailyData}>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="#374151"
                opacity={0.3}
              />
              <XAxis
                dataKey="date"
                stroke="#9CA3AF"
                style={{ fontSize: '12px' }}
              />
              <YAxis stroke="#9CA3AF" style={{ fontSize: '12px' }} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="amount" fill="#3B82F6" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <div className="h-[300px] flex items-center justify-center text-gray-500 dark:text-gray-400">
            No expense data available
          </div>
        )}
      </div>
    </div>
  );
}
