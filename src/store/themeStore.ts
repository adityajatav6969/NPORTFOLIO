import { create } from 'zustand';

type Theme = 'dark' | 'light';

interface ThemeState {
  theme: Theme;
  accentColor: string;
  setTheme: (t: Theme) => void;
  setAccentColor: (c: string) => void;
  toggleTheme: () => void;
}

export const useThemeStore = create<ThemeState>((set) => ({
  theme: 'dark',
  accentColor: '#6366f1',
  setTheme: (t) => set({ theme: t }),
  setAccentColor: (c) => set({ accentColor: c }),
  toggleTheme: () =>
    set((s) => ({ theme: s.theme === 'dark' ? 'light' : 'dark' })),
}));
