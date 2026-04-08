import { useEffect, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Area, ComposedChart } from 'recharts';
import { getForecastData, getFeatureImportance } from '../services/api';
import type { ForecastData, FeatureImportanceItem } from '../services/api';
import { useCurrencyStore, formatCurrencyValue } from '../store/currencyStore';

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1, y: 0,
    transition: { delay: i * 0.1, duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] as const },
  }),
};

const chartVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] as const } },
};

function formatDate(dateStr: string): string {
  const d = new Date(dateStr);
  return d.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
}

type Horizon = 1 | 3 | 6 | 12;

function SkeletonCard() {
  return (
    <div className="bg-surface-container-high rounded-lg p-4 neumorphic-elevated flex flex-col gap-2 animate-pulse">
      <div className="w-28 h-3 rounded bg-surface-container-highest" />
      <div className="w-20 h-7 rounded bg-surface-container-highest" />
      <div className="w-full h-1 rounded-full bg-surface-container-highest mt-1" />
    </div>
  );
}

function SkeletonChart() {
  return (
    <div className="bg-surface-container-high rounded-lg p-6 neumorphic-elevated flex flex-col animate-pulse flex-1">
      <div className="w-48 h-5 rounded bg-surface-container-highest mb-2" />
      <div className="w-64 h-3 rounded bg-surface-container-highest mb-4" />
      <div className="flex-1 bg-surface-container-highest/30 rounded-lg min-h-[200px]" />
    </div>
  );
}

function ErrorCard({ onRetry }: { onRetry: () => void }) {
  return (
    <div className="neumorphic-elevated rounded-xl p-8 flex flex-col items-center justify-center gap-4 col-span-full flex-1">
      <span className="material-symbols-outlined text-error text-4xl">cloud_off</span>
      <p className="text-on-surface-variant text-sm font-medium">Unable to load data</p>
      <button onClick={onRetry}
        className="px-6 py-2 bg-primary/10 hover:bg-primary/20 text-primary text-xs font-bold uppercase tracking-wider rounded-lg transition-colors border border-primary/20 cursor-pointer"
      >Retry</button>
    </div>
  );
}

