import { useState, useEffect } from 'react';
import { X, Target } from 'lucide-react';
import { supabase, type Budget } from '../lib/supabase';
import { getMonthStart, formatMonthYear } from '../utils/formatCurrency';

type BudgetModalProps = {
  userId: string;
  onClose: () => void;
  onUpdate: () => void;
};

export function BudgetModal({ userId, onClose, onUpdate }: BudgetModalProps) {
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(false);
  const [currentBudget, setCurrentBudget] = useState<Budget | null>(null);

  useEffect(() => {
    fetchCurrentBudget();
  }, [userId]);

  const fetchCurrentBudget = async () => {
    const monthStart = getMonthStart();
    const { data } = await supabase
      .from('budgets')
      .select('*')
      .eq('user_id', userId)
      .eq('month', monthStart)
      .maybeSingle();

    if (data) {
      setCurrentBudget(data);
      setAmount(data.amount.toString());
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const numAmount = parseFloat(amount);

    if (isNaN(numAmount) || numAmount <= 0) {
      return;
    }

    setLoading(true);
    const monthStart = getMonthStart();

    try {
      if (currentBudget) {
        await supabase
          .from('budgets')
          .update({ amount: numAmount })
          .eq('id', currentBudget.id);
      } else {
        await supabase.from('budgets').insert([
          {
            user_id: userId,
            month: monthStart,
            amount: numAmount,
          },
        ]);
      }

      onUpdate();
      onClose();
    } catch (error) {
      console.error('Error saving budget:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-md">
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-3">
            <div className="bg-orange-100 dark:bg-orange-900/20 p-2 rounded-lg">
              <Target className="w-6 h-6 text-orange-600 dark:text-orange-400" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              Set Budget Goal
            </h2>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <p className="text-gray-600 dark:text-gray-400">
            Set your spending limit for {formatMonthYear(getMonthStart())}
          </p>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Monthly Budget
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-400">
               ₦ 
              </span>
              <input
                type="number"
                step="0.01"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full pl-8 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500 dark:bg-gray-700 dark:text-white"
                placeholder="0.00"
                required
              />
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-lg transition-colors font-medium disabled:opacity-50"
            >
              {loading ? 'Saving...' : currentBudget ? 'Update' : 'Set'} Budget
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
