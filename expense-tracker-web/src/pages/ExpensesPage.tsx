import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Plus, Search, Edit, Trash2, Filter } from 'lucide-react';
import { api } from '@/lib/api';
import { Expense, Category } from '@/types';
import { useAuthStore } from '@/store/authStore';
import { formatCurrency } from '@/lib/utils';
import { Card, CardHeader, CardTitle } from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Modal from '@/components/ui/Modal';
import toast from 'react-hot-toast';

export default function ExpensesPage() {
  const qc = useQueryClient();
  const { user } = useAuthStore();
  const currency = user?.currency || 'USD';

  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [editing, setEditing] = useState<Expense | null>(null);
  const [showForm, setShowForm] = useState(false);

  const { data, isLoading } = useQuery({
    queryKey: ['expenses', page, search, categoryFilter],
    queryFn: () => api.get('/expenses', {
      params: { page, search, category_id: categoryFilter || undefined, per_page: 20 }
    }).then((r) => r.data),
  });

  const { data: cats } = useQuery({
    queryKey: ['categories'],
    queryFn: () => api.get<Category[]>('/categories').then((r) => r.data),
  });

  const deleteMut = useMutation({
    mutationFn: (id: number) => api.delete(`/expenses/${id}`),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['expenses'] }); toast.success('Deleted'); },
  });

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold sm:text-3xl">Expenses</h1>
          <p className="text-gray-600 dark:text-gray-400">{data?.total || 0} total transactions</p>
        </div>
        <Button onClick={() => { setEditing(null); setShowForm(true); }}>
          <Plus className="h-4 w-4" /> Add Expense
        </Button>
      </div>

      <Card>
        <div className="flex flex-col gap-3 sm:flex-row">
          <div className="flex-1">
            <Input placeholder="Search..." value={search} onChange={(e) => setSearch(e.target.value)} leftIcon={<Search className="h-4 w-4" />} />
          </div>
          <select value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)} className="input sm:w-48">
            <option value="">All categories</option>
            {cats?.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
        </div>
      </Card>

      <Card>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200 dark:border-gray-800 text-left text-sm text-gray-500">
                <th className="pb-3">Date</th>
                <th className="pb-3">Category</th>
                <th className="pb-3">Description</th>
                <th className="pb-3">Payment</th>
                <th className="pb-3 text-right">Amount</th>
                <th className="pb-3"></th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr><td colSpan={6} className="py-12 text-center text-gray-500">Loading...</td></tr>
              ) : data?.data?.length === 0 ? (
                <tr><td colSpan={6} className="py-12 text-center text-gray-500">No expenses found</td></tr>
              ) : (
                data?.data?.map((e: Expense) => (
                  <tr key={e.id} className="border-b border-gray-100 hover:bg-gray-50 dark:border-gray-800 dark:hover:bg-gray-800/30">
                    <td className="py-3 text-sm">{new Date(e.expense_date).toLocaleDateString()}</td>
                    <td className="py-3">
                      <span className="badge" style={{ backgroundColor: `${e.category?.color}20`, color: e.category?.color }}>
                        {e.category?.name}
                      </span>
                    </td>
                    <td className="py-3 text-sm">{e.description}</td>
                    <td className="py-3 text-sm capitalize">{e.payment_method.replace('_', ' ')}</td>
                    <td className="py-3 text-right font-semibold text-red-600">-{formatCurrency(parseFloat(e.amount as any), e.currency)}</td>
                    <td className="py-3 text-right">
                      <div className="flex justify-end gap-1">
                        <button onClick={() => { setEditing(e); setShowForm(true); }} className="rounded p-1.5 hover:bg-gray-100 dark:hover:bg-gray-800">
                          <Edit className="h-4 w-4" />
                        </button>
                        <button onClick={() => { if (confirm('Delete?')) deleteMut.mutate(e.id); }} className="rounded p-1.5 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20">
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        {data && data.last_page > 1 && (
          <div className="mt-4 flex items-center justify-between">
            <p className="text-sm text-gray-500">Page {data.current_page} of {data.last_page}</p>
            <div className="flex gap-2">
              <Button variant="secondary" size="sm" disabled={page === 1} onClick={() => setPage((p) => p - 1)}>Previous</Button>
              <Button variant="secondary" size="sm" disabled={page === data.last_page} onClick={() => setPage((p) => p + 1)}>Next</Button>
            </div>
          </div>
        )}
      </Card>

      <Modal open={showForm} onClose={() => setShowForm(false)} title={editing ? 'Edit Expense' : 'New Expense'} size="lg">
        <ExpenseForm
          expense={editing}
          categories={cats || []}
          onClose={() => setShowForm(false)}
          onSaved={() => { setShowForm(false); qc.invalidateQueries({ queryKey: ['expenses'] }); }}
        />
      </Modal>
    </div>
  );
}

function ExpenseForm({ expense, categories, onClose, onSaved }: any) {
  const [form, setForm] = useState({
    category_id: expense?.category_id || categories[0]?.id || 0,
    amount: expense?.amount || '',
    description: expense?.description || '',
    notes: expense?.notes || '',
    expense_date: expense?.expense_date || new Date().toISOString().split('T')[0],
    payment_method: expense?.payment_method || 'cash',
    location: expense?.location || '',
    tags: expense?.tags?.join(', ') || '',
  });

  const save = useMutation({
    mutationFn: (data: any) => expense
      ? api.put(`/expenses/${expense.id}`, data)
      : api.post('/expenses', data),
    onSuccess: () => { toast.success('Saved'); onSaved(); },
    onError: () => toast.error('Failed'),
  });

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    save.mutate({
      ...form,
      amount: parseFloat(form.amount),
      tags: form.tags.split(',').map((t: string) => t.trim()).filter(Boolean),
    });
  };

  return (
    <form onSubmit={submit} className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="label">Amount</label>
          <input type="number" step="0.01" required className="input" value={form.amount} onChange={(e) => setForm({ ...form, amount: e.target.value })} />
        </div>
        <div>
          <label className="label">Date</label>
          <input type="date" required className="input" value={form.expense_date} onChange={(e) => setForm({ ...form, expense_date: e.target.value })} />
        </div>
      </div>
      <div>
        <label className="label">Description</label>
        <input required className="input" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
      </div>
      <div>
        <label className="label">Category</label>
        <select className="input" value={form.category_id} onChange={(e) => setForm({ ...form, category_id: parseInt(e.target.value) })}>
          {categories.map((c: Category) => <option key={c.id} value={c.id}>{c.name}</option>)}
        </select>
      </div>
      <div>
        <label className="label">Payment method</label>
        <select className="input" value={form.payment_method} onChange={(e) => setForm({ ...form, payment_method: e.target.value })}>
          <option value="cash">Cash</option>
          <option value="credit_card">Credit Card</option>
          <option value="debit_card">Debit Card</option>
          <option value="bank_transfer">Bank Transfer</option>
          <option value="mobile_wallet">Mobile Wallet</option>
        </select>
      </div>
      <div>
        <label className="label">Location (optional)</label>
        <input className="input" value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} />
      </div>
      <div>
        <label className="label">Tags (comma separated)</label>
        <input className="input" value={form.tags} onChange={(e) => setForm({ ...form, tags: e.target.value })} placeholder="work, lunch" />
      </div>
      <div>
        <label className="label">Notes</label>
        <textarea rows={3} className="input" value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} />
      </div>
      <div className="flex justify-end gap-2">
        <Button type="button" variant="secondary" onClick={onClose}>Cancel</Button>
        <Button type="submit" loading={save.isPending}>Save</Button>
      </div>
    </form>
  );
}
