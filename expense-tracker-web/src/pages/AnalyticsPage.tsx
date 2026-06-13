import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { useAuthStore } from '@/store/authStore';
import { formatCurrency } from '@/lib/utils';
import { Card, CardHeader, CardTitle } from '@/components/ui/Card';
import { CategoryPieChart, DailyBarChart, TrendLineChart, MonthlyBarChart } from '@/components/charts/Charts';

export default function AnalyticsPage() {
  const { user } = useAuthStore();
  const currency = user?.currency || 'USD';

  const { data: breakdown } = useQuery({
    queryKey: ['breakdown'],
    queryFn: () => api.get('/analytics/category-breakdown').then((r) => r.data),
  });

  const { data: monthly } = useQuery({
    queryKey: ['monthly'],
    queryFn: () => api.get('/analytics/monthly').then((r) => r.data),
  });

  const { data: yearly } = useQuery({
    queryKey: ['yearly'],
    queryFn: () => api.get('/analytics/yearly').then((r) => r.data),
  });

  const { data: trends } = useQuery({
    queryKey: ['trends'],
    queryFn: () => api.get('/analytics/trends?days=30').then((r) => r.data),
  });

  const pieData = breakdown?.breakdown?.map((b: any) => ({
    name: b.category?.name || 'Other',
    value: parseFloat(b.total),
  })) || [];

  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const monthlyData = yearly?.monthly?.map((m: any) => ({
    month: monthNames[m.month - 1],
    total: parseFloat(m.total),
  })) || [];

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold sm:text-3xl">Analytics</h1>
        <p className="text-gray-600 dark:text-gray-400">Visualize your spending patterns</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <div className="card">
          <p className="text-sm text-gray-500">This Month</p>
          <p className="mt-1 text-2xl font-bold">{formatCurrency(monthly?.total || 0, currency)}</p>
        </div>
        <div className="card">
          <p className="text-sm text-gray-500">Daily Average</p>
          <p className="mt-1 text-2xl font-bold">{formatCurrency(monthly?.average_per_day || 0, currency)}</p>
        </div>
        <div className="card">
          <p className="text-sm text-gray-500">This Year</p>
          <p className="mt-1 text-2xl font-bold">{formatCurrency(yearly?.total || 0, currency)}</p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader><CardTitle>By Category</CardTitle></CardHeader>
          {pieData.length > 0 ? <CategoryPieChart data={pieData} /> : <EmptyState />}
        </Card>
        <Card>
          <CardHeader><CardTitle>30-Day Trend</CardTitle></CardHeader>
          {trends?.trends && <TrendLineChart data={trends.trends.map((t: any) => ({ date: new Date(t.date).toLocaleDateString('en', { month: 'short', day: 'numeric' }), total: parseFloat(t.total) }))} />}
        </Card>
      </div>

      <Card>
        <CardHeader><CardTitle>Yearly Overview</CardTitle></CardHeader>
        {monthlyData.length > 0 ? <MonthlyBarChart data={monthlyData} /> : <EmptyState />}
      </Card>
    </div>
  );
}

function EmptyState() {
  return (
    <div className="flex h-72 flex-col items-center justify-center text-gray-400">
      <p>No data yet</p>
      <p className="text-sm">Add expenses to see analytics</p>
    </div>
  );
}
