import { Sun, Moon, LogOut, Target, Plus, Wallet } from 'lucide-react';
import { useAuth } from './hooks/useAuth';

type HeaderProps = {
  theme: 'light' | 'dark';
  onToggleTheme: () => void;
  onAddExpense: () => void;
  onSetBudget: () => void;
};

export function Header({ theme, onToggleTheme, onAddExpense, onSetBudget }: HeaderProps) {
  const { signOut, user } = useAuth();

  return (
    <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-3">
            <div className="bg-blue-600 p-2 rounded-lg">
              <Wallet className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900 dark:text-white">
                Expense Tracker
              </h1>
              <p className="text-xs text-gray-600 dark:text-gray-400">
                {user?.email}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onSetBudget}
              className="flex items-center gap-2 px-4 py-2 text-orange-600 dark:text-orange-400 hover:bg-orange-50 dark:hover:bg-orange-900/20 rounded-lg transition-colors font-medium"
            >
              <Target className="w-5 h-5" />
              <span className="hidden sm:inline">Budget</span>
            </button>

            <button
              onClick={onAddExpense}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors font-medium"
            >
              <Plus className="w-5 h-5" />
              <span className="hidden sm:inline">Add Expense</span>
            </button>

            <button
              onClick={onToggleTheme}
              className="p-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
              aria-label="Toggle theme"
            >
              {theme === 'light' ? (
                <Moon className="w-5 h-5" />
              ) : (
                <Sun className="w-5 h-5" />
              )}
            </button>

            <button
              onClick={() => signOut()}
              className="p-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
              aria-label="Sign out"
            >
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
