import { useThemeStore } from '../store/themeStore';

export default function Header() {
  const { isDark, toggle } = useThemeStore();

  return (
    <header className="fixed top-0 right-0 w-[calc(100%-15rem)] z-40 backdrop-blur-xl flex justify-end items-center h-14 px-6 gap-6 shadow-sm"
      style={{ backgroundColor: isDark ? 'rgba(11, 14, 20, 0.8)' : 'rgba(245, 247, 250, 0.85)' }}
    >
      <div className="mr-auto">
        <h2 className="font-headline font-bold text-base text-on-surface">Intelligence Overview</h2>
      </div>
      <div className="flex items-center gap-4 text-[10px] text-on-surface-variant">
        <span className="hidden sm:inline">Last Updated: Oct 2025</span>
        <div className="h-3 w-[1px] bg-outline-variant hidden sm:block"></div>
        <div className="flex items-center gap-1">
          <button
            onClick={toggle}
            className="rounded-full p-1.5 cursor-pointer active:opacity-70 transition-all hover:bg-surface-container-high"
            title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          >
            <span className="material-symbols-outlined text-primary text-lg">
              {isDark ? 'light_mode' : 'dark_mode'}
            </span>
          </button>
          <button className="rounded-full p-1.5 cursor-pointer active:opacity-70 transition-opacity hover:bg-surface-container-high">
            <span className="material-symbols-outlined text-primary text-lg" data-icon="payments">
              payments
            </span>
          </button>
        </div>
      </div>
    </header>
  );
}
