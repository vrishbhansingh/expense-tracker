import { Link } from 'react-router-dom';
import {
  ArrowRight, BarChart3, Shield, Smartphone, Zap, Globe, Check,
  TrendingUp, PieChart, Bell, CreditCard, Users, Star,
} from 'lucide-react';

const features = [
  { icon: BarChart3, title: 'Smart Analytics', desc: 'Beautiful charts and insights to understand your spending patterns at a glance.' },
  { icon: Smartphone, title: 'Cross-platform', desc: 'Works on web, iOS, and Android. Your data syncs instantly everywhere.' },
  { icon: Shield, title: 'Bank-grade Security', desc: '256-bit encryption and industry-standard security protect your data.' },
  { icon: Zap, title: 'Lightning Fast', desc: 'Add an expense in under 5 seconds. No friction, no learning curve.' },
  { icon: Globe, title: 'Multi-currency', desc: 'Travel the world and track expenses in any currency — automatically converted.' },
  { icon: Bell, title: 'Smart Alerts', desc: 'Get notified when you are approaching or exceeding your budget limits.' },
];

const testimonials = [
  { name: 'Sarah Chen', role: 'Freelance Designer', avatar: 'SC', rating: 5, text: 'I\'ve tried a dozen expense trackers. This is the first one that actually stuck. The analytics are gorgeous.' },
  { name: 'Marcus Johnson', role: 'Small Business Owner', avatar: 'MJ', rating: 5, text: 'Managing business expenses has never been easier. The multi-currency support is a lifesaver for international clients.' },
  { name: 'Priya Patel', role: 'Software Engineer', avatar: 'PP', rating: 5, text: 'The budget alerts alone have saved me hundreds. Finally an app that helps me save, not just track.' },
  { name: 'Alex Kim', role: 'Graduate Student', avatar: 'AK', rating: 4, text: 'Clean, intuitive, and free. The perfect tool for students who want to get their finances in order.' },
];

