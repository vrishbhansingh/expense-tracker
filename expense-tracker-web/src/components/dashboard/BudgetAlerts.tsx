import { useQuery } from '@tanstack/react-query';
import { AlertTriangle, AlertCircle, TrendingUp } from 'lucide-react';
import { api } from '@/lib/api';
import { Budget } from '@/types';
import { formatCurrency } from '@/lib/utils';

export default function BudgetAlerts() {
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

  const exceeded = budgets.filter((b) => spentFor(b) > Number(b.amount));
  const nearing = budgets.filter((b) => {
    const spent = spentFor(b);
    const pct = (spent / Number(b.amount)) * 100;
    return pct > b.alert_threshold && pct <= 100;
  });

  const alerts = [
    ...exceeded.map((b) => ({
      id: `exceeded-${b.id}`,
      type: 'danger' as const,
      icon: AlertCircle,
      title: 'Budget exceeded',
      message: `${b.name} has exceeded its limit of ${formatCurrency(Number(b.amount), b.currency)}`,
    })),
    ...nearing.map((b) => ({
      id: `nearing-${b.id}`,
      type: 'warning' as const,
      icon: AlertTriangle,
      title: 'Budget nearing limit',
      message: `${b.name} has used ${((spentFor(b) / Number(b.amount)) * 100).toFixed(0)}% of its budget`,
    })),
  ];

  if (alerts.length === 0) {
    return (
      <div className="rounded-xl border border-gray-200/50 bg-white p-4 shadow-sm dark:border-gray-800/50 dark:bg-gray-900">
        <div className="flex items-center gap-2 text-sm">
          <TrendingUp className="h-4 w-4 text-emerald-500" />
          <span className="text-sm font-semibold text-gray-900 dark:text-white">Budget Alerts</span>
        </div>
        <div className="mt-3 rounded-lg bg-emerald-50 px-3 py-2.5 dark:bg-emerald-900/10">
          <p className="text-sm font-medium text-emerald-700 dark:text-emerald-400">All budgets on track</p>
          <p className="text-xs text-emerald-600 dark:text-emerald-500">No alerts at this time</p>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-gray-200/50 bg-white shadow-sm dark:border-gray-800/50 dark:bg-gray-900">
      <div className="flex items-center gap-2 border-b border-gray-100 px-4 py-3 dark:border-gray-800">
        <AlertCircle className="h-4 w-4 text-gray-500" />
        <h3 className="text-sm font-semibold text-gray-900 dark:text-white">Budget Alerts</h3>
        <span className="ml-auto rounded-full bg-red-100 px-2 py-0.5 text-xs font-medium text-red-700 dark:bg-red-900/30 dark:text-red-400">
          {alerts.length}
        </span>
      </div>
      <div className="space-y-1 p-3">
        {alerts.slice(0, 3).map((a) => (
          <div
            key={a.id}
            className={cn(
              'flex items-start gap-2.5 rounded-lg px-3 py-2',
              a.type === 'danger'
                ? 'bg-red-50 dark:bg-red-900/10'
                : 'bg-amber-50 dark:bg-amber-900/10'
            )}
          >
            <a.icon className={cn(
              'mt-0.5 h-4 w-4 shrink-0',
              a.type === 'danger' ? 'text-red-500' : 'text-amber-500'
            )} />
            <div>
              <p className={cn(
                'text-xs font-medium',
                a.type === 'danger' ? 'text-red-700 dark:text-red-400' : 'text-amber-700 dark:text-amber-400'
              )}>{a.title}</p>
              <p className="text-xs text-gray-600 dark:text-gray-400">{a.message}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function cn(...classes: (string | boolean | undefined | null)[]): string {
  return classes.filter(Boolean).join(' ');
}
