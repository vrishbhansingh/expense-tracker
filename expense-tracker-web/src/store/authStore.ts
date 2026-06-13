import { create } from 'zustand';
import { api } from '@/lib/api';
import toast from 'react-hot-toast';
import { useThemeStore } from '@/store/themeStore';

export interface User {
  id: number;
  name: string;
  email: string;
  avatar?: string;
  currency: string;
  timezone: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  loading: boolean;
  hydrate: () => void;
  login: (email: string, password: string) => Promise<boolean>;
  register: (name: string, email: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
  updateUser: (u: Partial<User>) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: null,
  loading: false,

  hydrate: () => {
    const token = localStorage.getItem('token');
    const userStr = localStorage.getItem('user');
    if (token && userStr) {
      set({ token, user: JSON.parse(userStr) });
    }
  },

  login: async (email, password) => {
    set({ loading: true });
    try {
      const { data } = await api.post('/login', { email, password });
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      set({ token: data.token, user: data.user, loading: false });
      toast.success('Welcome back!');
      return true;
    } catch (err: any) {
      set({ loading: false });
      toast.error(err.response?.data?.message || 'Login failed');
      return false;
    }
  },

  register: async (name, email, password) => {
    set({ loading: true });
    try {
      const { data } = await api.post('/register', {
        name, email, password, password_confirmation: password,
      });
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      set({ token: data.token, user: data.user, loading: false });
      toast.success('Account created!');
      return true;
    } catch (err: any) {
      set({ loading: false });
      toast.error(err.response?.data?.message || 'Registration failed');
      return false;
    }
  },

  logout: async () => {
    try { await api.post('/logout'); } catch {}
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    useThemeStore.getState().resetTheme();
    set({ user: null, token: null });
    toast.success('Logged out');
  },

  updateUser: (u) => set((state) => {
    const user = state.user ? { ...state.user, ...u } : null;
    if (user) localStorage.setItem('user', JSON.stringify(user));
    return { user };
  }),
}));