const plans = [
  {
    name: 'Free', price: '$0', period: 'forever', popular: false,
    perks: ['Unlimited transactions', '5 budget limits', 'Basic analytics', '30-day history', 'Web access'],
  },
  {
    name: 'Pro', price: '$8', period: '/month', popular: true,
    perks: ['Everything in Free', 'Unlimited budgets', 'Advanced analytics', 'Full history export', 'Priority support', 'Mobile apps'],
  },
  {
    name: 'Business', price: '$24', period: '/month', popular: false,
    perks: ['Everything in Pro', 'Team accounts (up to 10)', 'Custom categories', 'API access', 'Dedicated support', 'SLA guarantee'],
  },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* ─── Nav ─── */}
      <nav className="fixed inset-x-0 top-0 z-50 border-b border-gray-100 bg-white/90 backdrop-blur-lg">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-primary-600 to-purple-600">
              <span className="text-sm font-bold text-white">E</span>
            </div>
            <span className="text-lg font-bold text-gray-900">ExpenseTracker</span>
          </div>
          <div className="hidden items-center gap-8 sm:flex">
            <a href="#features" className="text-sm font-medium text-gray-600 hover:text-gray-900">Features</a>
            <a href="#testimonials" className="text-sm font-medium text-gray-600 hover:text-gray-900">Testimonials</a>
            <a href="#pricing" className="text-sm font-medium text-gray-600 hover:text-gray-900">Pricing</a>
          </div>
          <div className="flex items-center gap-3">
            <Link to="/login" className="text-sm font-medium text-gray-700 hover:text-primary-600">Sign in</Link>
            <Link to="/register" className="inline-flex items-center gap-1.5 rounded-lg bg-primary-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition-all hover:bg-primary-700 hover:shadow-md active:scale-[0.97]">
              Get started <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>
      </nav>

      {/* ─── Hero ─── */}
      <section className="relative overflow-hidden pt-24">
        <div className="absolute inset-0 -z-10 bg-gradient-to-b from-primary-50/60 via-white to-white" />
        <div className="absolute -left-40 -top-40 -z-10 h-[500px] w-[500px] rounded-full bg-primary-100/40 blur-3xl" />
        <div className="absolute -right-40 top-20 -z-10 h-[400px] w-[400px] rounded-full bg-purple-100/30 blur-3xl" />

        <div className="mx-auto max-w-7xl px-4 pb-16 pt-16 sm:px-6 lg:px-8 lg:pb-24 lg:pt-20">
          <div className="items-center gap-12 lg:flex">
            {/* Left */}
            <div className="max-w-2xl text-center lg:text-left">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-primary-200 bg-primary-50 px-3 py-1 text-xs font-semibold text-primary-700">
                <Zap className="h-3 w-3" /> Free forever — no credit card
              </span>
              <h1 className="mt-6 text-4xl font-extrabold leading-tight tracking-tight sm:text-5xl lg:text-6xl">
                Take control of{' '}
                <span className="bg-gradient-to-r from-primary-600 to-purple-600 bg-clip-text text-transparent">your money</span>
              </h1>
              <p className="mx-auto mt-5 max-w-xl text-lg leading-relaxed text-gray-600 lg:mx-0">
                Track every expense, set smart budgets, and visualize your spending patterns. 
                The simplest way to understand where your money goes — on web and mobile.
              </p>
              <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:gap-4 lg:justify-start">
                <Link
                  to="/register"
                  className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-primary-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-primary-200 transition-all hover:bg-primary-700 hover:shadow-xl hover:shadow-primary-200 active:scale-[0.97] sm:w-auto"
                >
                  Start tracking free <ArrowRight className="h-4 w-4" />
                </Link>
                <a
                  href="#features"
                  className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white px-6 py-3 text-sm font-semibold text-gray-700 shadow-sm transition-all hover:bg-gray-50 hover:shadow-md active:scale-[0.97] sm:w-auto"
                >
                  See features
                </a>
              </div>
            </div>

            {/* Right — mockup */}
            <div className="mt-12 hidden lg:block lg:flex-1">
              <div className="relative">
                <div className="aspect-[4/3] rounded-2xl bg-gradient-to-br from-gray-50 to-gray-100 shadow-2xl ring-1 ring-gray-200">
                  <div className="flex items-center gap-1.5 border-b border-gray-200 px-4 py-3">
                    <div className="h-2.5 w-2.5 rounded-full bg-red-400" />
                    <div className="h-2.5 w-2.5 rounded-full bg-amber-400" />
                    <div className="h-2.5 w-2.5 rounded-full bg-green-400" />
                    <span className="ml-2 text-xs font-medium text-gray-400">Dashboard</span>
                  </div>
                  <div className="p-4">
                    <div className="mb-4 flex gap-3">
                      <div className="flex-1 rounded-lg border border-gray-200 bg-white p-3">
                        <div className="text-xs text-gray-400">Today</div>
                        <div className="mt-1 text-lg font-bold text-gray-900">$0.00</div>
                        <div className="mt-0.5 text-xs text-green-500">No expenses yet</div>
                      </div>
                      <div className="flex-1 rounded-lg border border-gray-200 bg-white p-3">
                        <div className="text-xs text-gray-400">This Month</div>
                        <div className="mt-1 text-lg font-bold text-gray-900">$1,240</div>
                        <div className="mt-0.5 text-xs text-red-500">12% over budget</div>
                      </div>
                      <div className="flex-1 rounded-lg border border-gray-200 bg-white p-3">
                        <div className="text-xs text-gray-400">Saved</div>
                        <div className="mt-1 text-lg font-bold text-green-600">$340</div>
                        <div className="mt-0.5 text-xs text-green-500">+18% vs last month</div>
                      </div>
                    </div>
                    <div className="flex gap-3">
                      <div className="h-20 flex-1 rounded-lg bg-gradient-to-t from-primary-100 to-primary-50" />
                      <div className="h-20 flex-1 rounded-lg bg-gradient-to-t from-purple-100 to-purple-50" />
                      <div className="h-20 flex-1 rounded-lg bg-gradient-to-t from-emerald-100 to-emerald-50" />
                    </div>
                  </div>
                </div>
                <div className="absolute -bottom-4 -right-4 -z-10 h-full w-full rounded-2xl border border-gray-100 bg-gray-50/50" />
              </div>
            </div>
          </div>
        </div>

        {/* ─── Stats ─── */}
        <div className="border-y border-gray-100 bg-gray-50/50">
          <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 gap-8 text-center sm:grid-cols-4">
              {[
                { value: '10K+', label: 'Active users' },
                { value: '500K+', label: 'Expenses tracked' },
                { value: '4.9★', label: 'Average rating' },
                { value: '99.9%', label: 'Uptime' },
              ].map(({ value, label }) => (
                <div key={label}>
                  <div className="text-2xl font-bold text-gray-900 sm:text-3xl">{value}</div>
                  <div className="mt-1 text-sm text-gray-500">{label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ─── Features ─── */}
      <section id="features" className="py-20 sm:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-primary-200 bg-primary-50 px-3 py-1 text-xs font-semibold text-primary-700">
              <TrendingUp className="h-3 w-3" /> Features
            </span>
            <h2 className="mt-4 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              Everything you need to manage money
            </h2>
            <p className="mt-4 text-lg text-gray-600">
              Powerful features wrapped in a delightful experience. No clutter, no complexity.
            </p>
          </div>
          <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {features.map(({ icon: Icon, title, desc }) => (
              <div
                key={title}
                className="group rounded-xl border border-gray-100 bg-white p-6 shadow-sm transition-all hover:-translate-y-0.5 hover:border-primary-100 hover:shadow-md hover:shadow-primary-100/20"
              >
                <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-primary-50 text-primary-600 transition-colors group-hover:bg-primary-100">
                  <Icon className="h-5 w-5" />
                </div>
                <h3 className="mt-4 text-base font-semibold text-gray-900">{title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-gray-500">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Testimonials ─── */}
      <section id="testimonials" className="border-y border-gray-100 bg-gray-50/70 py-20 sm:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-primary-200 bg-primary-50 px-3 py-1 text-xs font-semibold text-primary-700">
              <Star className="h-3 w-3" /> Testimonials
            </span>
            <h2 className="mt-4 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              Loved by thousands
            </h2>
          </div>
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {testimonials.map(({ name, role, avatar, rating, text }) => (
              <div key={name} className="rounded-xl border border-gray-100 bg-white p-5 shadow-sm">
                <div className="flex items-center gap-2">
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-primary-500 to-purple-600 text-xs font-bold text-white">
                    {avatar}
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-gray-900">{name}</div>
                    <div className="text-xs text-gray-500">{role}</div>
                  </div>
                </div>
                <div className="mt-2 flex gap-0.5">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} className={`h-3.5 w-3.5 ${i < rating ? 'fill-amber-400 text-amber-400' : 'fill-gray-200 text-gray-200'}`} />
                  ))}
                </div>
                <p className="mt-3 text-sm leading-relaxed text-gray-600">{text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Pricing ─── */}
      <section id="pricing" className="py-20 sm:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-primary-200 bg-primary-50 px-3 py-1 text-xs font-semibold text-primary-700">
              <CreditCard className="h-3 w-3" /> Pricing
            </span>
            <h2 className="mt-4 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              Simple, transparent pricing
            </h2>
            <p className="mt-4 text-lg text-gray-600">Start free, upgrade when you need more.</p>
          </div>
          <div className="mt-12 grid gap-6 sm:grid-cols-3">
            {plans.map(({ name, price, period, popular, perks }) => (
              <div
                key={name}
                className={`relative rounded-xl border p-6 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md ${
                  popular
                    ? 'border-primary-200 bg-white ring-2 ring-primary-500/10 hover:shadow-primary-100/20'
                    : 'border-gray-100 bg-white'
                }`}
              >
                {popular && (
                  <span className="absolute -top-2.5 left-1/2 -translate-x-1/2 rounded-full bg-primary-600 px-3 py-0.5 text-xs font-semibold text-white shadow-sm">
                    Most popular
                  </span>
                )}
                <h3 className="text-base font-semibold text-gray-900">{name}</h3>
                <div className="mt-3">
                  <span className="text-4xl font-bold text-gray-900">{price}</span>
                  <span className="ml-1 text-sm text-gray-500">{period}</span>
                </div>
                <ul className="mt-6 space-y-3">
                  {perks.map((p) => (
                    <li key={p} className="flex items-center gap-2 text-sm text-gray-600">
                      <Check className="h-4 w-4 flex-shrink-0 text-green-500" />
                      {p}
                    </li>
                  ))}
                </ul>
                <Link
                  to="/register"
                  className={`mt-6 flex w-full items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-semibold transition-all ${
                    popular
                      ? 'bg-primary-600 text-white shadow-sm hover:bg-primary-700'
                      : 'border border-gray-200 bg-white text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  Get started <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── CTA ─── */}
      <section className="pb-20 sm:pb-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary-600 via-primary-700 to-purple-800 px-6 py-16 text-center shadow-2xl sm:px-16">
            <div className="absolute -left-20 -top-20 h-60 w-60 rounded-full bg-white/5 blur-3xl" />
            <div className="absolute -bottom-20 -right-20 h-60 w-60 rounded-full bg-purple-500/20 blur-3xl" />
            <div className="relative">
              <h2 className="text-3xl font-bold text-white sm:text-4xl">Ready to get started?</h2>
              <p className="mx-auto mt-4 max-w-lg text-lg text-primary-100">
                Join thousands of users who have taken control of their finances. It's free forever.
              </p>
              <Link
                to="/register"
                className="mt-8 inline-flex items-center gap-2 rounded-xl bg-white px-6 py-3 text-sm font-semibold text-primary-700 shadow-lg transition-all hover:bg-gray-50 hover:shadow-xl active:scale-[0.97]"
              >
                Create free account <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Footer ─── */}
      <footer className="border-t border-gray-100 bg-gray-50/50 py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center justify-between gap-8 sm:flex-row">
            <div className="flex items-center gap-2">
              <div className="flex h-7 w-7 items-center justify-center rounded bg-gradient-to-br from-primary-600 to-purple-600">
                <span className="text-xs font-bold text-white">E</span>
              </div>
              <span className="text-sm font-semibold text-gray-900">ExpenseTracker</span>
            </div>
            <div className="flex gap-6 text-sm text-gray-500">
              <a href="#features" className="hover:text-gray-700">Features</a>
              <a href="#testimonials" className="hover:text-gray-700">Testimonials</a>
              <a href="#pricing" className="hover:text-gray-700">Pricing</a>
              <span className="text-gray-300">|</span>
              <Link to="/login" className="hover:text-gray-700">Sign in</Link>
              <Link to="/register" className="hover:text-gray-700">Register</Link>
            </div>
          </div>
          <div className="mt-8 border-t border-gray-200 pt-6 text-center text-xs text-gray-400">
            &copy; {new Date().getFullYear()} ExpenseTracker. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
