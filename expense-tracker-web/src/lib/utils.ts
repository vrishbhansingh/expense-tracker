import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(amount: number, currency = 'USD') {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
  }).format(amount);
}

export function formatDate(date: string | Date, fmt = 'MMM dd, yyyy') {
  const d = typeof date === 'string' ? new Date(date) : date;
  return new Intl.DateTimeFormat('en-US', { dateStyle: 'medium' }).format(d);
}

const ICON_MAP: Record<string, string> = {
  restaurant: '🍽️',
  car: '🚗',
  shopping_bag: '🛍️',
  movie: '🎬',
  receipt: '🧾',
  medical: '🏥',
  school: '🎓',
  flight: '✈️',
  category: '📦',
  home: '🏠',
  work: '💼',
  gift: '🎁',
  pets: '🐾',
  sports: '⚽',
  cake: '🎂',
};

export function categoryIcon(name: string | undefined): string {
  return ICON_MAP[name || 'category'] || '📦';
}

export function hexToRgb(hex: string): string {
  hex = hex.replace('#', '');
  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);
  return `${r}, ${g}, ${b}`;
}
