import { Routes, Route, Navigate } from 'react-router-dom';
import { useEffect } from 'react';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';
import ForgotPasswordPage from './pages/auth/ForgotPasswordPage';
import DashboardPage from './pages/DashboardPage';
import ExpensesPage from './pages/ExpensesPage';
import BudgetsPage from './pages/BudgetsPage';
import CategoriesPage from './pages/CategoriesPage';
import AnalyticsPage from './pages/AnalyticsPage';
import SettingsPage from './pages/SettingsPage';
import ProfilePage from './pages/ProfilePage';
import AppShell from './components/layout/AppShell';
import { useAuthStore } from './store/authStore';
import { useThemeStore } from './store/themeStore';

function ProtectedRoute({ children }: { children: JSX.Element }) {
  const token = useAuthStore((s) => s.token);
  if (!token) return <Navigate to="/login" replace />;
  return <AppShell>{children}</AppShell>;
}

export default function App() {
  const { token, hydrate } = useAuthStore();
  const { theme } = useThemeStore();

  useEffect(() => {
    hydrate();
  }, [hydrate]);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
  }, [theme]);

  return (
    <Routes>
      <Route path="/" element={token ? <Navigate to="/dashboard" /> : <LandingPage />} />
      <Route path="/login" element={token ? <Navigate to="/dashboard" /> : <LoginPage />} />
      <Route path="/register" element={token ? <Navigate to="/dashboard" /> : <RegisterPage />} />
      <Route path="/forgot-password" element={<ForgotPasswordPage />} />

      <Route path="/dashboard" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
      <Route path="/expenses" element={<ProtectedRoute><ExpensesPage /></ProtectedRoute>} />
      <Route path="/budgets" element={<ProtectedRoute><BudgetsPage /></ProtectedRoute>} />
      <Route path="/categories" element={<ProtectedRoute><CategoriesPage /></ProtectedRoute>} />
      <Route path="/analytics" element={<ProtectedRoute><AnalyticsPage /></ProtectedRoute>} />
      <Route path="/settings" element={<ProtectedRoute><SettingsPage /></ProtectedRoute>} />
      <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />

      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}
