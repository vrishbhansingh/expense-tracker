# Daily Expense Tracker — Complete System

A full-featured daily expense tracking system with three components:

| Component | Tech | Location |
|-----------|------|----------|
| **Backend API** | Laravel 10 + Sanctum | `expense-tracker-laravel/` |
| **Mobile App** | Flutter 3 (Provider, Hive, fl_chart) | `expense-tracker-flutter/` |
| **Web App** | React 18 + Vite + Tailwind | `expense-tracker-web/` |

## Features (all three)

- 🔐 Email/password auth with token (Sanctum)
- 📝 Full expense CRUD with categories, tags, location, payment method
- 🏷️ Custom categories with icons & colors
- 💼 Budgets (daily/weekly/monthly/yearly) with threshold alerts
- 📊 Daily / monthly / yearly / category-breakdown analytics
- 📅 Calendar view, search, filters, pagination
- 📤 CSV & PDF export
- 🌙 Dark mode (web + mobile)
- 📱 Responsive (web) & multi-platform (mobile: iOS / Android / web)
- 💱 Multi-currency
- 🔒 Biometric login (mobile)
- 🔁 Recurring expenses
- 📷 Receipt attachments (mobile)
- 🔔 Local notifications (mobile)

## Quick Start

### 1. Backend (Laravel)

```bash
cd expense-tracker-laravel
composer install
cp .env.example .env
php artisan key:generate
# Configure DB in .env (MySQL: create db `expense_tracker`)
php artisan migrate --seed
php artisan serve            # http://localhost:8000
```

API base URL: `http://localhost:8000/api`

### 2. Web App (React + Tailwind)

```bash
cd expense-tracker-web
npm install
cp .env.example .env
# Confirm VITE_API_URL=http://localhost:8000/api
npm run dev                  # http://localhost:5173
```

### 3. Mobile App (Flutter)

```bash
cd expense-tracker-flutter
flutter pub get
# Update lib/core/constants/app_constants.dart:
#   apiBaseUrl = 'http://10.0.2.2:8000/api' (Android emulator)
#   or 'http://localhost:8000/api' (iOS simulator)
flutter run
```

## Architecture

```
┌──────────────┐         ┌──────────────┐
│ Flutter App  │ ──────▶ │              │
└──────────────┘         │              │
                         │  Laravel API │ ─── MySQL
┌──────────────┐         │   (Sanctum)  │
│  React Web   │ ──────▶ │              │
└──────────────┘         └──────────────┘
```

All three clients consume the same REST API.

## API Endpoints (summary)

- `POST /api/register` • `POST /api/login` • `POST /api/logout`
- `GET /api/user` • `PUT /api/user/profile` • `PUT /api/user/password`
- `GET/POST/PUT/DELETE /api/expenses` • `POST /api/expenses/bulk-delete`
- `GET/POST/PUT/DELETE /api/categories`
- `GET/POST/PUT/DELETE /api/budgets`
- `GET /api/analytics/{daily|monthly|yearly|category-breakdown|trends}`
- `GET /api/export/csv`

See `expense-tracker-laravel/README.md` for full API docs.

## Database

Six tables:
- `users` (with avatar, currency, timezone)
- `categories` (global defaults + per-user custom)
- `expenses` (with soft delete, tags, location, recurring flag)
- `budgets` (with period, threshold, category scope)
- `recurring_expenses` (auto-generation rules)
- `attachments` (receipts)

## Default Categories

Seeded globally: Food, Transportation, Shopping, Entertainment, Bills, Healthcare, Education, Travel, Other.
On registration, every user gets these 9 categories.

## Build & Deploy

### Web
```bash
cd expense-tracker-web && npm run build
# Deploy dist/ to Vercel / Netlify / Nginx
```

### Mobile
```bash
cd expense-tracker-flutter
flutter build apk --release           # Android
flutter build ipa --release           # iOS
flutter build web --release           # Web
```

### Backend
- Set `APP_DEBUG=false` and a strong `APP_KEY`
- Configure production DB
- Run `php artisan config:cache && php artisan route:cache`
- Serve with Nginx + PHP-FPM

## License

MIT
