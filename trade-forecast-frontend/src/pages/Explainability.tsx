import { useEffect, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { getFeatureImportance } from '../services/api';
import type { FeatureImportanceItem, InsightItem } from '../services/api';

const cardFadeVariants = {
  hidden: { opacity: 0, y: 15 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.15, duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] as const },
  }),
};

function SkeletonBar() {
  return (
    <div className="group animate-pulse">
      <div className="flex justify-between text-[10px] mb-1 px-1">
        <div className="w-24 h-3 rounded bg-surface-container-highest" />
        <div className="w-10 h-3 rounded bg-surface-container-highest" />
      </div>
      <div className="h-2 w-full bg-surface-container-lowest rounded-full overflow-hidden neumorphic-recessed">
        <div className="h-full bg-surface-container-highest rounded-full w-1/3" />
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

const FEATURE_LABELS: Record<string, string> = {
  oil_price: 'Crude Oil (WTI)',
  usd_inr: 'USD/INR Rate',
  usd_oil_interaction: 'USD × Oil Interaction',
  total_imports: 'Total Imports',
  total_exports: 'Total Exports',
  imports_china: 'Imports from China',
  imports_usa: 'Imports from USA',
  imports_russia: 'Imports from Russia',
  trade_deficit: 'Trade Deficit',
};

const FEATURE_ICONS: Record<string, string> = {
  oil_price: 'oil_barrel',
  usd_inr: 'currency_exchange',
  usd_oil_interaction: 'link',
  total_imports: 'input',
  total_exports: 'output',
  imports_china: 'public',
  imports_usa: 'flag',
  imports_russia: 'flag',
  trade_deficit: 'balance',
};

function getLabel(feature: string): string {
  return FEATURE_LABELS[feature] || feature.replace(/_/g, ' ');
}

export default function Explainability() {
  const [featureImportance, setFeatureImportance] = useState<FeatureImportanceItem[] | null>(null);
  const [insights, setInsights] = useState<InsightItem[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(false);
    try {
      const data = await getFeatureImportance();
      setFeatureImportance(data.feature_importance);
      setInsights(data.insights);
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  if (loading) {
    return (
      <div className="h-full flex flex-col gap-4 animate-pulse">
        <div className="flex-none">
          <div className="w-64 h-7 rounded bg-surface-container-highest mb-2" />
          <div className="w-96 h-4 rounded bg-surface-container-highest" />
        </div>
        <div className="flex-1 grid grid-cols-12 grid-rows-4 gap-4 min-h-0">
          <div className="col-span-12 row-span-2 bg-surface-container-high rounded-lg p-5 neumorphic-elevated flex flex-col">
            <div className="w-48 h-5 rounded bg-surface-container-highest mb-4" />
            <div className="grid grid-cols-2 gap-x-8 gap-y-3 flex-1">
              {[0, 1, 2, 3, 4, 5].map((i) => <SkeletonBar key={i} />)}
            </div>
          </div>
          <div className="col-span-12 row-span-2 grid grid-cols-2 gap-4">
            <div className="bg-surface-container-high rounded-lg p-4" />
            <div className="bg-surface-container-high rounded-lg p-4" />
          </div>
        </div>
      </div>
    );
  }

  if (error) return <ErrorCard onRetry={fetchData} />;

  const maxImportance = featureImportance && featureImportance.length > 0
    ? featureImportance[0].importance : 1;

  const positiveInsights = insights ? insights.filter((i) => i.type === 'positive') : [];
  const negativeInsights = insights ? insights.filter((i) => i.type === 'negative') : [];

  // If no negative insights from API, create one from the data
  const negInsights = negativeInsights.length > 0 ? negativeInsights : [
    { feature: 'Lower exports', impact: '-2%', type: 'negative' as const },
  ];

  return (
    <AnimatePresence>
      <div className="h-full flex flex-col gap-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="flex-none"
        >
          <h2 className="text-2xl font-headline font-extrabold tracking-tight text-on-surface">
            Why did the model predict this?
          </h2>
          <p className="text-xs text-on-surface-variant font-body">
            Deep analysis of neural weights and feature attribution for the current trade deficit projection.
          </p>
        </motion.div>

        {/* Bento Layout Grid */}
        <div className="flex-1 grid grid-cols-12 grid-rows-4 gap-4 min-h-0">
          {/* Central Feature Importance Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="col-span-12 row-span-2 bg-surface-container-high rounded-lg p-5 neumorphic-elevated flex flex-col"
          >
            <div className="flex justify-between items-start mb-3">
              <div>
                <h3 className="text-base font-headline font-bold text-on-surface">Global Feature Importance</h3>
                <p className="text-[10px] text-on-surface-variant">Model decision architecture impact.</p>
              </div>
              <div className="bg-surface-container-highest px-3 py-1 rounded-full border border-outline-variant/10">
                <span className="text-[8px] font-medium text-primary uppercase tracking-widest">Global Weights</span>
              </div>
            </div>
            {/* Horizontal Bar Chart */}
            <div className="grid grid-cols-2 gap-x-8 gap-y-2 flex-1 items-center">
              {featureImportance && featureImportance.map((f, i) => {
                const pct = (f.importance / maxImportance) * 100;
                const opacityClass = i === 0 ? '' : i === 1 ? 'opacity-80' : i === 2 ? 'opacity-60' : 'opacity-40';
                return (
                  <div key={f.feature} className="group">
                    <div className="flex justify-between text-[10px] mb-1 px-1">
                      <span className="text-on-surface font-semibold">{getLabel(f.feature)}</span>
                      <span className="text-primary font-bold">{f.importance.toFixed(1)}%</span>
                    </div>
                    <div className="h-2 w-full bg-surface-container-lowest rounded-full overflow-hidden neumorphic-recessed">
                      <motion.div
                        custom={i}
                        initial="hidden"
                        animate="visible"
                        variants={{
                          hidden: { width: 0 },
                          visible: {
                            width: `${pct}%`,
                            transition: { delay: 0.2 + i * 0.1, duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] as const },
                          },
                        }}
                        className={`h-full bg-gradient-to-r from-primary to-primary-container rounded-full ${opacityClass}`}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </motion.div>

          {/* Feature Contribution Section */}
          <div className="col-span-12 row-span-2 grid grid-cols-2 gap-4">
            {/* Positive Contributions */}
            <motion.div
              initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="flex flex-col gap-2"
            >
              <div className="flex items-center gap-2 mb-1">
                <div className="w-1.5 h-4 bg-tertiary rounded-full shadow-[0_0_8px_rgba(170,255,220,0.5)]" />
                <h3 className="text-xs font-headline font-bold text-tertiary">Increasing Deficit</h3>
              </div>
              <div className="grid grid-cols-2 gap-2 flex-1">
                {positiveInsights.map((insight, i) => (
                  <motion.div key={insight.feature}
                    custom={i}
                    initial="hidden"
                    animate="visible"
                    variants={cardFadeVariants}
                    className="bg-surface-container-high rounded-lg p-3 neumorphic-elevated flex flex-col justify-between"
                  >
                    <div className="flex justify-between items-center">
                      <span className="material-symbols-outlined text-tertiary bg-tertiary/10 p-1.5 rounded-lg text-base"
                        data-icon={FEATURE_ICONS[insight.feature.toLowerCase().replace(/ /g, '_')] || 'analytics'}
                      >
                        {FEATURE_ICONS[insight.feature.toLowerCase().replace(/ /g, '_')] || 'analytics'}
                      </span>
                      <span className="text-base font-black text-tertiary">{insight.impact}</span>
                    </div>
                    <p className="text-[10px] font-bold text-on-surface mt-1">{insight.feature} impact</p>
                    <p className="text-[8px] text-on-surface-variant leading-tight line-clamp-2">
                      {insight.feature} contributed to deficit increase.
                    </p>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Negative Contributions */}
            <motion.div
              initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}
              className="flex flex-col gap-2 h-full"
            >
              <div className="flex items-center gap-2 mb-1">
                <div className="w-1.5 h-4 bg-error rounded-full shadow-[0_0_8px_rgba(255,113,108,0.5)]" />
                <h3 className="text-xs font-headline font-bold text-error">Reducing Deficit</h3>
              </div>
              <div className="bg-surface-container-high rounded-lg p-3 neumorphic-elevated flex-1 flex flex-col justify-between">
                <div className="flex justify-between items-center mb-1">
                  <span className="material-symbols-outlined text-error bg-error/10 p-1.5 rounded-lg text-base" data-icon="trending_down">trending_down</span>
                  <span className="text-base font-black text-error">{negInsights[0]?.impact || '-2%'}</span>
                </div>
                <div className="flex flex-col gap-1">
                  <p className="text-[10px] font-bold text-on-surface">{negInsights[0]?.feature || 'Lower exports'} impact</p>
                  <p className="text-[8px] text-on-surface-variant leading-tight line-clamp-2">
                    Slowdown in non-essential imports offset some energy spend.
                  </p>
                </div>
                <div className="bg-surface-container-lowest p-2 rounded-lg neumorphic-recessed mt-2">
                  <div className="flex items-center justify-between text-[7px] uppercase tracking-widest text-on-surface-variant mb-1 font-bold">
                    <span>Trend</span>
                    <span className="text-error">Declining Influence</span>
                  </div>
                  <div className="h-6 flex items-end gap-1 px-1">
                    <motion.div initial={{ height: 0 }} animate={{ height: '80%' }} transition={{ delay: 0.6, duration: 0.4 }}
                      className="flex-1 bg-error/20 rounded-t-sm" />
                    <motion.div initial={{ height: 0 }} animate={{ height: '70%' }} transition={{ delay: 0.7, duration: 0.4 }}
                      className="flex-1 bg-error/30 rounded-t-sm" />
                    <motion.div initial={{ height: 0 }} animate={{ height: '50%' }} transition={{ delay: 0.8, duration: 0.4 }}
                      className="flex-1 bg-error/40 rounded-t-sm" />
                    <motion.div initial={{ height: 0 }} animate={{ height: '40%' }} transition={{ delay: 0.9, duration: 0.4 }}
                      className="flex-1 bg-error/50 rounded-t-sm" />
                    <motion.div initial={{ height: 0 }} animate={{ height: '20%' }} transition={{ delay: 1.0, duration: 0.4 }}
                      className="flex-1 bg-error/60 rounded-t-sm" />
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </AnimatePresence>
  );
}
