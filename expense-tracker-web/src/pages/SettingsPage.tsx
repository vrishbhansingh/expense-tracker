import { Download, FileText, Moon, Sun, Monitor } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { useThemeStore } from '@/store/themeStore';
import { useAuthStore } from '@/store/authStore';
import { api } from '@/lib/api';
import toast from 'react-hot-toast';
import Papa from 'papaparse';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

export default function SettingsPage() {
  const { theme, setTheme } = useThemeStore();
  const { user } = useAuthStore();

  const exportCsv = async () => {
    const { data } = await api.get('/expenses?per_page=1000');
    const rows = data.data.map((e: any) => ({
      Date: e.expense_date,
      Category: e.category?.name,
      Description: e.description,
      Amount: e.amount,
      Currency: e.currency,
      Payment: e.payment_method,
    }));
    const csv = Papa.unparse(rows);
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `expenses-${Date.now()}.csv`;
    a.click();
    toast.success('CSV downloaded');
  };

  const exportPdf = async () => {
    const { data } = await api.get('/expenses?per_page=1000');
    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.text('Expense Report', 14, 20);
    doc.setFontSize(10);
    doc.text(`Generated: ${new Date().toLocaleString()}`, 14, 28);
    autoTable(doc, {
      startY: 36,
      head: [['Date', 'Category', 'Description', 'Amount']],
      body: data.data.map((e: any) => [e.expense_date, e.category?.name, e.description, `${e.currency} ${e.amount}`]),
    });
    doc.save(`expenses-${Date.now()}.pdf`);
    toast.success('PDF downloaded');
  };

  return (
    <div className="space-y-6 animate-fade-in max-w-3xl">
      <div>
        <h1 className="text-2xl font-bold sm:text-3xl">Settings</h1>
        <p className="text-gray-600 dark:text-gray-400">Customize your experience</p>
      </div>

      <Card>
        <h2 className="text-lg font-semibold">Appearance</h2>
        <p className="mt-1 text-sm text-gray-500">Choose how the app looks</p>
        <div className="mt-4 grid gap-3 sm:grid-cols-3">
          {[
            { id: 'light', label: 'Light', icon: Sun },
            { id: 'dark', label: 'Dark', icon: Moon },
            { id: 'system', label: 'System', icon: Monitor },
          ].map((opt) => (
            <button
              key={opt.id}
              onClick={() => setTheme(opt.id as any)}
              className={`flex flex-col items-center gap-2 rounded-lg border-2 p-4 transition ${
                (theme === opt.id || (theme === undefined && opt.id === 'system'))
                  ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
                  : 'border-gray-200 hover:border-gray-300 dark:border-gray-800'
              }`}
            >
              <opt.icon className="h-6 w-6" />
              <span className="text-sm font-medium">{opt.label}</span>
            </button>
          ))}
        </div>
      </Card>

      <Card>
        <h2 className="text-lg font-semibold">Export Data</h2>
        <p className="mt-1 text-sm text-gray-500">Download your expenses</p>
        <div className="mt-4 flex flex-wrap gap-3">
          <Button variant="secondary" onClick={exportCsv}>
            <Download className="h-4 w-4" /> Export CSV
          </Button>
          <Button variant="secondary" onClick={exportPdf}>
            <FileText className="h-4 w-4" /> Export PDF
          </Button>
        </div>
      </Card>

      <Card>
        <h2 className="text-lg font-semibold">Account</h2>
        <div className="mt-4 space-y-3 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-500">Name</span>
            <span className="font-medium">{user?.name}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500">Email</span>
            <span className="font-medium">{user?.email}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500">Default currency</span>
            <span className="font-medium">{user?.currency}</span>
          </div>
        </div>
      </Card>
    </div>
  );
}
