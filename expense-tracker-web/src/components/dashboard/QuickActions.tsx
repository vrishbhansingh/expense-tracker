import { Link } from 'react-router-dom';
import { Plus, Wallet, FolderTree } from 'lucide-react';

const actions = [
  { to: '/expenses', label: 'Add Expense', icon: Plus, color: '#6366F1', desc: 'Record a new expense' },
  { to: '/budgets', label: 'Add Budget', icon: Wallet, color: '#10B981', desc: 'Set spending limit' },
  { to: '/categories', label: 'Add Category', icon: FolderTree, color: '#F59E0B', desc: 'Organize spending' },
];

export default function QuickActions() {
  return (
    <div className="rounded-xl border border-gray-200/50 bg-white p-4 shadow-sm dark:border-gray-800/50 dark:bg-gray-900">
      <h3 className="mb-3 text-sm font-semibold text-gray-900 dark:text-white">Quick Actions</h3>
      <div className="grid grid-cols-3 gap-2">
        {actions.map((a) => (
          <Link
            key={a.to}
            to={a.to}
            className="group flex flex-col items-center gap-1.5 rounded-lg border border-gray-100 bg-gray-50/50 px-2 py-3 text-center transition-all hover:border-gray-200 hover:shadow-sm dark:border-gray-800 dark:bg-gray-800/30 dark:hover:border-gray-700"
          >
            <div
              className="flex h-8 w-8 items-center justify-center rounded-lg transition-transform group-hover:scale-110"
              style={{ backgroundColor: `${a.color}15` }}
            >
              <a.icon className="h-4 w-4" style={{ color: a.color }} />
            </div>
            <span className="text-xs font-medium text-gray-700 dark:text-gray-300">{a.label}</span>
            <span className="hidden text-[10px] text-gray-400 lg:block">{a.desc}</span>
          </Link>
        ))}
      </div>
    </div>
  );
}
