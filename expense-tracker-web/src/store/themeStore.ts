import { create } from 'zustand';

type Theme = 'light' | 'dark';

interface ThemeState {
  theme: Theme;
  toggle: () => void;
  setTheme: (t: Theme) => void;
  hydrate: () => void;
  resetTheme: () => void;
}

const stored = (localStorage.getItem('theme') as Theme) || 'light';

export const useThemeStore = create<ThemeState>((set) => ({
  theme: stored,
  toggle: () => set((s) => {
    const next = s.theme === 'dark' ? 'light' : 'dark';
    localStorage.setItem('theme', next);
    return { theme: next };
  }),
  setTheme: (t) => {
    localStorage.setItem('theme', t);
    set({ theme: t });
  },
  hydrate: () => {
    const t = (localStorage.getItem('theme') as Theme) || 'light';
    set({ theme: t });
  },
  resetTheme: () => {
    localStorage.removeItem('theme');
    document.documentElement.classList.remove('dark');
    set({ theme: 'light' });
  },
}));
