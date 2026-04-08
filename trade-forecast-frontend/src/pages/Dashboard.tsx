import { useEffect, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, Area, AreaChart, CartesianGrid } from 'recharts';
import { getDashboardData, getHistoricalData, getFeatureImportance } from '../services/api';
import type { DashboardData, HistoricalRecord, FeatureImportanceItem } from '../services/api';
import { useNavigate } from 'react-router-dom';
import { useCurrencyStore, formatCurrencyValue } from '../store/currencyStore';

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] as const },
  }),
};

const chartContainerVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] as const } },
};

function SkeletonCard() {
  return (
    <div className="neumorphic-elevated rounded-xl p-4 flex flex-col gap-2 animate-pulse">
      <div className="flex justify-between items-start">
        <div className="w-8 h-8 rounded-lg bg-surface-container-highest" />
        <div className="w-12 h-4 rounded-full bg-surface-container-highest" />
      </div>
      <div className="mt-1">
        <div className="w-24 h-3 rounded bg-surface-container-highest mb-2" />
        <div className="w-16 h-7 rounded bg-surface-container-highest" />
      </div>
    </div>
  );
}

function SkeletonChart() {
  return (
    <div className="neumorphic-elevated rounded-xl p-6 flex flex-col animate-pulse">
      <div className="w-48 h-5 rounded bg-surface-container-highest mb-2" />
      <div className="w-64 h-3 rounded bg-surface-container-highest mb-4" />
      <div className="flex-1 bg-surface-container-highest/30 rounded-lg min-h-[200px]" />
    </div>
  );
}

function ErrorCard({ onRetry }: { onRetry: () => void }) {
  return (
    <div className="neumorphic-elevated rounded-xl p-8 flex flex-col items-center justify-center gap-4 col-span-full">
      <span className="material-symbols-outlined text-error text-4xl">cloud_off</span>
      <p className="text-on-surface-variant text-sm font-medium">Unable to load data</p>
      <button
        onClick={onRetry}
        className="px-6 py-2 bg-primary/10 hover:bg-primary/20 text-primary text-xs font-bold uppercase tracking-wider rounded-lg transition-colors border border-primary/20 cursor-pointer"
      >
        Retry
      </button>
    </div>
  );
}

function formatDate(dateStr: string): string {
  const d = new Date(dateStr);
  return d.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
}

