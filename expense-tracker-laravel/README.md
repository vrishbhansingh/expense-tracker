# Daily Expense Tracker - Laravel Backend API

A complete RESTful API backend for the Daily Expense Tracker system built with Laravel 10 and Sanctum authentication.

## Features

- JWT/Sanctum token-based authentication
- CRUD operations for expenses
- Category management
- Budget tracking
- Recurring expenses
- Multi-currency support
- Statistics & analytics endpoints
- Export data (CSV/PDF)
- File attachments (receipts)
- User profile management
- Email notifications

## Installation

```bash
# Install dependencies
composer install

# Copy environment file
cp .env.example .env

# Generate application key
php artisan key:generate

# Run migrations
php artisan migrate

# Seed database with default categories
php artisan db:seed --class=CategorySeeder

# Start development server
php artisan serve
```

## API Endpoints

### Authentication
- `POST /api/register` - Register new user
- `POST /api/login` - Login
- `POST /api/logout` - Logout (auth required)
- `POST /api/forgot-password` - Request password reset
- `POST /api/reset-password` - Reset password

### User Profile
- `GET /api/user` - Get authenticated user
- `PUT /api/user/profile` - Update profile
- `PUT /api/user/password` - Update password
- `POST /api/user/avatar` - Upload avatar

### Expenses
- `GET /api/expenses` - List expenses (with filters)
- `POST /api/expenses` - Create expense
- `GET /api/expenses/{id}` - Show expense
- `PUT /api/expenses/{id}` - Update expense
- `DELETE /api/expenses/{id}` - Delete expense
- `POST /api/expenses/bulk-delete` - Bulk delete

### Categories
- `GET /api/categories` - List categories
- `POST /api/categories` - Create category
- `PUT /api/categories/{id}` - Update category
- `DELETE /api/categories/{id}` - Delete category

### Budgets
- `GET /api/budgets` - List budgets
- `POST /api/budgets` - Create budget
- `PUT /api/budgets/{id}` - Update budget
- `DELETE /api/budgets/{id}` - Delete budget

### Analytics
- `GET /api/analytics/daily` - Daily stats
- `GET /api/analytics/monthly` - Monthly stats
- `GET /api/analytics/yearly` - Yearly stats
- `GET /api/analytics/category-breakdown` - Category breakdown
- `GET /api/analytics/trends` - Spending trends

### Export
- `GET /api/export/csv` - Export as CSV
- `GET /api/export/pdf` - Export as PDF

## Database Schema

- `users` - User accounts
- `expenses` - Expense records
- `categories` - Expense categories
- `budgets` - Budget limits
- `recurring_expenses` - Recurring expense rules
- `attachments` - Receipt attachments

## Tech Stack

- Laravel 10
- Sanctum for auth
- MySQL database
- Spatie packages for analytics
