import { useState, useMemo, useEffect } from 'react';
import { useExpenses } from './hooks/useExpenses';
import { DashboardCards } from '/DashboardCards';
import { Charts } from '/Charts';
import { Filters, type FilterOptions } from '/Filters';
import { ExpenseForm } from '/ExpenseForm';
import { ExpenseList } from '/ExpenseList';
import { BudgetModal } from '/BudgetModal';
import { Header } from '/Header';
import type { Expense, Budget } from './lib/supabase';
import { supabase } from '..lib/supabase';
import { getMonthStart } from './utils/formatCurrency';

type DashboardProps = {
  userId: string;
  theme: 'light' | 'dark';
  onToggleTheme: () => void;
};

export function Dashboard({ userId, theme, onToggleTheme }: DashboardProps) {
  const { expenses, addExpense, updateExpense, deleteExpense } = useExpenses(userId);
  const [showForm, setShowForm] = useState(false);
  const [showBudgetModal, setShowBudgetModal] = useState(false);
  const [editingExpense, setEditingExpense] = useState<Expense | null>(null);
  const [currentBudget, setCurrentBudget] = useState<number | undefined>(undefined);
  const [filters, setFilters] = useState<FilterOptions>({
    category: 'all',
    dateRange: 'month',
    sortBy: 'date-desc',
  });

  useEffect(() => {
    fetchBudget();
  }, [userId]);

  const fetchBudget = async () => {
    const monthStart = getMonthStart();
    const { data } = await supabase
      .from('budgets')
      .select('*')
      .eq('user_id', userId)
      .eq('month', monthStart)
      .maybeSingle();

    if (data) {
      setCurrentBudget(Number(data.amount));
    }
  };

  const filteredExpenses = useMemo(() => {
    let filtered = [...expenses];

    if (filters.category !== 'all') {
      filtered = filtered.filter((exp) => exp.category === filters.category);
    }

    const now = new Date();
    switch (filters.dateRange) {
      case 'week': {
        const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        filtered = filtered.filter((exp) => new Date(exp.date) >= weekAgo);
        break;
      }
      case 'month': {
        const monthStart = getMonthStart(now);
        filtered = filtered.filter((exp) => exp.date >= monthStart);
        break;
      }
      case 'custom': {
        if (filters.customStartDate) {
          filtered = filtered.filter((exp) => exp.date >= filters.customStartDate!);
        }
        if (filters.customEndDate) {
          filtered = filtered.filter((exp) => exp.date <= filters.customEndDate!);
        }
        break;
      }
    }

    filtered.sort((a, b) => {
      switch (filters.sortBy) {
        case 'date-asc':
          return new Date(a.date).getTime() - new Date(b.date).getTime();
        case 'date-desc':
          return new Date(b.date).getTime() - new Date(a.date).getTime();
        case 'amount-asc':
          return Number(a.amount) - Number(b.amount);
        case 'amount-desc':
          return Number(b.amount) - Number(a.amount);
        default:
          return 0;
      }
    });

    return filtered;
  }, [expenses, filters]);

  const handleAddExpense = async (
    expense: Omit<Expense, 'id' | 'user_id' | 'created_at' | 'updated_at'>
  ) => {
    await addExpense(expense);
    setShowForm(false);
  };

  const handleUpdateExpense = async (
    expense: Omit<Expense, 'id' | 'user_id' | 'created_at' | 'updated_at'>
  ) => {
    if (editingExpense) {
      await updateExpense(editingExpense.id, expense);
      setEditingExpense(null);
      setShowForm(false);
    }
  };

  const handleEdit = (expense: Expense) => {
    setEditingExpense(expense);
    setShowForm(true);
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setEditingExpense(null);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Header
        theme={theme}
        onToggleTheme={onToggleTheme}
        onAddExpense={() => setShowForm(true)}
        onSetBudget={() => setShowBudgetModal(true)}
      />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-6">
          <DashboardCards expenses={filteredExpenses} budget={currentBudget} />
          <Charts expenses={filteredExpenses} />
          <Filters filters={filters} onChange={setFilters} />
          <ExpenseList
            expenses={filteredExpenses}
            onEdit={handleEdit}
            onDelete={deleteExpense}
          />
        </div>
      </main>

      {showForm && (
        <ExpenseForm
          onSubmit={editingExpense ? handleUpdateExpense : handleAddExpense}
          onClose={handleCloseForm}
          initialData={editingExpense || undefined}
        />
      )}

      {showBudgetModal && (
        <BudgetModal
          userId={userId}
          onClose={() => setShowBudgetModal(false)}
          onUpdate={fetchBudget}
        />
      )}
    </div>
  );
}
