import { useEffect, useState, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { getHistoricalData } from '../services/api';
import type { HistoricalRecord } from '../services/api';
import { useCurrencyStore, formatCurrencyValue } from '../store/currencyStore';

type VariableKey = 'trade_deficit' | 'total_imports' | 'total_exports' | 'oil_price' | 'usd_inr';

const VARIABLE_OPTIONS: { key: VariableKey; label: string }[] = [
  { key: 'trade_deficit', label: 'Trade Deficit' },
  { key: 'total_imports', label: 'Imports (Key)' },
  { key: 'total_exports', label: 'Exports (Key)' },
  { key: 'oil_price', label: 'Oil Price' },
  { key: 'usd_inr', label: 'USD/INR' },
];

const ITEMS_PER_PAGE = 15;

function formatDate(dateStr: string): string {
  const d = new Date(dateStr);
  return d.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
}

/** Compute total imports from per-country fields */
function computeTotalImports(r: HistoricalRecord): number {
  return (r.imports_china ?? 0) + (r.imports_usa ?? 0) + (r.imports_russia ?? 0);
}

/** Compute total exports from per-country fields */
function computeTotalExports(r: HistoricalRecord): number {
  return (r.exports_china ?? 0) + (r.exports_usa ?? 0) + (r.exports_russia ?? 0);
}

/** Get a chart-ready value for a variable. For imports/exports, compute from per-country. */
function getVariableValue(r: HistoricalRecord, key: VariableKey): number {
  switch (key) {
    case 'total_imports':
      return r.total_imports ?? computeTotalImports(r);
    case 'total_exports':
      return r.total_exports ?? computeTotalExports(r);
    case 'oil_price':
      return r.oil_price;
    case 'usd_inr':
      return r.usd_inr;
    case 'trade_deficit':
    default:
      return r.trade_deficit;
  }
}

function SkeletonTable() {
  return (
    <div className="flex-1 flex flex-col gap-6 overflow-hidden animate-pulse">
      <div className="shrink-0">
        <div className="w-40 h-7 rounded bg-surface-container-highest mb-2" />
        <div className="w-72 h-4 rounded bg-surface-container-highest" />
      </div>
      <div className="bg-surface-container-high rounded-lg p-6 h-[220px]" />
      <div className="bg-surface-container-high rounded-lg flex-1 p-4">
        {[0, 1, 2, 3, 4].map((i) => (
          <div key={i} className="flex gap-4 py-3 border-b border-outline-variant/5">
            <div className="w-20 h-4 rounded bg-surface-container-highest" />
            <div className="w-16 h-4 rounded bg-surface-container-highest" />
            <div className="w-16 h-4 rounded bg-surface-container-highest" />
            <div className="w-16 h-4 rounded bg-surface-container-highest" />
            <div className="w-16 h-4 rounded bg-surface-container-highest" />
            <div className="w-20 h-4 rounded bg-surface-container-highest" />
          </div>
        ))}
      </div>
    </div>
  );
}

function ErrorCard({ onRetry }: { onRetry: () => void }) {
  return (
    <div className="neumorphic-elevated rounded-xl p-8 flex flex-col items-center justify-center gap-4 flex-1">
      <span className="material-symbols-outlined text-error text-4xl">cloud_off</span>
      <p className="text-on-surface-variant text-sm font-medium">Unable to load data</p>
      <button onClick={onRetry}
        className="px-6 py-2 bg-primary/10 hover:bg-primary/20 text-primary text-xs font-bold uppercase tracking-wider rounded-lg transition-colors border border-primary/20 cursor-pointer"
      >Retry</button>
    </div>
  );
}

export default function Explorer() {
  const [data, setData] = useState<HistoricalRecord[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [selectedVar, setSelectedVar] = useState<VariableKey>('trade_deficit');
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const { mode, usdInrRate } = useCurrencyStore();

  const fmt = useCallback(
    (val: number, opts?: { isAlreadyUsd?: boolean }) =>
      formatCurrencyValue(val, mode, usdInrRate, opts),
    [mode, usdInrRate]
  );

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(false);
    try {
      const res = await getHistoricalData();
      setData(res);
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  const filteredData = useMemo(() => {
    if (!data) return [];
    let items = [...data].reverse(); // newest first
    if (search) {
      const q = search.toLowerCase();
      items = items.filter((r) => r.date.toLowerCase().includes(q));
    }
    return items;
  }, [data, search]);

  const totalPages = Math.max(1, Math.ceil(filteredData.length / ITEMS_PER_PAGE));
  const pagedData = filteredData.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);

  const chartData = useMemo(() => {
    if (!data) return [];
    return data.map((r) => {
      const raw = getVariableValue(r, selectedVar);
      // For oil_price and usd_inr, use raw value; for others divide by 1B for chart readability
      const value = (selectedVar === 'oil_price' || selectedVar === 'usd_inr') ? raw : raw / 1e9;
      return { date: formatDate(r.date), value };
    });
  }, [data, selectedVar]);

  const handleExportCSV = () => {
    if (!data || data.length === 0) return;
    const headers = ['Date', 'Imports Key (B)', 'Exports Key (B)', 'Oil Price', 'USD/INR', 'Deficit (B)'];
    const rows = data.map((r) => [
      r.date,
      ((r.total_imports ?? computeTotalImports(r)) / 1e9).toFixed(2),
      ((r.total_exports ?? computeTotalExports(r)) / 1e9).toFixed(2),
      r.oil_price.toFixed(2),
      r.usd_inr.toFixed(2),
      (r.trade_deficit / 1e9).toFixed(2),
    ]);
    const csv = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'trade_data_export.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  if (loading) return <SkeletonTable />;
  if (error) return <ErrorCard onRetry={fetchData} />;

  const varLabel = VARIABLE_OPTIONS.find((v) => v.key === selectedVar)?.label || selectedVar;
  const dateRange = data && data.length > 0
    ? `${formatDate(data[0].date)} - ${formatDate(data[data.length - 1].date)}`
    : '';

  return (
    <AnimatePresence>
      <div className="flex-1 flex flex-col gap-6 overflow-hidden">
        {/* Header & Top Filter Bar */}
        <motion.section initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}
          className="shrink-0"
        >
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <h2 className="text-2xl font-bold font-headline mb-1 text-on-surface">Data Explorer</h2>
              <p className="text-on-surface-variant text-xs font-label">Granular economic time-series analysis and raw data extraction.</p>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <div className="bg-surface-container-low px-4 py-2 rounded-full flex items-center gap-3 neumorphic-recessed">
                <span className="material-symbols-outlined text-on-surface-variant text-sm" data-icon="calendar_today">calendar_today</span>
                <span className="text-xs font-medium text-on-surface">{dateRange}</span>
              </div>
            </div>
          </div>
          {/* Variable Filter Chips */}
          <div className="flex flex-wrap gap-2 mt-4">
            {VARIABLE_OPTIONS.map((v) => (
              <button key={v.key}
                onClick={() => { setSelectedVar(v.key); setPage(1); }}
                className={`px-4 py-1.5 rounded-full text-[10px] font-bold transition-all cursor-pointer ${
                  selectedVar === v.key
                    ? 'bg-primary-container text-on-primary-container shadow-lg shadow-primary/20 flex items-center gap-2'
                    : 'bg-surface-container-high text-on-surface-variant hover:text-on-surface hover:bg-surface-container-highest'
                }`}
              >
                {selectedVar === v.key && (
                  <span className="material-symbols-outlined text-xs" data-icon="check_circle" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
                )}
                {v.label}
              </button>
            ))}
          </div>
        </motion.section>

        {/* Interactive Preview Chart */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.1 }}
          className="p-6 bg-surface-container-high rounded-lg shadow-2xl relative overflow-hidden group shrink-0 h-[220px] flex flex-col"
        >
          <div className="absolute -right-20 -top-20 w-80 h-80 bg-primary/5 rounded-full blur-[100px]" />
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-xl">
                <span className="material-symbols-outlined text-primary text-xl" data-icon="show_chart">show_chart</span>
              </div>
              <div>
                <h3 className="text-sm font-bold font-headline">Time-Series Preview</h3>
                <p className="text-[10px] text-on-surface-variant font-label">Visualizing {varLabel}{selectedVar !== 'oil_price' && selectedVar !== 'usd_inr' ? ' (Billions)' : ''}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded bg-tertiary/10 text-tertiary text-[9px] font-bold">LIVE SYNC</span>
            </div>
          </div>
          <div className="flex-1 min-h-0">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData} margin={{ top: 5, right: 10, bottom: 5, left: 0 }}>
                <defs>
                  <linearGradient id="explorerFill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--color-primary)" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="var(--color-primary)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-outline-variant)" opacity={0.15} />
                <XAxis dataKey="date" tick={{ fontSize: 9, fill: 'var(--color-on-surface-variant)' }} interval={Math.max(1, Math.floor(chartData.length / 10))} />
                <YAxis tick={{ fontSize: 9, fill: 'var(--color-on-surface-variant)' }} width={50} />
                <Tooltip contentStyle={{ background: 'var(--color-surface-container-highest)', border: '1px solid var(--color-outline-variant)', borderRadius: '8px', fontSize: '11px' }} />
                <Area type="monotone" dataKey="value" stroke="var(--color-primary)" fill="url(#explorerFill)" strokeWidth={2} animationDuration={800} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Data Table */}
        <motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.2 }}
          className="bg-surface-container-high rounded-lg shadow-2xl overflow-hidden flex flex-col flex-1 min-h-0"
        >
          {/* Table Toolbar */}
          <div className="p-4 flex flex-col md:flex-row md:items-center justify-between gap-4 shrink-0">
            <div className="relative max-w-xs w-full">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-lg" data-icon="search">search</span>
              <input
                className="w-full bg-surface-container-low border-none rounded-full py-1.5 pl-10 pr-4 text-xs focus:ring-1 focus:ring-primary/40 neumorphic-recessed placeholder:text-on-surface-variant/50 text-on-surface"
                placeholder="Search by date..."
                type="text"
                value={search}
                onChange={(e) => { setSearch(e.target.value); setPage(1); }}
              />
            </div>
            <button onClick={handleExportCSV}
              className="bg-primary-container text-on-primary-container px-4 py-2 rounded-full text-xs font-bold flex items-center gap-2 transition-transform active:scale-95 shadow-lg shadow-primary/10 cursor-pointer"
            >
              <span className="material-symbols-outlined text-sm" data-icon="download">download</span>
              Export CSV
            </button>
          </div>

          {/* Table */}
          <div className="flex-1 overflow-y-auto">
            <table className="w-full text-left border-collapse">
              <thead className="sticky top-0 bg-surface-container-high z-10">
                <tr className="bg-surface-container-highest/50">
                  <th className="px-6 py-3 text-[10px] font-bold text-on-surface-variant uppercase tracking-widest border-b border-outline-variant/10">Date</th>
                  <th className="px-4 py-3 text-[10px] font-bold text-on-surface-variant uppercase tracking-widest border-b border-outline-variant/10">Imports (Key)</th>
                  <th className="px-4 py-3 text-[10px] font-bold text-on-surface-variant uppercase tracking-widest border-b border-outline-variant/10">Exports (Key)</th>
                  <th className="px-4 py-3 text-[10px] font-bold text-on-surface-variant uppercase tracking-widest border-b border-outline-variant/10">Oil Price</th>
                  <th className="px-4 py-3 text-[10px] font-bold text-on-surface-variant uppercase tracking-widest border-b border-outline-variant/10">USD/INR</th>
                  <th className="px-4 py-3 text-[10px] font-bold text-on-surface-variant uppercase tracking-widest border-b border-outline-variant/10">Deficit</th>
                  <th className="px-6 py-3 text-right border-b border-outline-variant/10" />
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant/5">
                {pagedData.map((row, i) => {
                  const totalImp = row.total_imports ?? computeTotalImports(row);
                  const totalExp = row.total_exports ?? computeTotalExports(row);
                  return (
                    <motion.tr key={row.date}
                      initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                      transition={{ delay: i * 0.03, duration: 0.3 }}
                      className="hover:bg-white/5 transition-colors group"
                    >
                      <td className="px-6 py-3 text-xs font-medium">{formatDate(row.date)}</td>
                      <td className="px-4 py-3 text-xs text-on-surface-variant">{fmt(totalImp)}</td>
                      <td className="px-4 py-3 text-xs text-on-surface-variant">{fmt(totalExp)}</td>
                      <td className="px-4 py-3 text-xs text-on-surface-variant">{fmt(row.oil_price, { isAlreadyUsd: true })}</td>
                      <td className="px-4 py-3 text-xs text-on-surface-variant">{row.usd_inr.toFixed(2)}</td>
                      <td className="px-4 py-3">
                        <span className="px-2 py-0.5 rounded-full bg-error-container/20 text-error-dim text-[10px] font-bold">
                          {fmt(row.trade_deficit)}
                        </span>
                      </td>
                      <td className="px-6 py-3 text-right">
                        <span className="material-symbols-outlined text-on-surface-variant opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer text-sm" data-icon="more_vert">more_vert</span>
                      </td>
                    </motion.tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Footer */}
          <div className="px-6 py-3 border-t border-outline-variant/10 flex items-center justify-between text-[10px] text-on-surface-variant shrink-0">
            <span>
              Showing {(page - 1) * ITEMS_PER_PAGE + 1}-{Math.min(page * ITEMS_PER_PAGE, filteredData.length)} of {filteredData.length} results
            </span>
            <div className="flex items-center gap-3">
              <button onClick={() => setPage(Math.max(1, page - 1))}
                className="flex items-center gap-1 hover:text-on-surface transition-colors disabled:opacity-30 cursor-pointer" disabled={page === 1}
              >
                <span className="material-symbols-outlined text-xs" data-icon="chevron_left">chevron_left</span>Prev
              </button>
              <div className="flex gap-1">
                {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => i + 1).map((p) => (
                  <span key={p} onClick={() => setPage(p)}
                    className={`w-5 h-5 flex items-center justify-center rounded cursor-pointer ${
                      p === page ? 'bg-primary-container text-on-primary-container font-bold' : 'hover:bg-white/5'
                    }`}
                  >{p}</span>
                ))}
              </div>
              <button onClick={() => setPage(Math.min(totalPages, page + 1))}
                className="flex items-center gap-1 hover:text-on-surface transition-colors disabled:opacity-30 cursor-pointer" disabled={page === totalPages}
              >
                Next<span className="material-symbols-outlined text-xs" data-icon="chevron_right">chevron_right</span>
              </button>
            </div>
          </div>
        </motion.section>
      </div>
    </AnimatePresence>
  );
}