export default function Forecast() {
  const [forecast, setForecast] = useState<ForecastData | null>(null);
  const [features, setFeatures] = useState<FeatureImportanceItem[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [horizon, setHorizon] = useState<Horizon>(3);
  const { mode, usdInrRate } = useCurrencyStore();

  const fmt = useCallback((val: number) => formatCurrencyValue(val, mode, usdInrRate), [mode, usdInrRate]);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(false);
    try {
      const [forecastRes, featRes] = await Promise.all([
        getForecastData(),
        getFeatureImportance(),
      ]);
      setForecast(forecastRes);
      setFeatures(featRes.feature_importance.slice(0, 5));
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  if (loading) {
    return (
      <>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 flex-none">
          {[0, 1, 2, 3].map((i) => <SkeletonCard key={i} />)}
        </div>
        <SkeletonChart />
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 flex-none">
          <div className="lg:col-span-3"><SkeletonChart /></div>
          <div className="lg:col-span-2"><SkeletonChart /></div>
        </div>
      </>
    );
  }

  if (error || !forecast) return <ErrorCard onRetry={fetchData} />;

  // Compute horizon-specific values
  const baseVal = forecast.next_month_forecast;

  // Summary card values adapt to horizon
  const summaryCards = [
    { label: 'Next Month Forecast', value: baseVal, accent: true },
    { label: '3 Month Forecast', value: forecast.three_month_forecast, accent: false },
    { label: '6 Month Forecast', value: forecast.six_month_forecast, accent: false },
    { label: 'Risk Level', value: null, risk: forecast.risk },
  ];

  // Chart: Historical data + forecast points based on horizon
  const sliceCount = Math.min(horizon * 4, forecast.chart.historical.length);
  const historicalChartData = forecast.chart.historical.slice(-sliceCount).map((h) => ({
    date: formatDate(h.date),
    historical: (h.trade_deficit ?? h.value) / 1e9,
  }));

  const lastHistDate = forecast.chart.historical[forecast.chart.historical.length - 1];
  const lastVal = (lastHistDate?.trade_deficit ?? lastHistDate?.value ?? 0) / 1e9;

  // Generate forecast points for selected horizon
  const forecastPoints: { date: string; forecast: number; confidenceUpper: number }[] = [];
  for (let i = 1; i <= Math.min(horizon, forecast.chart.forecast.length); i++) {
    const fp = forecast.chart.forecast[i - 1];
    if (fp) {
      forecastPoints.push({
        date: formatDate(fp.date),
        forecast: fp.value / 1e9,
        confidenceUpper: (fp.value * 1.05) / 1e9,
      });
    } else {
      forecastPoints.push({
        date: `+${i}M`,
        forecast: (baseVal * (1 + i * 0.01)) / 1e9,
        confidenceUpper: (baseVal * (1 + i * 0.01) * 1.05) / 1e9,
      });
    }
  }

  const bridgePoint = {
    date: historicalChartData[historicalChartData.length - 1]?.date ?? '',
    historical: lastVal,
    forecast: lastVal,
    confidenceUpper: lastVal * 1.05,
  };

  const combinedData = [
    ...historicalChartData.map((d) => ({ ...d, forecast: undefined as number | undefined, confidenceUpper: undefined as number | undefined })),
    bridgePoint,
    ...forecastPoints.map((d) => ({ ...d, historical: undefined as number | undefined })),
  ];

  const riskColors: Record<string, string> = { Low: 'text-tertiary', Medium: 'text-secondary', High: 'text-error' };
  const icons = ['oil_barrel', 'currency_exchange', 'public', 'factory', 'trending_up'];
  const driverCorrelations = [0.82, 0.64, 0.45, 0.38, 0.31];

  return (
    <AnimatePresence>
      <>
        {/* Top Row: Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 shrink-0">
          {summaryCards.map((card, idx) => (
            <motion.div key={card.label} custom={idx} initial="hidden" animate="visible" variants={cardVariants}
              className="bg-surface-container-high rounded-lg p-4 neumorphic-elevated flex flex-col gap-1"
            >
              <span className="text-on-surface-variant text-[10px] font-label uppercase tracking-widest">{card.label}</span>
              {card.value !== null ? (
                <>
                  <div className="flex items-baseline gap-2">
                    <span className={`text-2xl font-extrabold font-headline ${idx === 0 ? 'text-primary' : 'text-on-surface'}`}>
                      {fmt(card.value)}
                    </span>
                  </div>
                  <div className="mt-1.5 h-1 w-full bg-surface-container-highest rounded-full overflow-hidden">
                    <div className={`h-full ${idx === 0 ? 'bg-primary shadow-[0_0_8px_rgba(105,218,255,0.5)]' : idx === 1 ? 'bg-tertiary shadow-[0_0_8px_rgba(170,255,220,0.5)]' : 'bg-on-surface-variant'} w-2/3`} />
                  </div>
                </>
              ) : (
                <>
                  <div className="flex items-center gap-3">
                    <span className={`text-2xl font-extrabold font-headline ${riskColors[card.risk!] || 'text-on-surface'}`}>{card.risk}</span>
                    <div className="px-2 py-0.5 rounded-full bg-tertiary/10 border border-tertiary/20 text-tertiary text-[9px] font-bold">
                      {card.risk === 'Low' ? 'LOW' : card.risk === 'High' ? 'HIGH' : 'MODERATE'}
                    </div>
                  </div>
                  <div className="mt-1.5 flex gap-1">
                    <div className={`h-1.5 flex-1 rounded-full ${card.risk !== 'Low' ? 'bg-tertiary shadow-[0_0_10px_rgba(170,255,220,0.3)]' : 'bg-surface-container-highest'}`} />
                    <div className={`h-1.5 flex-1 rounded-full ${card.risk === 'High' || card.risk === 'Medium' ? 'bg-tertiary shadow-[0_0_10px_rgba(170,255,220,0.3)]' : 'bg-surface-container-highest'}`} />
                    <div className={`h-1.5 flex-1 rounded-full ${card.risk === 'High' ? 'bg-error shadow-[0_0_10px_rgba(255,113,108,0.3)]' : 'bg-surface-container-highest'}`} />
                    <div className="h-1.5 flex-1 rounded-full bg-surface-container-highest" />
                  </div>
                </>
              )}
            </motion.div>
          ))}
        </div>

        {/* Forecast Chart */}
        <motion.div key={horizon} initial="hidden" animate="visible" variants={chartVariants}
          className="bg-surface-container-high rounded-lg p-6 neumorphic-elevated shrink-0 flex flex-col gap-6"
        >
          {/* HEADER ROW: title · subtitle · legend — single clean row, vertically centered */}
          <div className="flex items-center justify-between flex-none border-b border-surface-container-highest pb-4">
            <div className="flex items-baseline gap-3">
              <h3 className="text-xl font-bold font-headline text-on-surface leading-none m-0 p-0">Trade Deficit Trend &amp; Forecast</h3>
              <span className="text-[11px] text-on-surface-variant font-body leading-none m-0 p-0">Historical vs AI projection (Billions {mode})</span>
            </div>
            <div className="flex items-center gap-5">
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-outline-variant" />
                <span className="text-[11px] text-on-surface-variant font-medium">Historical</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-primary shadow-[0_0_8px_#69daff]" />
                <span className="text-[11px] text-on-surface-variant font-medium">Predicted</span>
              </div>
            </div>
          </div>

          {/* Chart Wrapper - fixed height ensures the rest is visible */}
          <div className="h-[350px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={combinedData} margin={{ top: 10, right: 20, bottom: 5, left: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-outline-variant)" opacity={0.2} />
                <XAxis dataKey="date" tick={{ fontSize: 10, fill: 'var(--color-on-surface-variant)' }} interval={Math.max(1, Math.floor(combinedData.length / 8))} />
                <YAxis tick={{ fontSize: 10, fill: 'var(--color-on-surface-variant)' }} width={50} />
                <Tooltip contentStyle={{ background: 'var(--color-surface-container-highest)', border: '1px solid var(--color-outline-variant)', borderRadius: '8px', fontSize: '11px' }} />
                <Area type="monotone" dataKey="confidenceUpper" stroke="none" fill="var(--color-primary)" fillOpacity={0.06} animationDuration={800} />
                <Line type="monotone" dataKey="historical" stroke="var(--color-outline-variant)" strokeWidth={2} dot={false} animationDuration={800} connectNulls={false} />
                <Line type="monotone" dataKey="forecast" stroke="var(--color-primary)" strokeWidth={2.5} strokeDasharray="8 4" dot={{ r: 3, fill: 'var(--color-primary)', strokeWidth: 0 }} animationDuration={800} connectNulls={false} />
              </ComposedChart>
            </ResponsiveContainer>
          </div>

          {/* Horizon Selector Pills */}
          <div className="flex justify-center flex-none mt-2">
            <div className="bg-surface-container-low p-1.5 rounded-full flex gap-1.5 neumorphic-recessed shadow-inner border border-outline-variant/10">
              {([1, 3, 6, 12] as Horizon[]).map((h) => (
                <button
                  key={h}
                  onClick={() => setHorizon(h)}
                  className={`px-6 py-2 rounded-full text-xs font-bold transition-all duration-300 cursor-pointer ${horizon === h
                      ? 'bg-primary text-on-primary-container shadow-lg shadow-primary/20 scale-105'
                      : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-container-highest/50'
                    }`}
                >
                  {h === 1 ? '1 Month' : `${h} Months`}
                </button>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Drivers and Insight Row */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 shrink-0 pb-10">
          {/* Forecast Drivers */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.3 }}
            className="lg:col-span-3 bg-surface-container-high rounded-lg p-5 neumorphic-elevated"
          >
            <h4 className="text-base font-bold font-headline mb-4">Forecast Drivers</h4>
            <div className="space-y-3">
              {features && features.map((f, i) => (
                <motion.div key={f.feature}
                  initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 + i * 0.1, duration: 0.4 }}
                  className="flex items-center justify-between p-3 bg-surface-container-low rounded-md group hover:bg-surface-container transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-tertiary/10 flex items-center justify-center text-tertiary group-hover:scale-110 transition-transform">
                      <span className="material-symbols-outlined text-lg" data-icon={icons[i] || 'analytics'}>{icons[i] || 'analytics'}</span>
                    </div>
                    <span className="font-medium text-xs">{f.feature.replace(/_/g, ' ')}</span>
                  </div>
                  <div className="flex items-center gap-6">
                    <div className="flex flex-col items-end">
                      <span className="text-[9px] text-on-surface-variant">Importance</span>
                      <span className="text-xs font-bold text-on-surface">{f.importance.toFixed(1)}</span>
                    </div>
                    <span className="material-symbols-outlined text-lg text-tertiary">
                      {driverCorrelations[i] > 0.5 ? 'trending_up' : 'trending_down'}
                    </span>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Forecast Insight */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.5 }}
            className="lg:col-span-2 bg-surface-container-high rounded-lg p-5 neumorphic-elevated relative overflow-hidden group"
          >
            <div className="absolute -right-10 -top-10 w-40 h-40 bg-primary/5 rounded-full blur-3xl group-hover:bg-primary/10 transition-all" />
            <div className="relative z-10 h-full flex flex-col">
              <div className="flex items-center gap-3 mb-4">
                <span className="material-symbols-outlined text-primary text-lg" data-icon="lightbulb" style={{ fontVariationSettings: "'FILL' 1" }}>lightbulb</span>
                <h4 className="text-base font-bold font-headline">Forecast Insight</h4>
              </div>
              <div className="bg-surface-container-lowest/50 p-4 rounded-lg border border-outline-variant/10 flex-1 flex items-center">
                <p className="text-on-surface-variant text-[11px] leading-relaxed font-body italic">
                  "Trade deficit is projected at {fmt(forecast.next_month_forecast)} next month.
                  {features && features.length > 0 && ` The primary driver is ${features[0].feature.replace(/_/g, ' ')} with importance score of ${features[0].importance.toFixed(1)}.`}
                  {' '}Risk level is assessed as {forecast.risk}."
                </p>
              </div>
              <div className="mt-5 flex items-center justify-between">
                <div className="flex -space-x-2">
                  <div className="w-7 h-7 rounded-full border-2 border-surface-container-high bg-primary-container flex items-center justify-center text-[7px] font-bold text-on-primary-container">AI</div>
                  <div className="w-7 h-7 rounded-full border-2 border-surface-container-high bg-primary-container flex items-center justify-center text-[7px] font-bold text-on-primary-container">+3</div>
                </div>
                <button className="text-primary text-[10px] font-bold flex items-center gap-1 hover:underline">
                  Read Full Report
                  <span className="material-symbols-outlined text-xs" data-icon="arrow_forward">arrow_forward</span>
                </button>
              </div>
            </div>
          </motion.div>
        </div>

        <footer className="pt-2 pb-1 text-center flex-none">
          <p className="text-[9px] text-on-surface-variant uppercase tracking-[0.2em]">Engineered by TradeCast proprietary Neural Engines • v2.4.1</p>
        </footer>
      </>
    </AnimatePresence>
  );
}
