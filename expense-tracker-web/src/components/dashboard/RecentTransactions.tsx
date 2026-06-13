import { ArrowRight, Receipt } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Expense } from '@/types';
import { formatCurrency, formatDate, categoryIcon } from '@/lib/utils';

interface RecentTransactionsProps {
  expenses: Expense[];
  currency: string;
}

export default function RecentTransactions({ expenses, currency }: RecentTransactionsProps) {
  return (
    <div className="flex h-full flex-col rounded-xl border border-gray-200/50 bg-white shadow-sm dark:border-gray-800/50 dark:bg-gray-900">
      <div className="flex items-center justify-between border-b border-gray-100 px-4 py-3 dark:border-gray-800">
        <div className="flex items-center gap-2">
          <Receipt className="h-4 w-4 text-gray-500" />
          <h3 className="text-sm font-semibold text-gray-900 dark:text-white">Recent Transactions</h3>
        </div>
        <Link to="/expenses" className="inline-flex items-center gap-0.5 text-xs font-medium text-primary-600 hover:text-primary-700 dark:text-primary-400">
          View all <ArrowRight className="h-3 w-3" />
        </Link>
      </div>
      <div className="flex-1 divide-y divide-gray-100 dark:divide-gray-800/50">
        {expenses.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-8 text-gray-400">
            <Receipt className="mb-2 h-8 w-8" />
            <p className="text-sm">No transactions yet</p>
            <p className="text-xs">Add your first expense</p>
          </div>
        ) : (
          expenses.slice(0, 5).map((e) => (
            <div key={e.id} className="flex items-center gap-3 px-4 py-2.5 transition-colors hover:bg-gray-50 dark:hover:bg-gray-800/30">
              <div
                className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-sm"
                style={{ backgroundColor: `${e.category?.color || '#6366F1'}18` }}
              >
                <span>{categoryIcon(e.category?.icon)}</span>
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-gray-900 dark:text-white">{e.description}</p>
                <p className="text-xs text-gray-500">
                  {e.category?.name}
                  <span className="mx-1">·</span>
                  {formatDate(e.expense_date, 'MMM dd')}
                </p>
              </div>
              <p className="shrink-0 text-sm font-semibold text-red-500">
                -{formatCurrency(Number(e.amount), e.currency || currency)}
              </p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
