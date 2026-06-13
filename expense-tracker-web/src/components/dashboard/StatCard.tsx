import { cn } from '@/lib/utils';
import { LucideIcon, TrendingUp, TrendingDown } from 'lucide-react';

interface StatCardProps {
  icon: LucideIcon;
  label: string;
  value: string;
  trend?: string;
  trendUp?: boolean;
  color: string;
  subtitle?: string;
}

export default function StatCard({ icon: Icon, label, value, trend, trendUp = true, color, subtitle }: StatCardProps) {
  return (
    <div className={cn(
      'group relative overflow-hidden rounded-xl border border-gray-200/50 bg-white p-4 shadow-sm transition-all hover:shadow-md dark:border-gray-800/50 dark:bg-gray-900',
      'hover:scale-[1.02]'
    )}>
      <div className="absolute right-0 top-0 h-20 w-20 translate-x-6 -translate-y-6 rounded-full opacity-10" style={{ backgroundColor: color }} />
      <div className="flex items-start justify-between">
        <div className={cn(
          'flex h-10 w-10 items-center justify-center rounded-lg',
        )} style={{ backgroundColor: `${color}15` }}>
          <Icon className="h-5 w-5" style={{ color }} />
        </div>
        {trend && (
          <span className={cn(
            'inline-flex items-center gap-0.5 rounded-full px-2 py-0.5 text-xs font-medium',
            trendUp ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-400' : 'bg-red-50 text-red-700 dark:bg-red-900/20 dark:text-red-400'
          )}>
            {trendUp ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
            {trend}
          </span>
        )}
      </div>
      <p className="mt-3 text-xs font-medium text-gray-500 dark:text-gray-400">{label}</p>
      <p className="mt-0.5 text-xl font-bold tracking-tight text-gray-900 dark:text-white">{value}</p>
      {subtitle && <p className="mt-0.5 text-xs text-gray-400">{subtitle}</p>}
    </div>
  );
}
