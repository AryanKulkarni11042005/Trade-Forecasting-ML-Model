import { useEffect, useState, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Cell } from 'recharts';
import { simulateScenario, getDashboardData } from '../services/api';
import type { SimulatorResult } from '../services/api';
import { useCurrencyStore, formatCurrencyValue } from '../store/currencyStore';

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1, y: 0,
    transition: { delay: i * 0.1, duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] as const },
  }),
};

interface SliderValues {
  oil_change: number;
  usd_change: number;
  china_change: number;
  usa_change: number;
  russia_change: number;
}

const PRESETS: Record<string, Partial<SliderValues>> = {
  'Oil Shock': { oil_change: 20 },
  'Strong Dollar': { usd_change: 10 },
  'China Surge': { china_change: 15 },
  'Global Recovery': { oil_change: -5, usd_change: -3, china_change: 5 },
};

const defaultSliders: SliderValues = {
  oil_change: 0, usd_change: 0, china_change: 0, usa_change: 0, russia_change: 0,
};

const SLIDER_CONFIG = [
  { key: 'oil_change' as const, label: 'Oil Price % Change' },
  { key: 'usd_change' as const, label: 'USD/INR % Change' },
  { key: 'china_change' as const, label: 'Imports from China' },
  { key: 'usa_change' as const, label: 'Imports from USA' },
  { key: 'russia_change' as const, label: 'Imports from Russia' },
];

