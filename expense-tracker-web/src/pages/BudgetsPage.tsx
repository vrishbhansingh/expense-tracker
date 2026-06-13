import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Plus, Edit, Trash2, AlertCircle } from 'lucide-react';
import { api } from '@/lib/api';
import { Budget, Category } from '@/types';
import { formatCurrency } from '@/lib/utils';
import { Card, CardHeader, CardTitle } from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Modal from '@/components/ui/Modal';
import toast from 'react-hot-toast';

export default function BudgetsPage() {
  const qc = useQueryClient();
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Budget | null>(null);

  const { data: budgets = [], isLoading } = useQuery({
    queryKey: ['budgets'],
    queryFn: () => api.get<Budget[]>('/budgets').then((r) => r.data),
  });

  const { data: cats = [] } = useQuery({
    queryKey: ['categories'],
    queryFn: () => api.get<Category[]>('/categories').then((r) => r.data),
  });

  const { data: expensesData } = useQuery({
    queryKey: ['expenses'],
    queryFn: () => api.get('/expenses?per_page=100').then((r) => r.data),
  });

  const deleteMut = useMutation({
    mutationFn: (id: number) => api.delete(`/budgets/${id}`),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['budgets'] }); toast.success('Deleted'); },
  });

  const spentFor = (b: Budget) => {
    const now = new Date();
    const from = (() => {
      switch (b.period) {
        case 'daily': return new Date(now.getFullYear(), now.getMonth(), now.getDate());
        case 'weekly': { const d = new Date(now); d.setDate(d.getDate() - d.getDay()); return d; }
        case 'monthly': return new Date(now.getFullYear(), now.getMonth(), 1);
        case 'yearly': return new Date(now.getFullYear(), 0, 1);
      }
    })();
    return (expensesData?.data || [])
      .filter((e: any) => (!b.category_id || e.category_id === b.category_id) && new Date(e.expense_date) >= from)
      .reduce((s: number, e: any) => s + parseFloat(e.amount), 0);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold sm:text-3xl">Budgets</h1>
          <p className="text-gray-600 dark:text-gray-400">Set spending limits and stay on track</p>
        </div>
        <Button onClick={() => { setEditing(null); setShowForm(true); }}><Plus className="h-4 w-4" /> New Budget</Button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {isLoading ? (
          <p className="col-span-full py-12 text-center text-gray-500">Loading...</p>
        ) : budgets.length === 0 ? (
          <Card className="col-span-full text-center py-12">
            <p className="text-gray-500">No budgets yet. Create your first one!</p>
          </Card>
        ) : (
          budgets.map((b) => {
            const spent = spentFor(b);
            const pct = Math.min(100, (spent / parseFloat(b.amount as any)) * 100);
            const over = spent > parseFloat(b.amount as any);
            return (
              <Card key={b.id}>
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-semibold">{b.name}</h3>
                    <p className="text-xs text-gray-500 capitalize">{b.period} • {b.category?.name || 'All'}</p>
                  </div>
                  <div className="flex gap-1">
                    <button onClick={() => { setEditing(b); setShowForm(true); }} className="rounded p-1.5 hover:bg-gray-100 dark:hover:bg-gray-800">
                      <Edit className="h-4 w-4" />
                    </button>
                    <button onClick={() => { if (confirm('Delete?')) deleteMut.mutate(b.id); }} className="rounded p-1.5 text-red-600 hover:bg-red-50">
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
                <div className="mt-4">
                  <div className="flex items-center justify-between text-sm">
                    <span>{formatCurrency(spent, b.currency)}</span>
                    <span className="font-semibold">{formatCurrency(parseFloat(b.amount as any), b.currency)}</span>
                  </div>
                  <div className="mt-2 h-2 overflow-hidden rounded-full bg-gray-200 dark:bg-gray-800">
                    <div
                      className={`h-full transition-all ${over ? 'bg-red-500' : pct > b.alert_threshold ? 'bg-amber-500' : 'bg-emerald-500'}`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                  <p className="mt-1 text-xs text-gray-500">{pct.toFixed(0)}% used</p>
                </div>
                {pct > b.alert_threshold && (
                  <div className={`mt-3 flex items-center gap-2 rounded-lg p-2 text-xs ${over ? 'bg-red-50 text-red-700' : 'bg-amber-50 text-amber-700'}`}>
                    <AlertCircle className="h-4 w-4" /> {over ? 'Budget exceeded!' : 'Approaching limit'}
                  </div>
                )}
              </Card>
            );
          })
        )}
      </div>

      <Modal open={showForm} onClose={() => setShowForm(false)} title={editing ? 'Edit Budget' : 'New Budget'}>
        <BudgetForm
          budget={editing}
          categories={cats}
          onClose={() => setShowForm(false)}
          onSaved={() => { setShowForm(false); qc.invalidateQueries({ queryKey: ['budgets'] }); }}
        />
      </Modal>
    </div>
  );
}

function BudgetForm({ budget, categories, onClose, onSaved }: any) {
  const [form, setForm] = useState({
    name: budget?.name || '',
    amount: budget?.amount || '',
    category_id: budget?.category_id || '',
    period: budget?.period || 'monthly',
    start_date: budget?.start_date || new Date().toISOString().split('T')[0],
    alert_threshold: budget?.alert_threshold || 80,
  });

  const save = useMutation({
    mutationFn: (data: any) => budget ? api.put(`/budgets/${budget.id}`, data) : api.post('/budgets', data),
    onSuccess: () => { toast.success('Saved'); onSaved(); },
  });

  return (
    <form onSubmit={(e) => { e.preventDefault(); save.mutate({ ...form, amount: parseFloat(form.amount), category_id: form.category_id || null }); }} className="space-y-4">
      <div>
        <label className="label">Name</label>
        <input required className="input" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="label">Amount</label>
          <input type="number" step="0.01" required className="input" value={form.amount} onChange={(e) => setForm({ ...form, amount: e.target.value })} />
        </div>
        <div>
          <label className="label">Period</label>
          <select className="input" value={form.period} onChange={(e) => setForm({ ...form, period: e.target.value })}>
            <option value="daily">Daily</option>
            <option value="weekly">Weekly</option>
            <option value="monthly">Monthly</option>
            <option value="yearly">Yearly</option>
          </select>
        </div>
      </div>
      <div>
        <label className="label">Category (optional)</label>
        <select className="input" value={form.category_id} onChange={(e) => setForm({ ...form, category_id: e.target.value })}>
          <option value="">All categories</option>
          {categories.map((c: Category) => <option key={c.id} value={c.id}>{c.name}</option>)}
        </select>
      </div>
      <div>
        <label className="label">Alert threshold (%)</label>
        <input type="number" min="0" max="100" className="input" value={form.alert_threshold} onChange={(e) => setForm({ ...form, alert_threshold: parseInt(e.target.value) })} />
      </div>
      <div className="flex justify-end gap-2">
        <Button type="button" variant="secondary" onClick={onClose}>Cancel</Button>
        <Button type="submit" loading={save.isPending}>Save</Button>
      </div>
    </form>
  );
}
