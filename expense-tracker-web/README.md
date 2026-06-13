# Daily Expense Tracker - Web App

Modern, responsive web application for daily expense tracking. Built with **React 18**, **TypeScript**, **Vite**, **Tailwind CSS**, **Recharts**, and **TanStack Query**.

## Features

### Public
- 🎨 Beautiful landing page
- 🔐 Email/password authentication
- 🔑 Password reset

### Authenticated
- 📊 Interactive dashboard with daily/weekly/monthly summaries
- 💸 Full expense CRUD with filters, search, pagination
- 🏷️ Custom categories with icons & colors
- 💼 Budget management with threshold alerts
- 📈 Analytics with multiple chart types
- 📅 Calendar view
- 🌙 Dark mode
- 📤 CSV / PDF export
- 👤 User profile & settings
- 📱 Fully responsive (mobile, tablet, desktop)

## Tech Stack

- **React 18** with TypeScript
- **Vite** for build
- **Tailwind CSS** for styling
- **React Router** for navigation
- **TanStack Query** for server state
- **Zustand** for client state
- **React Hook Form + Zod** for validation
- **Recharts** for analytics
- **Radix UI** for accessible primitives
- **Lucide React** for icons
- **Framer Motion** for animations
- **jsPDF** for PDF export
- **PapaParse** for CSV export

## Setup

```bash
npm install
cp .env.example .env
npm run dev
```

App runs on http://localhost:5173

## Build for production

```bash
npm run build
npm run preview
```

## Project Structure

```
src/
├── components/      # Reusable UI
│   ├── ui/          # Base components (Button, Input, Card...)
│   ├── layout/      # AppShell, Sidebar, Topbar
│   └── charts/      # Recharts wrappers
├── pages/           # Route pages
│   ├── auth/        # Login, Register, ForgotPassword
│   ├── dashboard/
│   ├── expenses/
│   ├── budgets/
│   ├── categories/
│   ├── analytics/
│   └── settings/
├── lib/             # API client, utils
├── hooks/           # Custom hooks
├── store/           # Zustand stores
├── types/           # TypeScript types
└── App.tsx
```

## Configure API

Edit `.env`:

```
VITE_API_URL=http://localhost:8000/api
```

This should match your Laravel backend URL.
