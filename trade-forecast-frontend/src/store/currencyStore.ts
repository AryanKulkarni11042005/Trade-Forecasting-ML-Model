import { create } from 'zustand';

export type CurrencyMode = 'INR' | 'USD';

interface CurrencyStore {
  mode: CurrencyMode;
  usdInrRate: number;
  toggleCurrency: () => void;
  setRate: (rate: number) => void;
}

export const useCurrencyStore = create<CurrencyStore>((set) => {
  const stored = typeof window !== 'undefined' ? localStorage.getItem('currency') : null;
  const initialMode: CurrencyMode = stored === 'USD' ? 'USD' : 'INR';

  return {
    mode: initialMode,
    usdInrRate: 88.0, // default, overwritten by backend
    toggleCurrency: () =>
      set((state) => {
        const next: CurrencyMode = state.mode === 'INR' ? 'USD' : 'INR';
        localStorage.setItem('currency', next);
        return { mode: next };
      }),
    setRate: (rate: number) => set({ usdInrRate: rate }),
  };
});

/**
 * Format a raw value (assumed INR) as a string in the chosen currency.
 * Backend values for trade_deficit, imports etc. are in raw INR.
 * oil_price is already in USD. usd_inr is a rate.
 *
 * Use `isAlreadyUsd` for values that are natively USD (oil_price).
 * Use `isRate` for the USD/INR exchange rate itself.
 */
export function formatCurrencyValue(
  rawValue: number,
  mode: CurrencyMode,
  usdInrRate: number,
  options?: { isAlreadyUsd?: boolean; isRate?: boolean; compact?: boolean }
): string {
  const { isAlreadyUsd = false, isRate = false, compact = false } = options ?? {};

  // Special case: exchange rate is just a number
  if (isRate) {
    return mode === 'INR'
      ? `₹ ${rawValue.toFixed(2)}`
      : `${rawValue.toFixed(2)}`;
  }

  // For oil_price (already in USD)
  if (isAlreadyUsd) {
    if (mode === 'USD') {
      return `USD ${rawValue.toFixed(2)}`;
    }
    // Convert USD → INR
    const inr = rawValue * usdInrRate;
    return `₹ ${numberWithCommas(inr.toFixed(2))}`;
  }

  // Default: raw value is in INR (raw units, not billions)
  if (mode === 'INR') {
    const billions = rawValue / 1e9;
    if (compact && Math.abs(billions) < 0.1) {
      const millions = rawValue / 1e6;
      return `₹ ${numberWithCommas(millions.toFixed(1))} M`;
    }
    return `₹ ${numberWithCommas(billions.toFixed(1))} B`;
  }

  // Convert INR → USD
  const usdRaw = rawValue / usdInrRate;
  const billions = usdRaw / 1e9;
  if (compact && Math.abs(billions) < 0.1) {
    const millions = usdRaw / 1e6;
    return `USD ${numberWithCommas(millions.toFixed(2))} M`;
  }
  return `USD ${numberWithCommas(billions.toFixed(2))} B`;
}

function numberWithCommas(x: string): string {
  const parts = x.split('.');
  parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  return parts.join('.');
}
