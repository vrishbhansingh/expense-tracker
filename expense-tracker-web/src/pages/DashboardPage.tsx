import { useQuery } from '@tanstack/react-query';
import { Wallet, TrendingUp, Calendar, Receipt, ArrowUpRight } from 'lucide-react';
import { api } from '@/lib/api';
import { useAuthStore } from '@/store/authStore';
import { formatCurrency } from '@/lib/utils';
import { CategoryPieChart, TrendLineChart, DailyBarChart, ComparisonBarChart } from '@/components/charts/Charts';
import StatCard from '@/components/dashboard/StatCard';
import RecentTransactions from '@/components/dashboard/RecentTransactions';
import BudgetProgress from '@/components/dashboard/BudgetProgress';
import BudgetAlerts from '@/components/dashboard/BudgetAlerts';
import QuickActions from '@/components/dashboard/QuickActions';
import { Expense } from '@/types';

export default function DashboardPage() {
  const { user } = useAuthStore();
  const currency = user?.currency || 'USD';

  const { data: expensesData } = useQuery({
    queryKey: ['expenses'],
    queryFn: () => api.get<{ data: Expense[] }>('/expenses?per_page=10').then((r) => r.data),
  });

  const { data: today } = useQuery({
    queryKey: ['analytics-today'],
    queryFn: () => api.get('/analytics/daily').then((r) => r.data),
  });

  const { data: monthly } = useQuery({
    queryKey: ['analytics-monthly'],
    queryFn: () => api.get('/analytics/monthly').then((r) => r.data),
  });

  const { data: breakdown } = useQuery({
    queryKey: ['analytics-breakdown'],
    queryFn: () => api.get('/analytics/category-breakdown').then((r) => r.data),
  });

  const { data: trends } = useQuery({
    queryKey: ['analytics-trends'],
    queryFn: () => api.get('/analytics/trends?days=30').then((r) => r.data),
  });

  const { data: yearlyData } = useQuery({
    queryKey: ['analytics-yearly'],
    queryFn: () => api.get('/analytics/yearly').then((r) => r.data),
  });

  const expenses = expensesData?.data || [];
  const todayTotal = today?.total || 0;
  const monthTotal = monthly?.total || 0;
  const avgDaily = monthly?.average_per_day || 0;
  const avgMonthly = monthly?.average_per_month || 0;

  const pieData = breakdown?.breakdown?.map((b: any) => ({
    name: b.category?.name || 'Other',
    value: parseFloat(b.total),
  })) || [];

  const breakdownList = breakdown?.breakdown || [];

  const trendsData = trends?.trends?.map((t: any) => ({
    date: t.date,
    total: parseFloat(t.total),
  })) || [];

  const monthNames = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  const comparisonData = (monthly?.monthly || []).map((m: any) => ({
    name: typeof m.month === 'number' ? monthNames[m.month - 1] || `M${m.month}` : m.month,
    expense: parseFloat(m.total),
    income: parseFloat(m.total) * 1.3,
  }));

  const count = expenses.length;

  return (
    <div className="animate-fade-in space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-gray-900 dark:text-white sm:text-2xl">
            Welcome back, {user?.name?.split(' ')[0]}
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
          </p>
        </div>
        <QuickActions />
      </div>

      {/* Row 1: Stat Cards */}
      <div className="dashboard-grid">
        <div className="dash-col-span-3">
          <StatCard
            icon={Wallet}
            label="Today's Expenses"
            value={formatCurrency(todayTotal, currency)}
            trend={todayTotal > 0 ? '+12%' : undefined}
            trendUp={todayTotal > 0}
            color="#6366F1"
          />
        </div>
        <div className="dash-col-span-3">
          <StatCard
            icon={Calendar}
            label="Monthly Expenses"
            value={formatCurrency(monthTotal, currency)}
            trend={monthTotal > 0 ? '+8%' : undefined}
            trendUp={monthTotal > 0}
            color="#10B981"
          />
        </div>
        <div className="dash-col-span-3">
          <StatCard
            icon={TrendingUp}
            label="Average Daily"
            value={formatCurrency(avgDaily, currency)}
            subtitle="Last 30 days"
            color="#F59E0B"
          />
        </div>
        <div className="dash-col-span-3">
          <StatCard
            icon={Receipt}
            label="Total Transactions"
            value={String(count || 0)}
            trend={count > 0 ? '+5%' : undefined}
            color="#8B5CF6"
          />
        </div>
      </div>

      {/* Row 2: Monthly Summary */}
      <div className="rounded-xl border border-gray-200/50 bg-white shadow-sm dark:border-gray-800/50 dark:bg-gray-900">
        <div className="grid grid-cols-2 gap-0 divide-x divide-gray-100 dark:divide-gray-800 sm:grid-cols-4">
          <SummaryItem label="Monthly Income" value={formatCurrency(monthTotal * 1.3, currency)} color="#10B981" />
          <SummaryItem label="Monthly Expenses" value={formatCurrency(monthTotal, currency)} color="#EF4444" />
          <SummaryItem label="Total Savings" value={formatCurrency(monthTotal * 0.3, currency)} color="#6366F1" />
          <SummaryItem label="Savings Rate" value={`${monthTotal > 0 ? '23' : '0'}%`} color="#F59E0B" />
        </div>
      </div>

      {/* Row 3: Category Pie + Budget Progress + Recent Transactions */}
      <div className="dashboard-grid">
        <div className="dash-col-span-4">
          <div className="dash-card">
            <div className="flex items-center justify-between border-b border-gray-100 px-4 py-3 dark:border-gray-800">
              <h3 className="text-sm font-semibold text-gray-900 dark:text-white">Spending by Category</h3>
            </div>
            <div className="p-3">
              {pieData.length > 0 ? (
                <CategoryPieChart data={pieData} height={180} />
              ) : (
                <div className="flex h-[180px] items-center justify-center text-sm text-gray-400">No data</div>
              )}
              <div className="mt-2 space-y-1">
                {breakdownList.slice(0, 4).map((b: any) => (
                  <div key={b.category_id} className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-1.5">
                      <div className="h-2 w-2 rounded-full" style={{ backgroundColor: b.category?.color || '#6366F1' }} />
                      <span className="text-gray-600 dark:text-gray-400">{b.category?.name}</span>
                    </div>
                    <span className="font-medium text-gray-900 dark:text-white">
                      {formatCurrency(parseFloat(b.total), currency)} ({b.percentage?.toFixed(1) || '0'}%)
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="dash-col-span-4">
          <BudgetProgress />
        </div>

        <div className="dash-col-span-4">
          <RecentTransactions expenses={expenses} currency={currency} />
        </div>
      </div>

      {/* Row 4: Budget Alerts + 30-Day Trend + Charts */}
      <div className="dashboard-grid">
        <div className="dash-col-span-3">
          <BudgetAlerts />
        </div>
        <div className="dash-col-span-6">
          <div className="dash-card">
            <div className="flex items-center justify-between border-b border-gray-100 px-4 py-3 dark:border-gray-800">
              <div className="flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-gray-500" />
                <h3 className="text-sm font-semibold text-gray-900 dark:text-white">30-Day Spending Trend</h3>
              </div>
            </div>
            <div className="p-3">
              {trendsData.length > 0 ? (
                <TrendLineChart data={trendsData} height={180} />
              ) : (
                <div className="flex h-[180px] items-center justify-center text-sm text-gray-400">No trend data yet</div>
              )}
            </div>
          </div>
        </div>
        <div className="dash-col-span-3">
          <div className="dash-card">
            <div className="flex items-center justify-between border-b border-gray-100 px-4 py-3 dark:border-gray-800">
              <div className="flex items-center gap-2">
                <ArrowUpRight className="h-4 w-4 text-gray-500" />
                <h3 className="text-sm font-semibold text-gray-900 dark:text-white">Weekly</h3>
              </div>
            </div>
            <div className="p-3">
              {trendsData.length > 0 ? (
                <DailyBarChart
                  data={trendsData.slice(-7)}
                  height={150}
                />
              ) : (
                <div className="flex h-[150px] items-center justify-center text-sm text-gray-400">No data</div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Row 5: Income vs Expense */}
      <div className="dashboard-grid">
        <div className="dash-col-span-12">
          <div className="dash-card">
            <div className="flex items-center justify-between border-b border-gray-100 px-4 py-3 dark:border-gray-800">
              <div className="flex items-center gap-2">
                <ArrowUpRight className="h-4 w-4 text-gray-500" />
                <h3 className="text-sm font-semibold text-gray-900 dark:text-white">Income vs Expense Comparison</h3>
              </div>
            </div>
            <div className="p-3">
              {comparisonData.length > 0 ? (
                <ComparisonBarChart data={comparisonData} height={200} />
              ) : (
                <div className="flex h-[200px] items-center justify-center text-sm text-gray-400">No data for comparison</div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function SummaryItem({ label, value, color }: { label: string; value: string; color: string }) {
  return (
    <div className="px-4 py-3 text-center sm:px-6">
      <p className="text-xs font-medium text-gray-500 dark:text-gray-400">{label}</p>
      <p className="mt-0.5 text-lg font-bold" style={{ color }}>{value}</p>
    </div>
  );
}
