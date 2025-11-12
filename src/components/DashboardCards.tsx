import { Currency, TrendingUp, Receipt, Target } from 'lucide-react';
import { formatCurrency } from './utils/formatCurrency';
import type { Expense } from './lib/supabase';

type DashboardCardsProps = {
  expenses: Expense[];
  budget?: number;
};

export function DashboardCards({ expenses, budget }: DashboardCardsProps) {
  const totalExpenses = expenses.reduce((sum, exp) => sum + Number(exp.amount), 0);
  const transactionCount = expenses.length;

  const categoryTotals = expenses.reduce((acc, exp) => {
    acc[exp.category] = (acc[exp.category] || 0) + Number(exp.amount);
    return acc;
  }, {} as Record<string, number>);

  const topCategory = Object.entries(categoryTotals).sort(
    ([, a], [, b]) => b - a
  )[0];

  const budgetPercentage = budget ? (totalExpenses / budget) * 100 : 0;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-100 dark:border-gray-700">
        <div className="flex items-center justify-between mb-2">
          <span className="text-gray-600 dark:text-gray-400 text-sm font-medium">
            Total Expenses
          </span>
          <div className="bg-red-100 dark:bg-red-900/20 p-2 rounded-lg">
            <Currency className="w-5 h-5 text-red-600 dark:text-red-400" />
          </div>
        </div>
        <p className="text-3xl font-bold text-gray-900 dark:text-white">
          {formatCurrency(totalExpenses)}
        </p>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-100 dark:border-gray-700">
        <div className="flex items-center justify-between mb-2">
          <span className="text-gray-600 dark:text-gray-400 text-sm font-medium">
            Top Category
          </span>
          <div className="bg-blue-100 dark:bg-blue-900/20 p-2 rounded-lg">
            <TrendingUp className="w-5 h-5 text-blue-600 dark:text-blue-400" />
          </div>
        </div>
        <p className="text-xl font-bold text-gray-900 dark:text-white mb-1">
          {topCategory ? topCategory[0] : 'N/A'}
        </p>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          {topCategory ? formatCurrency(topCategory[1]) : ''}
        </p>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-100 dark:border-gray-700">
        <div className="flex items-center justify-between mb-2">
          <span className="text-gray-600 dark:text-gray-400 text-sm font-medium">
            Transactions
          </span>
          <div className="bg-green-100 dark:bg-green-900/20 p-2 rounded-lg">
            <Currency className="w-5 h-5 text-green-600 dark:text-green-400" />
          </div>
        </div>
        <p className="text-3xl font-bold text-gray-900 dark:text-white">
          {transactionCount}
        </p>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-100 dark:border-gray-700">
        <div className="flex items-center justify-between mb-2">
          <span className="text-gray-600 dark:text-gray-400 text-sm font-medium">
            Budget Status
          </span>
          <div className="bg-orange-100 dark:bg-orange-900/20 p-2 rounded-lg">
            <Target className="w-5 h-5 text-orange-600 dark:text-orange-400" />
          </div>
        </div>
        {budget ? (
          <>
            <p className="text-xl font-bold text-gray-900 dark:text-white mb-2">
              {formatCurrency(budget - totalExpenses)} left
            </p>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
              <div
                className={`h-2 rounded-full transition-all ${
                  budgetPercentage > 100
                    ? 'bg-red-600'
                    : budgetPercentage > 80
                    ? 'bg-orange-600'
                    : 'bg-green-600'
                }`}
                style={{ width: `${Math.min(budgetPercentage, 100)}%` }}
              />
            </div>
          </>
        ) : (
          <p className="text-sm text-gray-600 dark:text-gray-400">
            No budget set
          </p>
        )}
      </div>
    </div>
  );
}
