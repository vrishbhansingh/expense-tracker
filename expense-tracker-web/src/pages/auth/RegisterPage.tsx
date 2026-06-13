import { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, User, ArrowRight, Eye, EyeOff, Check } from 'lucide-react';
import { useAuthStore } from '@/store/authStore';
import AuthLayout from '@/components/auth/AuthLayout';

const CURRENCIES = [
  { value: 'USD', label: 'USD - US Dollar' },
  { value: 'EUR', label: 'EUR - Euro' },
  { value: 'GBP', label: 'GBP - British Pound' },
  { value: 'JPY', label: 'JPY - Japanese Yen' },
  { value: 'INR', label: 'INR - Indian Rupee' },
  { value: 'BDT', label: 'BDT - Bangladeshi Taka' },
];

export default function RegisterPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [currency, setCurrency] = useState('USD');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const { register, loading } = useAuthStore();
  const navigate = useNavigate();
  const nameRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    nameRef.current?.focus();
  }, []);

  const validate = () => {
    const e: Record<string, string> = {};
    if (!name.trim()) e.name = 'Name is required';
    if (!email) e.email = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) e.email = 'Invalid email address';
    if (!password) e.password = 'Password is required';
    else if (password.length < 8) e.password = 'Minimum 8 characters';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    const ok = await register(name, email, password);
    if (ok) navigate('/dashboard');
  };

  const inputClass = (field: string) =>
    `block w-full rounded-lg border py-2.5 pl-10 pr-3 text-sm outline-none transition-colors placeholder:text-gray-400 focus:ring-2 focus:ring-offset-0 dark:bg-gray-900 dark:text-white ${
      errors[field]
        ? 'border-red-300 focus:border-red-400 focus:ring-red-200 dark:border-red-700 dark:focus:ring-red-800'
        : 'border-gray-300 focus:border-primary-500 focus:ring-primary-200 dark:border-gray-700 dark:focus:border-primary-400 dark:focus:ring-primary-800'
    }`;

  const passwordStrength = () => {
    if (!password) return null;
    const score = [password.length >= 8, /[A-Z]/.test(password), /[a-z]/.test(password), /\d/.test(password), /[^A-Za-z0-9]/.test(password)].filter(Boolean).length;
    if (score <= 2) return { label: 'Weak', color: 'bg-red-500', text: 'text-red-500' };
    if (score === 3) return { label: 'Medium', color: 'bg-amber-500', text: 'text-amber-500' };
    if (score === 4) return { label: 'Strong', color: 'bg-emerald-400', text: 'text-emerald-500' };
    return { label: 'Very strong', color: 'bg-emerald-500', text: 'text-emerald-600' };
  };

  const strength = passwordStrength();

  return (
    <AuthLayout
      title="Create your account"
      subtitle="Start tracking your expenses today"
      alternateLink="/login"
      alternateText="Already have an account?"
      alternateLabel="Sign in"
    >
      <form onSubmit={onSubmit} className="space-y-3.5">
        <div>
          <label htmlFor="name" className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
            Full name
          </label>
          <div className="relative">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
              <User className="h-4 w-4" />
            </div>
            <input
              ref={nameRef}
              id="name"
              type="text"
              autoComplete="name"
              required
              value={name}
              onChange={(e) => { setName(e.target.value); setErrors((p) => ({ ...p, name: '' })); }}
              className={inputClass('name')}
              placeholder="John Doe"
            />
          </div>
          {errors.name && <p className="mt-1 text-xs text-red-500">{errors.name}</p>}
        </div>

        <div>
          <label htmlFor="reg-email" className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
            Email address
          </label>
          <div className="relative">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
              <Mail className="h-4 w-4" />
            </div>
            <input
              id="reg-email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => { setEmail(e.target.value); setErrors((p) => ({ ...p, email: '' })); }}
              className={inputClass('email')}
              placeholder="you@example.com"
            />
          </div>
          {errors.email && <p className="mt-1 text-xs text-red-500">{errors.email}</p>}
        </div>

        <div>
          <label htmlFor="reg-password" className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
            Password
          </label>
          <div className="relative">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
              <Lock className="h-4 w-4" />
            </div>
            <input
              id="reg-password"
              type={showPassword ? 'text' : 'password'}
              autoComplete="new-password"
              required
              value={password}
              onChange={(e) => { setPassword(e.target.value); setErrors((p) => ({ ...p, password: '' })); }}
              className={`${inputClass('password')} pr-10`}
              placeholder="Create a strong password"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              tabIndex={-1}
            >
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
          {errors.password && <p className="mt-1 text-xs text-red-500">{errors.password}</p>}
          {password && strength && (
            <div className="mt-1.5 space-y-1">
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div
                    key={i}
                    className={`h-1 flex-1 rounded-full transition-colors ${
                      i <= [0, 2, 3, 4, 5][Math.min(strength.label === 'Weak' ? 2 : strength.label === 'Medium' ? 3 : strength.label === 'Strong' ? 4 : 5, 5)]
                        ? strength.color
                        : 'bg-gray-200 dark:bg-gray-700'
                    }`}
                  />
                ))}
              </div>
              <p className={`text-xs ${strength.text}`}>{strength.label}</p>
            </div>
          )}
        </div>

        <div>
          <label htmlFor="currency" className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
            Default currency
          </label>
          <select
            id="currency"
            value={currency}
            onChange={(e) => setCurrency(e.target.value)}
            className="block w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm outline-none transition-colors focus:border-primary-500 focus:ring-2 focus:ring-primary-200 dark:border-gray-700 dark:bg-gray-900 dark:text-white dark:focus:border-primary-400 dark:focus:ring-primary-800"
          >
            {CURRENCIES.map((c) => (
              <option key={c.value} value={c.value}>{c.label}</option>
            ))}
          </select>
        </div>

        <div className="flex items-start gap-2 pt-1">
          <input
            id="terms"
            type="checkbox"
            required
            className="mt-0.5 h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500 dark:border-gray-600 dark:bg-gray-900"
          />
          <label htmlFor="terms" className="text-xs text-gray-500 dark:text-gray-400">
            I agree to the{' '}
            <Link to="/" className="font-medium text-primary-600 hover:underline dark:text-primary-400">Terms of Service</Link>
            {' '}and{' '}
            <Link to="/" className="font-medium text-primary-600 hover:underline dark:text-primary-400">Privacy Policy</Link>
          </label>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="flex w-full items-center justify-center gap-2 rounded-lg bg-primary-600 px-4 py-2.5 text-sm font-semibold text-white transition-all hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60 dark:focus:ring-offset-gray-800"
        >
          {loading ? (
            <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
          ) : (
            <>
              Create account <ArrowRight className="h-4 w-4" />
            </>
          )}
        </button>
      </form>
    </AuthLayout>
  );
}
