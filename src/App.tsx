import { useAuth } from './hooks/useAuth';
import { useTheme } from './hooks/useTheme';
import { Auth } from './components/Auth';
import { Dashboard } from './components/Dashboard';

function App() {
  const { user, loading } = useAuth();
  const { theme, toggleTheme } = useTheme();

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Auth />;
  }

  return <Dashboard userId={user.id} theme={theme} onToggleTheme={toggleTheme} />;
}

export default App;