export default function Dashboard() {
  const [dashboard, setDashboard] = useState<DashboardData | null>(null);
  const [historical, setHistorical] = useState<HistoricalRecord[] | null>(null);
  const [features, setFeatures] = useState<FeatureImportanceItem[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const navigate = useNavigate();
  const { mode, usdInrRate, setRate } = useCurrencyStore();

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(false);
    try {
      const [dashRes, histRes, featRes] = await Promise.all([
        getDashboardData(),
        getHistoricalData(),
        getFeatureImportance(),
      ]);
      setDashboard(dashRes);
      setHistorical(histRes);
      setFeatures(featRes.feature_importance.slice(0, 3));
      if (dashRes.usd_inr) setRate(dashRes.usd_inr);
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  }, [setRate]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const fmt = useCallback((val: number) => formatCurrencyValue(val, mode, usdInrRate), [mode, usdInrRate]);

  if (loading) {
    return (
      <>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 flex-shrink-0">
          {[0, 1, 2, 3].map((i) => <SkeletonCard key={i} />)}
        </div>
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 min-h-0 flex-1">
          <div className="xl:col-span-2"><SkeletonChart /></div>
          <SkeletonChart />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 flex-shrink-0">
          {[0, 1, 2, 3].map((i) => <SkeletonCard key={i} />)}
        </div>
      </>
    );
  }

  if (error || !dashboard) {
    return <ErrorCard onRetry={fetchData} />;
  }

  // Compute total imports / exports per month
  const chartData = historical
    ? historical.slice(-24).map((r) => ({
        date: formatDate(r.date),
        actual: r.trade_deficit / 1e9,
        predicted: (r.trade_deficit_next ?? r.trade_deficit) / 1e9,
      }))
    : [];

  const totalImports = (r: HistoricalRecord) =>
    (r.imports_china ?? 0) + (r.imports_usa ?? 0) + (r.imports_russia ?? 0);
  const totalExports = (r: HistoricalRecord) =>
    (r.exports_china ?? 0) + (r.exports_usa ?? 0) + (r.exports_russia ?? 0);

  const importsData = historical
    ? historical.slice(-12).map((r) => ({
        date: formatDate(r.date),
        value: totalImports(r) / 1e9,
      }))
    : [];

  const exportsData = historical
    ? historical.slice(-12).map((r) => ({
        date: formatDate(r.date),
        value: totalExports(r) / 1e9,
      }))
    : [];

  const deficit = dashboard.current_trade_deficit;
  const predicted = dashboard.predicted_trade_deficit;
  const pctChange = deficit !== 0 ? (((predicted - deficit) / Math.abs(deficit)) * 100).toFixed(1) : '0.0';
  const pctPositive = parseFloat(pctChange) >= 0;

  const maxImportance = features && features.length > 0 ? features[0].importance : 1;

  return (
    <AnimatePresence>
      <>
        {/* Row 1: KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 flex-shrink-0">
          {/* KPI 1 */}
          <motion.div
            custom={0} initial="hidden" animate="visible" variants={cardVariants}
            className="neumorphic-elevated rounded-xl p-4 flex flex-col gap-1 group hover:scale-[1.01] transition-all duration-300"
          >
            <div className="flex justify-between items-start">
              <div className="p-1.5 bg-primary/10 rounded-lg text-primary">
                <span className="material-symbols-outlined text-xl" data-icon="balance">balance</span>
              </div>
              <span className={`${pctPositive ? 'text-error' : 'text-tertiary'} text-[10px] font-bold flex items-center gap-0.5`}>
                {pctPositive ? '+' : ''}{pctChange}%
                <span className="material-symbols-outlined text-[12px]">{pctPositive ? 'trending_up' : 'trending_down'}</span>
              </span>
            </div>
            <div>
              <p className="text-on-surface-variant text-[10px] font-label">Current Trade Deficit</p>
              <p className="text-2xl font-headline font-extrabold">{fmt(deficit)}</p>
            </div>
          </motion.div>

          {/* KPI 2 */}
          <motion.div
            custom={1} initial="hidden" animate="visible" variants={cardVariants}
            className="neumorphic-elevated rounded-xl p-4 flex flex-col gap-1 group hover:scale-[1.01] transition-all duration-300"
          >
            <div className="flex justify-between items-start">
              <div className="p-1.5 bg-tertiary/10 rounded-lg text-tertiary">
                <span className="material-symbols-outlined text-xl" data-icon="timeline">timeline</span>
              </div>
              <span className="text-tertiary text-[10px] font-bold flex items-center gap-0.5">
                {pctPositive ? '+' : ''}{pctChange}%
                <span className="material-symbols-outlined text-[12px]">trending_up</span>
              </span>
            </div>
            <div>
              <p className="text-on-surface-variant text-[10px] font-label">Predicted Next Month</p>
              <p className="text-2xl font-headline font-extrabold">{fmt(predicted)}</p>
            </div>
          </motion.div>

          {/* KPI 3 */}
          <motion.div
            custom={2} initial="hidden" animate="visible" variants={cardVariants}
            className="neumorphic-elevated rounded-xl p-4 flex flex-col gap-1 group hover:scale-[1.01] transition-all duration-300"
          >
            <div className="flex justify-between items-start">
              <div className="p-1.5 bg-secondary/10 rounded-lg text-secondary">
                <span className="material-symbols-outlined text-xl" data-icon="warning">warning</span>
              </div>
              <div className="px-2 py-0.5 rounded-full bg-secondary-container text-on-secondary-container text-[8px] font-bold uppercase tracking-wider">
                {dashboard.risk}
              </div>
            </div>
            <div>
              <p className="text-on-surface-variant text-[10px] font-label">Risk Level</p>
              <p className="text-2xl font-headline font-extrabold">{dashboard.risk}</p>
            </div>
          </motion.div>

          {/* KPI 4 */}
          <motion.div
            custom={3} initial="hidden" animate="visible" variants={cardVariants}
            className="neumorphic-elevated rounded-xl p-4 flex flex-col gap-1 group hover:scale-[1.01] transition-all duration-300"
          >
            <div className="flex justify-between items-start">
              <div className="p-1.5 bg-primary-dim/10 rounded-lg text-primary-dim">
                <span className="material-symbols-outlined text-xl" data-icon="smart_toy">smart_toy</span>
              </div>
              <span className="text-on-surface-variant text-[8px] uppercase tracking-widest font-black">Active</span>
            </div>
            <div>
              <p className="text-on-surface-variant text-[10px] font-label">Model Used</p>
              <p className="text-2xl font-headline font-extrabold">{dashboard.model}</p>
            </div>
          </motion.div>
        </div>

        {/* Row 2: Charts */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 min-h-0 flex-1">
          {/* Main Chart */}
          <motion.div initial="hidden" animate="visible" variants={chartContainerVariants}
            className="xl:col-span-2 neumorphic-elevated rounded-xl p-6 flex flex-col relative overflow-hidden"
          >
            <div className="flex justify-between items-end mb-4">
              <div>
                <h3 className="font-headline font-bold text-lg">Actual vs Predicted Deficit</h3>
                <p className="text-on-surface-variant text-[11px] mt-0.5">Time series (Billions {mode})</p>
              </div>
              <div className="flex gap-3">
                <div className="flex items-center gap-1.5 text-[10px]">
                  <div className="w-2.5 h-2.5 rounded-full bg-primary" />
                  <span>Actual</span>
                </div>
                <div className="flex items-center gap-1.5 text-[10px]">
                  <div className="w-2.5 h-2.5 rounded-full border border-primary border-dashed" />
                  <span>Predicted</span>
                </div>
              </div>
            </div>
            <div className="flex-1 w-full relative min-h-0">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--color-outline-variant)" opacity={0.2} />
                  <XAxis dataKey="date" tick={{ fontSize: 9, fill: 'var(--color-on-surface-variant)' }} interval={3} />
                  <YAxis tick={{ fontSize: 9, fill: 'var(--color-on-surface-variant)' }} width={45} />
                  <Tooltip contentStyle={{ background: 'var(--color-surface-container-highest)', border: '1px solid var(--color-outline-variant)', borderRadius: '8px', fontSize: '11px' }} labelStyle={{ color: 'var(--color-on-surface)' }} />
                  <Line type="monotone" dataKey="actual" stroke="var(--color-primary)" strokeWidth={2.5} dot={false} animationDuration={800} animationEasing="ease-out" />
                  <Line type="monotone" dataKey="predicted" stroke="var(--color-primary)" strokeWidth={2} strokeDasharray="6 4" dot={false} opacity={0.5} animationDuration={800} animationEasing="ease-out" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </motion.div>

          {/* Side Chart */}
          <motion.div initial="hidden" animate="visible" variants={chartContainerVariants}
            className="neumorphic-elevated rounded-xl p-6 flex flex-col min-h-0"
          >
            <h3 className="font-headline font-bold text-lg mb-0.5">Trade Components</h3>
            <p className="text-on-surface-variant text-[11px] mb-4">Imports vs Exports volume</p>
            <div className="flex-1 flex flex-col justify-around min-h-0 gap-2">
              <div className="relative w-full flex-1 min-h-0">
                <p className="text-[9px] uppercase font-black text-primary-dim mb-1.5">Imports Trend</p>
                <ResponsiveContainer width="100%" height="85%">
                  <AreaChart data={importsData}>
                    <defs>
                      <linearGradient id="importsFill" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="var(--color-primary-dim)" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="var(--color-primary-dim)" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <Area type="monotone" dataKey="value" stroke="var(--color-primary-dim)" fill="url(#importsFill)" strokeWidth={2} animationDuration={800} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
              <div className="relative w-full flex-1 min-h-0">
                <p className="text-[9px] uppercase font-black text-tertiary mb-1.5">Exports Trend</p>
                <ResponsiveContainer width="100%" height="85%">
                  <AreaChart data={exportsData}>
                    <defs>
                      <linearGradient id="exportsFill" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="var(--color-tertiary)" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="var(--color-tertiary)" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <Area type="monotone" dataKey="value" stroke="var(--color-tertiary)" fill="url(#exportsFill)" strokeWidth={2} animationDuration={800} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Row 3: Detail Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 flex-shrink-0">
          {/* Oil Price */}
          <motion.div custom={4} initial="hidden" animate="visible" variants={cardVariants}
            className="neumorphic-elevated rounded-xl p-4 flex flex-col justify-between h-32 border border-white/5"
          >
            <div className="flex justify-between items-center">
              <span className="text-[10px] font-label text-on-surface-variant">Crude Oil (WTI)</span>
              <span className="material-symbols-outlined text-on-surface-variant text-lg" data-icon="oil_barrel">oil_barrel</span>
            </div>
            <div>
              <h4 className="text-xl font-headline font-bold">
                {formatCurrencyValue(dashboard.oil_price, mode, usdInrRate, { isAlreadyUsd: true })}
              </h4>
            </div>
            <div className="w-full h-1 bg-surface-container-highest rounded-full overflow-hidden mt-1">
              <div className="w-2/3 h-full bg-error" />
            </div>
          </motion.div>

          {/* Currency Rate */}
          <motion.div custom={5} initial="hidden" animate="visible" variants={cardVariants}
            className="neumorphic-elevated rounded-xl p-4 flex flex-col justify-between h-32 border border-white/5"
          >
            <div className="flex justify-between items-center">
              <span className="text-[10px] font-label text-on-surface-variant">USD / INR</span>
              <span className="material-symbols-outlined text-on-surface-variant text-lg" data-icon="currency_exchange">currency_exchange</span>
            </div>
            <div>
              <h4 className="text-xl font-headline font-bold">{dashboard.usd_inr.toFixed(2)}</h4>
            </div>
            <div className="w-full h-1 bg-surface-container-highest rounded-full overflow-hidden mt-1">
              <div className="w-3/4 h-full bg-tertiary" />
            </div>
          </motion.div>

          {/* Feature Importance */}
          <motion.div custom={6} initial="hidden" animate="visible" variants={cardVariants}
            className="neumorphic-elevated rounded-xl p-4 flex flex-col h-32 border border-white/5"
          >
            <div className="flex justify-between items-center mb-2">
              <span className="text-[10px] font-label text-on-surface-variant">Feature Impact</span>
              <span className="material-symbols-outlined text-on-surface-variant text-base" data-icon="bar_chart">bar_chart</span>
            </div>
            <div className="space-y-2 flex-1 min-h-0 overflow-hidden">
              {features && features.map((f) => (
                <div key={f.feature} className="space-y-0.5">
                  <div className="flex justify-between text-[8px] text-on-surface-variant uppercase tracking-tighter">
                    <span>{f.feature.replace(/_/g, ' ')}</span>
                    <span className="text-primary">+{(f.importance / maxImportance).toFixed(2)}</span>
                  </div>
                  <div className="h-1 w-full bg-surface-container-highest rounded-full overflow-hidden">
                    <div className="h-full bg-primary" style={{ width: `${(f.importance / maxImportance) * 100}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Simulator Preview */}
          <motion.div custom={7} initial="hidden" animate="visible" variants={cardVariants}
            className="neumorphic-elevated rounded-xl p-4 flex flex-col justify-between h-32 bg-gradient-to-br from-surface-container-high to-surface-container border border-white/5"
          >
            <div className="flex justify-between items-center">
              <span className="text-[10px] font-label text-primary font-bold">Scenario Simulator</span>
              <span className="material-symbols-outlined text-primary text-base" data-icon="psychology">psychology</span>
            </div>
            <div className="space-y-1">
              <div className="flex justify-between text-[9px] text-on-surface-variant font-bold">
                <span>Last Updated</span>
                <span>{formatDate(dashboard.last_updated)}</span>
              </div>
              <div className="relative h-4 flex items-center">
                <div className="w-full h-1 bg-surface-container-highest rounded-full" />
                <div className="absolute w-3 h-3 rounded-full bg-primary shadow-[0_0_8px_rgba(105,218,255,0.4)] border border-white/20 left-2/3 -translate-x-1/2" />
              </div>
            </div>
            <button
              onClick={() => navigate('/simulator')}
              className="w-full py-1.5 bg-primary/10 hover:bg-primary/20 text-primary text-[9px] font-black uppercase tracking-widest rounded-lg transition-colors border border-primary/20 mt-1 cursor-pointer"
            >
              Open Simulator
            </button>
          </motion.div>
        </div>
      </>
    </AnimatePresence>
  );
}
