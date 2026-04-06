import { create } from 'zustand';

interface ThemeStore {
  isDark: boolean;
  toggle: () => void;
}

export const useThemeStore = create<ThemeStore>((set) => {
  // Initialize from localStorage or default dark
  const stored = typeof window !== 'undefined' ? localStorage.getItem('theme') : null;
  const initialDark = stored ? stored === 'dark' : true;

  // Set initial class
  if (typeof document !== 'undefined') {
    if (initialDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }

  return {
    isDark: initialDark,
    toggle: () =>
      set((state) => {
        const next = !state.isDark;
        if (next) {
          document.documentElement.classList.add('dark');
        } else {
          document.documentElement.classList.remove('dark');
        }
        localStorage.setItem('theme', next ? 'dark' : 'light');
        return { isDark: next };
      }),
  };
});
