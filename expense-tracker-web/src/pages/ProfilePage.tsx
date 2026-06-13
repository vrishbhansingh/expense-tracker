import { useState } from 'react';
import { useAuthStore } from '@/store/authStore';
import { Card } from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import { api } from '@/lib/api';
import toast from 'react-hot-toast';

export default function ProfilePage() {
  const { user, updateUser } = useAuthStore();
  const [form, setForm] = useState({
    name: user?.name || '',
    phone: '',
    currency: user?.currency || 'USD',
  });
  const [saving, setSaving] = useState(false);

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await api.put('/user/profile', form);
      updateUser(form);
      toast.success('Profile updated');
    } catch {
      toast.error('Failed to save');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-2xl space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold sm:text-3xl">Profile</h1>
        <p className="text-gray-600 dark:text-gray-400">Manage your account</p>
      </div>

      <Card>
        <div className="flex items-center gap-4">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-primary-500 to-primary-700 text-2xl font-bold text-white">
            {user?.name?.charAt(0).toUpperCase()}
          </div>
          <div>
            <h2 className="font-semibold">{user?.name}</h2>
            <p className="text-sm text-gray-500">{user?.email}</p>
          </div>
        </div>
      </Card>

      <Card>
        <h2 className="mb-4 text-lg font-semibold">Edit Profile</h2>
        <form onSubmit={save} className="space-y-4">
          <Input label="Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          <Input label="Phone" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder="+1 (555) 000-0000" />
          <div>
            <label className="label">Default Currency</label>
            <select className="input" value={form.currency} onChange={(e) => setForm({ ...form, currency: e.target.value })}>
              <option value="USD">USD - US Dollar</option>
              <option value="EUR">EUR - Euro</option>
              <option value="GBP">GBP - British Pound</option>
              <option value="JPY">JPY - Japanese Yen</option>
              <option value="INR">INR - Indian Rupee</option>
              <option value="BDT">BDT - Bangladeshi Taka</option>
            </select>
          </div>
          <Button type="submit" loading={saving}>Save Changes</Button>
        </form>
      </Card>

      <Card>
        <h2 className="mb-2 text-lg font-semibold">Change Password</h2>
        <p className="mb-4 text-sm text-gray-500">Update your password</p>
        <form onSubmit={(e) => { e.preventDefault(); toast('Contact support to change password'); }} className="space-y-4">
          <Input label="Current password" type="password" />
          <Input label="New password" type="password" />
          <Input label="Confirm new password" type="password" />
          <Button type="submit">Update Password</Button>
        </form>
      </Card>
    </div>
  );
}
