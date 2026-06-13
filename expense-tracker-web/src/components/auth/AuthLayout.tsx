import { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { TrendingUp, Shield, Zap, BarChart3 } from 'lucide-react';

interface AuthLayoutProps {
  children: ReactNode;
  title: string;
  subtitle: string;
  alternateLink: string;
  alternateText: string;
  alternateLabel: string;
}

const features = [
  { icon: TrendingUp, text: 'Track every expense in real-time' },
  { icon: BarChart3, text: 'Beautiful analytics and insights' },
  { icon: Shield, text: 'Bank-grade data encryption' },
  { icon: Zap, text: 'Add an expense in 5 seconds' },
];

export default function AuthLayout({
  children, title, subtitle, alternateLink, alternateText, alternateLabel,
}: AuthLayoutProps) {
  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Brand Side — hidden on mobile */}
      <div className="hidden flex-1 flex-col justify-between bg-gradient-to-br from-primary-600 via-primary-700 to-purple-800 p-10 lg:flex lg:max-w-[45%]">
        <div>
          <Link to="/" className="inline-flex items-center gap-2.5">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/20 backdrop-blur">
              <span className="text-lg font-bold text-white">E</span>
            </div>
            <span className="text-lg font-bold text-white">ExpenseTracker</span>
          </Link>
        </div>

        <div className="space-y-8">
          <div>
            <h2 className="text-3xl font-bold leading-tight text-white sm:text-4xl">
              Take control of<br />
              <span className="text-primary-200">your finances</span>
            </h2>
            <p className="mt-3 text-base text-primary-100">
              Track spending, set budgets, and reach your financial goals — all in one place.
            </p>
          </div>

          <div className="space-y-4">
            {features.map(({ icon: Icon, text }) => (
              <div key={text} className="flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/10">
                  <Icon className="h-4 w-4 text-white" />
                </div>
                <span className="text-sm text-primary-100">{text}</span>
              </div>
            ))}
          </div>
        </div>

        <div>
          <p className="text-xs text-primary-200">
            © {new Date().getFullYear()} ExpenseTracker. All rights reserved.
          </p>
        </div>
      </div>

      {/* Form Side */}
      <div className="flex flex-1 items-center justify-center bg-white px-4 py-12 sm:px-6 lg:px-10 dark:bg-gray-900">
        <div className="w-full max-w-sm">
          {/* Mobile logo + brand */}
          <div className="mb-8 text-center lg:hidden">
            <Link to="/" className="inline-flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-primary-500 to-primary-700">
                <span className="text-base font-bold text-white">E</span>
              </div>
              <span className="text-base font-bold text-gray-900 dark:text-white">ExpenseTracker</span>
            </Link>
          </div>

          <div className="mb-6 text-center lg:text-left">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white sm:text-3xl">{title}</h1>
            <p className="mt-1.5 text-sm text-gray-500 dark:text-gray-400">{subtitle}</p>
          </div>

          <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
            {children}
          </div>

          <p className="mt-6 text-center text-sm text-gray-500 dark:text-gray-400">
            {alternateText}{' '}
            <Link to={alternateLink} className="font-semibold text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300">
              {alternateLabel}
            </Link>
          </p>

          {/* Trust badge */}
          <div className="mt-6 flex items-center justify-center gap-4 text-xs text-gray-400 dark:text-gray-500">
            <span className="inline-flex items-center gap-1">
              <Shield className="h-3 w-3" /> Encrypted
            </span>
            <span>·</span>
            <span>Secured with SSL</span>
            <span>·</span>
            <span>GDPR Compliant</span>
          </div>
        </div>
      </div>
    </div>
  );
}
