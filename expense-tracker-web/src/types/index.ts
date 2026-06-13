export interface Expense {
  id: number;
  user_id: number;
  category_id: number;
  amount: number;
  currency: string;
  description: string;
  notes?: string;
  expense_date: string;
  payment_method: string;
  location?: string;
  tags: string[];
  is_recurring: boolean;
  category?: Category;
  created_at: string;
  updated_at: string;
}

export interface Category {
  id: number;
  user_id?: number;
  name: string;
  icon: string;
  color: string;
  is_default: boolean;
}

export interface Budget {
  id: number;
  user_id: number;
  category_id?: number;
  name: string;
  amount: number;
  currency: string;
  period: 'daily' | 'weekly' | 'monthly' | 'yearly';
  start_date: string;
  end_date?: string;
  alert_threshold: number;
  is_active: boolean;
  category?: Category;
}

export interface Analytics {
  date?: string;
  month?: string;
  year?: number;
  total: number;
  by_category?: { category_id: number; total: number; category: Category }[];
  daily?: { date: string; total: number }[];
  monthly?: { month: number; total: number }[];
  breakdown?: {
    category_id: number;
    total: number;
    count: number;
    average: number;
    category: Category;
    percentage: number;
  }[];
  average_per_day?: number;
  average_per_month?: number;
}
