import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Plus, Edit, Trash2 } from 'lucide-react';
import { api } from '@/lib/api';
import { Category } from '@/types';
import { Card } from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Modal from '@/components/ui/Modal';
import { categoryIcon, hexToRgb } from '@/lib/utils';
import toast from 'react-hot-toast';

const ICONS = ['category', 'restaurant', 'car', 'shopping_bag', 'movie', 'receipt', 'medical', 'school', 'flight', 'home', 'work', 'gift', 'pets', 'sports', 'cake'];
const COLORS = ['#EF4444', '#F59E0B', '#10B981', '#3B82F6', '#8B5CF6', '#EC4899', '#14B8A6', '#6366F1', '#6B7280'];

export default function CategoriesPage() {
  const qc = useQueryClient();
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Category | null>(null);

  const { data: categories = [], isLoading } = useQuery({
    queryKey: ['categories'],
    queryFn: () => api.get<Category[]>('/categories').then((r) => r.data),
  });

  const deleteMut = useMutation({
    mutationFn: (id: number) => api.delete(`/categories/${id}`),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['categories'] }); toast.success('Deleted'); },
  });

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold sm:text-3xl">Categories</h1>
          <p className="text-gray-600 dark:text-gray-400">Organize your expenses</p>
        </div>
        <Button onClick={() => { setEditing(null); setShowForm(true); }}><Plus className="h-4 w-4" /> New Category</Button>
      </div>

      <div className="grid gap-4 sm:grid-cols-3 lg:grid-cols-4">
        {isLoading ? (
          <p className="col-span-full py-12 text-center text-gray-500">Loading...</p>
        ) : categories.map((c) => (
          <Card key={c.id} className="group relative">
            <div className="flex items-center gap-3">
              <div
                className="flex h-12 w-12 items-center justify-center rounded-xl text-2xl"
                style={{ backgroundColor: `rgba(${hexToRgb(c.color)}, 0.15)` }}
              >
                {categoryIcon(c.icon)}
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="truncate font-semibold">{c.name}</h3>
                {c.is_default && <span className="text-xs text-gray-500">Default</span>}
              </div>
            </div>
            {!c.is_default && (
              <div className="absolute right-2 top-2 flex gap-1 opacity-0 group-hover:opacity-100 transition">
                <button onClick={() => { setEditing(c); setShowForm(true); }} className="rounded p-1.5 hover:bg-gray-100 dark:hover:bg-gray-800">
                  <Edit className="h-3.5 w-3.5" />
                </button>
                <button onClick={() => { if (confirm('Delete?')) deleteMut.mutate(c.id); }} className="rounded p-1.5 text-red-600 hover:bg-red-50">
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            )}
          </Card>
        ))}
      </div>

      <Modal open={showForm} onClose={() => setShowForm(false)} title={editing ? 'Edit Category' : 'New Category'}>
        <CategoryForm
          category={editing}
          onClose={() => setShowForm(false)}
          onSaved={() => { setShowForm(false); qc.invalidateQueries({ queryKey: ['categories'] }); }}
        />
      </Modal>
    </div>
  );
}

function CategoryForm({ category, onClose, onSaved }: any) {
  const [name, setName] = useState(category?.name || '');
  const [icon, setIcon] = useState(category?.icon || 'category');
  const [color, setColor] = useState(category?.color || '#3B82F6');

  const save = useMutation({
    mutationFn: (data: any) => category ? api.put(`/categories/${category.id}`, data) : api.post('/categories', data),
    onSuccess: () => { toast.success('Saved'); onSaved(); },
  });

  return (
    <form onSubmit={(e) => { e.preventDefault(); save.mutate({ name, icon, color }); }} className="space-y-4">
      <div>
        <label className="label">Name</label>
        <input required className="input" value={name} onChange={(e) => setName(e.target.value)} />
      </div>
      <div>
        <label className="label">Icon</label>
        <div className="grid grid-cols-8 gap-2">
          {ICONS.map((i) => (
            <button
              type="button"
              key={i}
              onClick={() => setIcon(i)}
              className={`flex h-10 items-center justify-center rounded-lg text-xl transition ${icon === i ? 'ring-2 ring-primary-500 bg-primary-50 dark:bg-primary-900/20' : 'hover:bg-gray-100 dark:hover:bg-gray-800'}`}
            >
              {categoryIcon(i)}
            </button>
          ))}
        </div>
      </div>
      <div>
        <label className="label">Color</label>
        <div className="grid grid-cols-9 gap-2">
          {COLORS.map((c) => (
            <button
              type="button"
              key={c}
              onClick={() => setColor(c)}
              className={`h-10 rounded-lg ${color === c ? 'ring-2 ring-offset-2 ring-primary-500' : ''}`}
              style={{ backgroundColor: c }}
            />
          ))}
        </div>
      </div>
      <div className="flex justify-end gap-2">
        <Button type="button" variant="secondary" onClick={onClose}>Cancel</Button>
        <Button type="submit" loading={save.isPending}>Save</Button>
      </div>
    </form>
  );
}
