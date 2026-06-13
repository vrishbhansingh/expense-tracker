import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, AreaChart, Area } from 'recharts';

const COLORS = ['#6366F1', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899', '#14B8A6', '#3B82F6', '#6B7280'];

const tooltipStyle = {
  borderRadius: 10,
  border: '1px solid rgba(99,102,241,0.2)',
  boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
  fontSize: 13,
  padding: '8px 12px',
};

export function TrendLineChart({ data, height = 220 }: { data: { date: string; total: number }[]; height?: number }) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <AreaChart data={data} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
        <defs>
          <linearGradient id="trendGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#6366F1" stopOpacity={0.25} />
            <stop offset="95%" stopColor="#6366F1" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="rgba(107,114,128,0.12)" vertical={false} />
        <XAxis dataKey="date" stroke="rgba(107,114,128,0.5)" fontSize={11} tickLine={false} axisLine={false} tickFormatter={(v) => v?.slice(5) || ''} />
        <YAxis stroke="rgba(107,114,128,0.5)" fontSize={11} tickLine={false} axisLine={false} />
        <Tooltip contentStyle={tooltipStyle} />
        <Area type="monotone" dataKey="total" stroke="#6366F1" fill="url(#trendGrad)" strokeWidth={2} />
      </AreaChart>
    </ResponsiveContainer>
  );
}

export function DailyBarChart({ data, height = 220 }: { data: { date: string; total: number }[]; height?: number }) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <BarChart data={data} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="rgba(107,114,128,0.12)" vertical={false} />
        <XAxis dataKey="date" stroke="rgba(107,114,128,0.5)" fontSize={11} tickLine={false} axisLine={false} />
        <YAxis stroke="rgba(107,114,128,0.5)" fontSize={11} tickLine={false} axisLine={false} />
        <Tooltip contentStyle={tooltipStyle} />
        <Bar dataKey="total" fill="#6366F1" radius={[6, 6, 0, 0]} maxBarSize={32} />
      </BarChart>
    </ResponsiveContainer>
  );
}

export function CategoryPieChart({ data, height = 220 }: { data: { name: string; value: number }[]; height?: number }) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <PieChart>
        <Pie data={data} cx="50%" cy="50%" innerRadius={55} outerRadius={80} paddingAngle={3} dataKey="value">
          {data.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} stroke="transparent" />)}
        </Pie>
        <Tooltip contentStyle={tooltipStyle} />
      </PieChart>
    </ResponsiveContainer>
  );
}

export function MonthlyBarChart({ data, height = 220 }: { data: { month: string; total: number }[]; height?: number }) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <BarChart data={data} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="rgba(107,114,128,0.12)" vertical={false} />
        <XAxis dataKey="month" stroke="rgba(107,114,128,0.5)" fontSize={11} tickLine={false} axisLine={false} />
        <YAxis stroke="rgba(107,114,128,0.5)" fontSize={11} tickLine={false} axisLine={false} />
        <Tooltip contentStyle={tooltipStyle} />
        <Bar dataKey="total" fill="#10B981" radius={[6, 6, 0, 0]} maxBarSize={32} />
      </BarChart>
    </ResponsiveContainer>
  );
}

export function ComparisonBarChart({ data, height = 220 }: { data: { name: string; income: number; expense: number }[]; height?: number }) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <BarChart data={data} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="rgba(107,114,128,0.12)" vertical={false} />
        <XAxis dataKey="name" stroke="rgba(107,114,128,0.5)" fontSize={11} tickLine={false} axisLine={false} />
        <YAxis stroke="rgba(107,114,128,0.5)" fontSize={11} tickLine={false} axisLine={false} />
        <Tooltip contentStyle={tooltipStyle} />
        <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 12 }} />
        <Bar dataKey="income" fill="#10B981" radius={[6, 6, 0, 0]} maxBarSize={20} />
        <Bar dataKey="expense" fill="#EF4444" radius={[6, 6, 0, 0]} maxBarSize={20} />
      </BarChart>
    </ResponsiveContainer>
  );
}