function SkeletonSimulator() {
  return (
    <div className="flex-1 flex flex-col overflow-hidden animate-pulse">
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-6 shrink-0 gap-4">
        <div>
          <div className="w-48 h-8 rounded bg-surface-container-highest mb-2" />
          <div className="w-64 h-4 rounded bg-surface-container-highest" />
        </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 flex-1 overflow-hidden min-h-0">
        <div className="lg:col-span-4 bg-surface-container-low rounded-lg p-6 shadow-inner">
          {[0, 1, 2, 3, 4].map((i) => (
            <div key={i} className="mb-6">
              <div className="w-32 h-3 rounded bg-surface-container-highest mb-2" />
              <div className="w-full h-2 rounded-full bg-surface-container-highest" />
            </div>
          ))}
        </div>
        <div className="lg:col-span-8 flex flex-col gap-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-surface-container-high rounded-lg p-5 h-24" />
            <div className="bg-surface-container-high rounded-lg p-5 h-24" />
          </div>
          <div className="bg-surface-container-high rounded-lg p-6 flex-1 min-h-[200px]" />
        </div>
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

export default function Simulator() {
  const [sliders, setSliders] = useState<SliderValues>({ ...defaultSliders });
  const [result, setResult] = useState<SimulatorResult | null>(null);
  const [activePreset, setActivePreset] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const { mode, usdInrRate } = useCurrencyStore();

  const fmt = useCallback((val: number) => formatCurrencyValue(val, mode, usdInrRate), [mode, usdInrRate]);

  const fetchInitial = useCallback(async () => {
    setLoading(true);
    setError(false);
    try {
      const res = await simulateScenario({ ...defaultSliders });
      setResult(res);
    } catch {
      try {
        const dash = await getDashboardData();
        setResult({
          current_prediction: dash.current_trade_deficit,
          new_prediction: dash.predicted_trade_deficit,
          difference: dash.predicted_trade_deficit - dash.current_trade_deficit,
          difference_percent: ((dash.predicted_trade_deficit - dash.current_trade_deficit) / Math.abs(dash.current_trade_deficit)) * 100,
        });
      } catch {
        setError(true);
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchInitial(); }, [fetchInitial]);

  const runSimulation = useCallback((vals: SliderValues) => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(async () => {
      try {
        const res = await simulateScenario(vals);
        setResult(res);
      } catch {
        // keep last result
      }
    }, 300);
  }, []);

  const handleSliderChange = (key: keyof SliderValues, value: number) => {
    const newSliders = { ...sliders, [key]: value };
    setSliders(newSliders);
    setActivePreset(null);
  };

  const handlePreset = (name: string) => {
    const preset = PRESETS[name];
    const newSliders = { ...defaultSliders, ...preset };
    setSliders(newSliders);
    setActivePreset(name);
  };

  const handleReset = () => {
    setSliders({ ...defaultSliders });
    setActivePreset(null);
    runSimulation({ ...defaultSliders });
  };

  if (loading) return <SkeletonSimulator />;
  if (error) return <ErrorCard onRetry={fetchInitial} />;

  const diff = result?.difference ?? 0;
  const diffPct = result?.difference_percent ?? 0;
  const isIncrease = diff >= 0;

  const toB = (val: number) => (mode === 'USD' ? val / usdInrRate : val) / 1e9;

  const months = ['M1', 'M2', 'M3', 'M4', 'M5', 'M6'];
  const projectionData = months.map((m, i) => ({
    month: m,
    baseline: toB((result?.current_prediction ?? 0) * (1 + i * 0.01)),
    simulated: toB((result?.new_prediction ?? 0) * (1 + i * 0.015)),
  }));

  return (
    <AnimatePresence>
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header & Presets */}
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}
          className="flex flex-col md:flex-row md:items-end justify-between mb-6 shrink-0 gap-4"
        >
          <div>
            <h2 className="text-3xl font-extrabold font-headline tracking-tight text-on-surface mb-1">Scenario Simulator</h2>
            <p className="text-on-surface-variant text-sm max-w-lg">Adjust variables to model trade deficit sensitivity.</p>
          </div>
          <div className="flex flex-wrap gap-2 items-center">
            <span className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest mr-2">Presets:</span>
            {Object.keys(PRESETS).map((name) => (
              <button key={name} onClick={() => handlePreset(name)}
                className={`px-3 py-1 rounded-full text-[10px] font-bold transition-all cursor-pointer ${
                  activePreset === name
                    ? 'bg-primary text-on-primary-container shadow-lg shadow-primary/30'
                    : 'bg-surface-container-high hover:bg-surface-container-highest text-on-surface-variant border border-primary-fixed/20'
                }`}
              >{name}</button>
            ))}
          </div>
        </motion.div>

        {/* Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 flex-1 overflow-hidden min-h-0">
          {/* Left: Controls */}
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5, delay: 0.1 }}
            className="lg:col-span-4 h-full flex flex-col overflow-hidden"
            id="simulator-controls"
          >
            <div className="bg-surface-container-low rounded-lg p-6 shadow-inner flex flex-col h-full overflow-hidden">
              <div className="flex items-center gap-3 mb-6 shrink-0">
                <span className="material-symbols-outlined text-primary text-[20px]" data-icon="tune">tune</span>
                <h3 className="text-base font-bold font-headline">Variable Controls</h3>
              </div>
              {/* SLIDERS — single native thumb only, no overlay div */}
              <div className="flex-1 overflow-y-auto space-y-6 pr-2">
                {SLIDER_CONFIG.map((cfg) => {
                  const val = sliders[cfg.key];
                  return (
                    <div key={cfg.key} className="space-y-3">
                      <div className="flex justify-between items-center">
                        <label className="text-xs font-medium text-on-surface-variant">{cfg.label}</label>
                        <span className={`text-xs font-bold ${val > 0 ? 'text-primary' : val < 0 ? 'text-error' : 'text-on-surface'}`}>
                          {val > 0 ? '+' : ''}{val.toFixed(1)}%
                        </span>
                      </div>
                      <input
                        type="range"
                        min={-20}
                        max={20}
                        step={0.1}
                        value={val}
                        onChange={(e) => handleSliderChange(cfg.key, parseFloat(e.target.value))}
                        className="slider-neumorphic w-full"
                      />
                      <div className="flex justify-between text-[8px] text-outline"><span>-20%</span><span>0%</span><span>+20%</span></div>
                    </div>
                  );
                })}
              </div>
              <div className="mt-6 flex flex-col gap-2 shrink-0">
                <button onClick={() => runSimulation(sliders)}
                  className="w-full py-3 bg-gradient-to-br from-primary to-primary-container text-on-primary-fixed text-sm font-bold rounded-xl shadow-lg shadow-primary/10 active:scale-95 transition-all cursor-pointer"
                >Apply Scenario</button>
                <button onClick={handleReset}
                  className="w-full py-2 text-on-surface-variant hover:text-on-surface text-xs font-semibold rounded-xl transition-colors cursor-pointer"
                >Reset Scenario</button>
              </div>
            </div>
          </motion.div>

          {/* Right: Results */}
          <div className="lg:col-span-8 flex flex-col gap-6 overflow-hidden h-full">
            {/* Result Cards */}
            <div className="grid grid-cols-2 gap-4 shrink-0">
              <motion.div custom={0} initial="hidden" animate="visible" variants={cardVariants}
                className="bg-surface-container-high rounded-lg p-5 relative overflow-hidden group"
              >
                <div className="absolute top-0 right-0 p-3 opacity-5 group-hover:opacity-10 transition-opacity">
                  <span className="material-symbols-outlined text-4xl" data-icon="visibility">visibility</span>
                </div>
                <p className="text-[10px] font-bold text-outline uppercase tracking-widest mb-1">Current Prediction</p>
                <motion.h4 key={result?.current_prediction}
                  initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.3 }}
                  className="text-2xl font-black font-headline text-on-surface"
                >{fmt(result?.current_prediction ?? 0)}</motion.h4>
                <p className="text-[10px] text-on-surface-variant mt-1">Baseline deficit prediction</p>
              </motion.div>
              <motion.div custom={1} initial="hidden" animate="visible" variants={cardVariants}
                className="bg-surface-container-high rounded-lg p-5 relative border-l-4 border-primary"
              >
                <p className="text-[10px] font-bold text-primary uppercase tracking-widest mb-1">Simulated Deficit</p>
                <motion.h4 key={result?.new_prediction}
                  initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.3 }}
                  className="text-2xl font-black font-headline text-on-surface"
                >{fmt(result?.new_prediction ?? 0)}</motion.h4>
                <div className="flex items-center gap-2 mt-1">
                  <motion.div key={diff}
                    initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
                    className={`${isIncrease ? 'bg-error/10' : 'bg-tertiary/10'} px-1.5 py-0.5 rounded-full flex items-center gap-1`}
                  >
                    <span className={`material-symbols-outlined ${isIncrease ? 'text-error' : 'text-tertiary'} text-[12px]`}>
                      {isIncrease ? 'trending_up' : 'trending_down'}
                    </span>
                    <span className={`${isIncrease ? 'text-error' : 'text-tertiary'} text-[10px] font-bold`}>
                      {isIncrease ? '+' : ''}{fmt(diff)} ({diffPct > 0 ? '+' : ''}{diffPct.toFixed(1)}%)
                    </span>
                  </motion.div>
                  <span className="text-[10px] text-on-surface-variant">vs current</span>
                </div>
              </motion.div>
            </div>

            {/* Comparison Chart */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.3 }}
              className="bg-surface-container-high rounded-lg p-6 flex flex-col flex-1 overflow-hidden"
            >
              <div className="flex justify-between items-center mb-6 shrink-0">
                <div>
                  <h3 className="text-base font-bold font-headline">Temporal Impact Projection</h3>
                  <p className="text-[10px] text-on-surface-variant">6-month forecast comparison (Billions {mode})</p>
                </div>
                <div className="flex gap-4">
                  <div className="flex items-center gap-1.5">
                    <div className="w-2 h-2 rounded-full bg-outline-variant" />
                    <span className="text-[9px] font-bold text-outline uppercase">Baseline</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <div className="w-2 h-2 rounded-full bg-primary" />
                    <span className="text-[9px] font-bold text-primary uppercase">Simulated</span>
                  </div>
                </div>
              </div>
              <div className="flex-1 min-h-0">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={projectionData} margin={{ top: 5, right: 10, bottom: 5, left: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--color-outline-variant)" opacity={0.15} />
                    <XAxis dataKey="month" tick={{ fontSize: 10, fill: 'var(--color-on-surface-variant)' }} />
                    <YAxis tick={{ fontSize: 9, fill: 'var(--color-on-surface-variant)' }} width={50} />
                    <Tooltip contentStyle={{ background: 'var(--color-surface-container-highest)', border: '1px solid var(--color-outline-variant)', borderRadius: '8px', fontSize: '11px' }} />
                    <Bar dataKey="baseline" fill="var(--color-outline-variant)" radius={[4, 4, 0, 0]} animationDuration={600}>
                      {projectionData.map((_, i) => <Cell key={i} fillOpacity={0.5} />)}
                    </Bar>
                    <Bar dataKey="simulated" fill="var(--color-primary)" radius={[4, 4, 0, 0]} animationDuration={600}>
                      {projectionData.map((_, i) => <Cell key={i} fillOpacity={0.4 + i * 0.1} />)}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </motion.div>

            {/* AI Insights */}
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.5 }}
              className="bg-gradient-to-br from-surface-container-high to-surface-container rounded-lg p-5 border border-white/5 shrink-0"
            >
              <div className="flex items-start gap-4">
                <div className="p-2.5 bg-tertiary/10 rounded-xl shrink-0">
                  <span className="material-symbols-outlined text-tertiary text-[20px]" data-icon="auto_awesome">auto_awesome</span>
                </div>
                <div>
                  <h4 className="text-xs font-bold text-on-surface mb-1">AI Simulation Verdict</h4>
                  <p className="text-xs text-on-surface-variant leading-relaxed">
                    The simulation suggests a{' '}
                    <span className={`${isIncrease ? 'text-error' : 'text-tertiary'} font-bold`}>
                      {Math.abs(diffPct).toFixed(1)}% {isIncrease ? 'increase' : 'decrease'}
                    </span>{' '}
                    in trade deficit. Net impact is {isIncrease ? 'negative' : 'positive'} for the forecast period.
                    {sliders.oil_change !== 0 && ` Oil price changes of ${sliders.oil_change > 0 ? '+' : ''}${sliders.oil_change.toFixed(0)}% are a key driver.`}
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </AnimatePresence>
  );
}
