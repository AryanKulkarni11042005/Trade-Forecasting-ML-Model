import { useEffect, useState } from 'react';
import { useThemeStore } from '../store/themeStore';
import { useCurrencyStore } from '../store/currencyStore';
import { getDashboardData } from '../services/api';

export default function Header() {
  const { isDark, toggle } = useThemeStore();
  const { mode, toggleCurrency, setRate } = useCurrencyStore();
  const [lastUpdated, setLastUpdated] = useState<string>('—');

  useEffect(() => {
    getDashboardData()
      .then((data) => {
        const d = new Date(data.last_updated);
        setLastUpdated(d.toLocaleDateString('en-US', { month: 'short', year: 'numeric' }));
        if (data.usd_inr) setRate(data.usd_inr);
      })
      .catch(() => {
        setLastUpdated('—');
      });
  }, [setRate]);

  return (
    <header className="fixed top-0 right-0 w-[calc(100%-15rem)] z-40 backdrop-blur-xl flex justify-end items-center h-14 px-6 gap-6 shadow-sm"
      style={{ backgroundColor: isDark ? 'rgba(11, 14, 20, 0.8)' : 'rgba(245, 247, 250, 0.85)' }}
    >
      <div className="mr-auto">
        <h2 className="font-headline font-bold text-base text-on-surface">Intelligence Overview</h2>
      </div>
      <div className="flex items-center gap-4 text-[10px] text-on-surface-variant">
        <span className="hidden sm:inline">Last Updated: {lastUpdated}</span>
        <div className="h-3 w-[1px] bg-outline-variant hidden sm:block" />
        <div className="flex items-center gap-1">
          {/* Currency Toggle */}
          <button
            onClick={toggleCurrency}
            id="header-currency"
            className="rounded-full px-2.5 py-1 cursor-pointer active:opacity-70 transition-all hover:bg-surface-container-high flex items-center gap-1.5 border border-outline-variant/20"
            title={`Switch to ${mode === 'INR' ? 'USD' : 'INR'}`}
          >
            <span className="material-symbols-outlined text-primary text-sm">
              currency_exchange
            </span>
            <span className="text-[10px] font-bold text-primary uppercase tracking-wider">{mode}</span>
          </button>
          {/* Theme Toggle */}
          <button
            onClick={toggle}
            id="header-theme"
            className="rounded-full p-1.5 cursor-pointer active:opacity-70 transition-all hover:bg-surface-container-high"
            title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          >
            <span className="material-symbols-outlined text-primary text-lg">
              {isDark ? 'light_mode' : 'dark_mode'}
            </span>
          </button>
        </div>
      </div>
    </header>
  );
}
