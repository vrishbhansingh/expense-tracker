import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, ArrowRight, Eye, EyeOff } from 'lucide-react';
import { useAuthStore } from '@/store/authStore';
import AuthLayout from '@/components/auth/AuthLayout';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
  const { login, loading } = useAuthStore();
  const navigate = useNavigate();
  const emailRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    emailRef.current?.focus();
  }, []);

  const validate = () => {
    const e: typeof errors = {};
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
    const ok = await login(email, password);
    if (ok) navigate('/dashboard');
  };

  return (
    <AuthLayout
      title="Welcome back"
      subtitle="Sign in to your account to continue"
      alternateLink="/register"
      alternateText="Don't have an account?"
      alternateLabel="Create one"
    >
      <form onSubmit={onSubmit} className="space-y-4">
        <div>
          <label htmlFor="email" className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
            Email address
          </label>
          <div className="relative">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
              <Mail className="h-4 w-4" />
            </div>
            <input
              ref={emailRef}
              id="email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => { setEmail(e.target.value); setErrors((p) => ({ ...p, email: undefined })); }}
              className={`block w-full rounded-lg border py-2.5 pl-10 pr-3 text-sm outline-none transition-colors placeholder:text-gray-400 focus:ring-2 focus:ring-offset-0 dark:bg-gray-900 dark:text-white ${
                errors.email
                  ? 'border-red-300 focus:border-red-400 focus:ring-red-200 dark:border-red-700 dark:focus:ring-red-800'
                  : 'border-gray-300 focus:border-primary-500 focus:ring-primary-200 dark:border-gray-700 dark:focus:border-primary-400 dark:focus:ring-primary-800'
              }`}
              placeholder="you@example.com"
            />
          </div>
          {errors.email && <p className="mt-1 text-xs text-red-500">{errors.email}</p>}
        </div>

        <div>
          <div className="mb-1.5 flex items-center justify-between">
            <label htmlFor="password" className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Password
            </label>
            <Link to="/forgot-password" className="text-xs font-medium text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300">
              Forgot?
            </Link>
          </div>
          <div className="relative">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
              <Lock className="h-4 w-4" />
            </div>
            <input
              id="password"
              type={showPassword ? 'text' : 'password'}
              autoComplete="current-password"
              required
              value={password}
              onChange={(e) => { setPassword(e.target.value); setErrors((p) => ({ ...p, password: undefined })); }}
              className={`block w-full rounded-lg border py-2.5 pl-10 pr-10 text-sm outline-none transition-colors placeholder:text-gray-400 focus:ring-2 focus:ring-offset-0 dark:bg-gray-900 dark:text-white ${
                errors.password
                  ? 'border-red-300 focus:border-red-400 focus:ring-red-200 dark:border-red-700 dark:focus:ring-red-800'
                  : 'border-gray-300 focus:border-primary-500 focus:ring-primary-200 dark:border-gray-700 dark:focus:border-primary-400 dark:focus:ring-primary-800'
              }`}
              placeholder="••••••••"
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
        </div>

        <div className="flex items-center gap-2">
          <input
            id="remember"
            type="checkbox"
            className="h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500 dark:border-gray-600 dark:bg-gray-900"
          />
          <label htmlFor="remember" className="text-sm text-gray-600 dark:text-gray-400">
            Remember me
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
              Sign in <ArrowRight className="h-4 w-4" />
            </>
          )}
        </button>
      </form>
    </AuthLayout>
  );
}
