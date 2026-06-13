import { ReactNode, useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard, Receipt, Wallet, FolderTree, BarChart3,
  Settings, LogOut, Menu, X, Sun, Moon, User
} from 'lucide-react';
import { useAuthStore } from '@/store/authStore';
import { useThemeStore } from '@/store/themeStore';
import { cn } from '@/lib/utils';

const nav = [
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/expenses', label: 'Expenses', icon: Receipt },
  { to: '/budgets', label: 'Budgets', icon: Wallet },
  { to: '/categories', label: 'Categories', icon: FolderTree },
  { to: '/analytics', label: 'Analytics', icon: BarChart3 },
  { to: '/settings', label: 'Settings', icon: Settings },
];

export default function AppShell({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const { user, logout } = useAuthStore();
  const { theme, toggle } = useThemeStore();
  const navigate = useNavigate();

  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-gray-950">
      {/* Sidebar */}
      <aside className={cn(
        'fixed inset-y-0 left-0 z-30 w-64 transform border-r border-gray-200 bg-white transition-transform dark:border-gray-800 dark:bg-gray-900 lg:static lg:translate-x-0',
        open ? 'translate-x-0' : '-translate-x-full',
      )}>
        <div className="flex h-16 items-center gap-2 border-b border-gray-200 px-6 dark:border-gray-800">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-primary-500 to-primary-700">
            <Receipt className="h-5 w-5 text-white" />
          </div>
          <span className="text-lg font-bold">ExpenseTracker</span>
        </div>
        <nav className="space-y-1 p-4">
          {nav.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              onClick={() => setOpen(false)}
              className={({ isActive }) => cn(
                'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition',
                isActive
                  ? 'bg-primary-50 text-primary-700 dark:bg-primary-900/20 dark:text-primary-400'
                  : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800',
              )}
            >
              <Icon className="h-5 w-5" />
              {label}
            </NavLink>
          ))}
        </nav>
        <div className="absolute bottom-0 left-0 right-0 border-t border-gray-200 p-4 dark:border-gray-800">
          <div className="mb-3 flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary-100 text-primary-700 dark:bg-primary-900/30 dark:text-primary-400">
              {user?.name?.charAt(0).toUpperCase() || 'U'}
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium">{user?.name}</p>
              <p className="truncate text-xs text-gray-500">{user?.email}</p>
            </div>
          </div>
          <button
            onClick={async () => { await logout(); navigate('/login'); }}
            className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
          >
            <LogOut className="h-4 w-4" /> Sign out
          </button>
        </div>
      </aside>

      {open && <div onClick={() => setOpen(false)} className="fixed inset-0 z-20 bg-black/50 lg:hidden" />}

      {/* Main */}
      <div className="flex-1">
        <header className="sticky top-0 z-10 flex h-16 items-center justify-between border-b border-gray-200 bg-white/80 px-4 backdrop-blur dark:border-gray-800 dark:bg-gray-900/80 lg:px-8">
          <button onClick={() => setOpen(true)} className="rounded-lg p-2 hover:bg-gray-100 dark:hover:bg-gray-800 lg:hidden">
            <Menu className="h-5 w-5" />
          </button>
          <div className="flex items-center gap-2">
            <button onClick={toggle} className="rounded-lg p-2 hover:bg-gray-100 dark:hover:bg-gray-800">
              {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </button>
            <Link to="/profile" className="rounded-lg p-2 hover:bg-gray-100 dark:hover:bg-gray-800">
              <User className="h-5 w-5" />
            </Link>
          </div>
        </header>
        <main className="p-4 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
