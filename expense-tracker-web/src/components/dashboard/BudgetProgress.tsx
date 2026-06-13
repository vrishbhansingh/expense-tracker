import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { Wallet, AlertCircle, Plus, ArrowRight } from 'lucide-react';
import { api } from '@/lib/api';
import { Budget } from '@/types';
import { formatCurrency } from '@/lib/utils';

export default function BudgetProgress() {
  const { data: budgets = [] } = useQuery({
    queryKey: ['budgets'],
    queryFn: () => api.get<Budget[]>('/budgets').then((r) => r.data),
  });

  const { data: expensesData } = useQuery({
    queryKey: ['expenses'],
    queryFn: () => api.get('/expenses?per_page=200').then((r) => r.data),
  });

  const spentFor = (b: Budget) => {
    const now = new Date();
    const from = (() => {
      switch (b.period) {
        case 'daily': return new Date(now.getFullYear(), now.getMonth(), now.getDate());
        case 'weekly': { const d = new Date(now); d.setDate(d.getDate() - d.getDay()); return d; }
        case 'monthly': return new Date(now.getFullYear(), now.getMonth(), 1);
        case 'yearly': return new Date(now.getFullYear(), 0, 1);
        default: return new Date(now.getFullYear(), now.getMonth(), 1);
      }
    })();
    return (expensesData?.data || [])
      .filter((e: any) => (!b.category_id || e.category_id === b.category_id) && new Date(e.expense_date) >= from)
      .reduce((s: number, e: any) => s + Number(e.amount), 0);
  };

  const top = budgets.slice(0, 4);

  return (
    <div className="flex h-full flex-col rounded-xl border border-gray-200/50 bg-white shadow-sm dark:border-gray-800/50 dark:bg-gray-900">
      <div className="flex items-center justify-between border-b border-gray-100 px-4 py-3 dark:border-gray-800">
        <div className="flex items-center gap-2">
          <Wallet className="h-4 w-4 text-gray-500" />
          <h3 className="text-sm font-semibold text-gray-900 dark:text-white">Budget Progress</h3>
        </div>
        <Link to="/budgets" className="inline-flex items-center gap-0.5 text-xs font-medium text-primary-600 hover:text-primary-700 dark:text-primary-400">
          Manage <ArrowRight className="h-3 w-3" />
        </Link>
      </div>
      <div className="flex-1 space-y-px divide-y divide-gray-100 dark:divide-gray-800/50">
        {top.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-8 text-gray-400">
            <Wallet className="mb-2 h-8 w-8" />
            <p className="text-sm">No budgets yet</p>
            <Link to="/budgets" className="mt-2 inline-flex items-center gap-1 text-xs font-medium text-primary-600">
              <Plus className="h-3 w-3" /> Create budget
            </Link>
          </div>
        ) : (
          top.map((b) => {
            const spent = spentFor(b);
            const pct = Math.min(100, (spent / Number(b.amount)) * 100);
            const isOver = spent > Number(b.amount);
            const isWarning = pct > b.alert_threshold && !isOver;
            return (
              <div key={b.id} className="px-4 py-2.5 transition-colors hover:bg-gray-50 dark:hover:bg-gray-800/30">
                <div className="mb-1 flex items-center justify-between">
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-gray-900 dark:text-white">{b.name}</p>
                    <p className="text-xs text-gray-500 capitalize">{b.period}</p>
                  </div>
                  <div className="shrink-0 text-right">
                    <p className="text-sm font-semibold text-gray-900 dark:text-white">
                      {formatCurrency(spent, b.currency)}
                    </p>
                    <p className="text-xs text-gray-500">of {formatCurrency(Number(b.amount), b.currency)}</p>
                  </div>
                </div>
                <div className="relative mt-1 h-1.5 overflow-hidden rounded-full bg-gray-100 dark:bg-gray-800">
                  <div
                    className={cn(
                      'h-full rounded-full transition-all duration-500',
                      isOver ? 'bg-red-500' : isWarning ? 'bg-amber-500' : 'bg-emerald-500'
                    )}
                    style={{ width: `${pct}%` }}
                  />
                </div>
                <div className="mt-0.5 flex items-center justify-between">
                  <span className={cn(
                    'text-xs font-medium',
                    isOver ? 'text-red-600' : isWarning ? 'text-amber-600' : 'text-emerald-600'
                  )}>
                    {pct.toFixed(0)}% used
                  </span>
                  {(isOver || isWarning) && (
                    <span className={cn(
                      'inline-flex items-center gap-0.5 text-xs font-medium',
                      isOver ? 'text-red-500' : 'text-amber-500'
                    )}>
                      <AlertCircle className="h-3 w-3" />
                      {isOver ? 'Exceeded' : 'Warning'}
                    </span>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}

function cn(...classes: (string | boolean | undefined | null)[]): string {
  return classes.filter(Boolean).join(' ');
}
