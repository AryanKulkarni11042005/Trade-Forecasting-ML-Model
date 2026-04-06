export default function Forecast() {
  return (
    <>
      {/* Top Row: Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 flex-none">
        {/* Next Month Forecast */}
        <div className="bg-surface-container-high rounded-lg p-4 neumorphic-elevated flex flex-col gap-1">
          <span className="text-on-surface-variant text-[10px] font-label uppercase tracking-widest">Next Month Forecast</span>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-extrabold font-headline text-primary">$22.4B</span>
            <span className="text-error text-[10px] font-bold">+4.2%</span>
          </div>
          <div className="mt-1.5 h-1 w-full bg-surface-container-highest rounded-full overflow-hidden">
            <div className="h-full bg-primary w-2/3 shadow-[0_0_8px_rgba(105,218,255,0.5)]"></div>
          </div>
        </div>
        {/* 3 Month Forecast */}
        <div className="bg-surface-container-high rounded-lg p-4 neumorphic-elevated flex flex-col gap-1">
          <span className="text-on-surface-variant text-[10px] font-label uppercase tracking-widest">3 Month Forecast</span>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-extrabold font-headline text-on-surface">$68.1B</span>
            <span className="text-tertiary text-[10px] font-bold">-1.8%</span>
          </div>
          <div className="mt-1.5 h-1 w-full bg-surface-container-highest rounded-full overflow-hidden">
            <div className="h-full bg-tertiary w-1/2 shadow-[0_0_8px_rgba(170,255,220,0.5)]"></div>
          </div>
        </div>
        {/* 6 Month Forecast */}
        <div className="bg-surface-container-high rounded-lg p-4 neumorphic-elevated flex flex-col gap-1">
          <span className="text-on-surface-variant text-[10px] font-label uppercase tracking-widest">6 Month Forecast</span>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-extrabold font-headline text-on-surface">$142.9B</span>
            <span className="text-on-surface-variant text-[10px] font-bold">Stable</span>
          </div>
          <div className="mt-1.5 h-1 w-full bg-surface-container-highest rounded-full overflow-hidden">
            <div className="h-full bg-on-surface-variant w-3/4"></div>
          </div>
        </div>
        {/* Confidence Level */}
        <div className="bg-surface-container-high rounded-lg p-4 neumorphic-elevated flex flex-col gap-1">
          <span className="text-on-surface-variant text-[10px] font-label uppercase tracking-widest">Confidence Level</span>
          <div className="flex items-center gap-3">
            <span className="text-2xl font-extrabold font-headline text-on-surface">88%</span>
            <div className="px-2 py-0.5 rounded-full bg-tertiary/10 border border-tertiary/20 text-tertiary text-[9px] font-bold">HIGH</div>
          </div>
          <div className="mt-1.5 flex gap-1">
            <div className="h-1.5 flex-1 rounded-full bg-tertiary shadow-[0_0_10px_rgba(170,255,220,0.3)]"></div>
            <div className="h-1.5 flex-1 rounded-full bg-tertiary shadow-[0_0_10px_rgba(170,255,220,0.3)]"></div>
            <div className="h-1.5 flex-1 rounded-full bg-tertiary shadow-[0_0_10px_rgba(170,255,220,0.3)]"></div>
            <div className="h-1.5 flex-1 rounded-full bg-surface-container-highest"></div>
          </div>
        </div>
      </div>

      {/* Large Central Card: Forecast Chart */}
      <div className="bg-surface-container-high rounded-lg p-6 neumorphic-elevated flex-1 flex flex-col gap-4 min-h-0">
        <div className="flex justify-between items-center flex-none">
          <div>
            <h3 className="text-lg font-bold font-headline text-on-surface">Trade Deficit Trend &amp; Forecast</h3>
            <p className="text-[11px] text-on-surface-variant font-body">Historical performance vs AI projection (Billions USD)</p>
          </div>
          <div className="flex gap-4 items-center">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-outline-variant"></span>
              <span className="text-[10px] text-on-surface-variant">Historical</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-primary shadow-[0_0_8px_#69daff]"></span>
              <span className="text-[10px] text-on-surface-variant">Predicted</span>
            </div>
          </div>
        </div>
        {/* Abstract Chart Rendering */}
        <div className="flex-1 relative flex items-end gap-1 px-4 min-h-0">
          {/* Historical Bars */}
          <div className="flex-1 h-1/4 bg-outline-variant/20 rounded-t-md hover:bg-outline-variant/40 transition-colors"></div>
          <div className="flex-1 h-1/3 bg-outline-variant/20 rounded-t-md hover:bg-outline-variant/40 transition-colors"></div>
          <div className="flex-1 h-1/2 bg-outline-variant/20 rounded-t-md hover:bg-outline-variant/40 transition-colors"></div>
          <div className="flex-1 h-[40%] bg-outline-variant/20 rounded-t-md hover:bg-outline-variant/40 transition-colors"></div>
          <div className="flex-1 h-3/4 bg-outline-variant/20 rounded-t-md hover:bg-outline-variant/40 transition-colors"></div>
          <div className="flex-1 h-[60%] bg-outline-variant/20 rounded-t-md hover:bg-outline-variant/40 transition-colors"></div>
          <div className="flex-1 h-[85%] bg-outline-variant/20 rounded-t-md hover:bg-outline-variant/40 transition-colors"></div>
          <div className="flex-1 h-[70%] bg-outline-variant/20 rounded-t-md hover:bg-outline-variant/40 transition-colors"></div>
          {/* Vertical Divider */}
          <div className="w-px h-full bg-primary/30 mx-2 relative flex-none">
            <span className="absolute top-0 left-1/2 -translate-x-1/2 bg-primary text-[7px] px-1 rounded-sm text-on-primary-fixed">NOW</span>
          </div>
          {/* Forecasted Area */}
          <div className="flex-[0.5] h-[90%] bg-primary/20 rounded-t-md border-t-2 border-primary shadow-[0_-4px_20px_rgba(105,218,255,0.15)] relative group cursor-pointer">
            <div className="absolute inset-0 bg-gradient-to-t from-primary/5 to-transparent opacity-50"></div>
            <div className="hidden group-hover:block absolute -top-10 left-1/2 -translate-x-1/2 bg-surface-container-highest p-1.5 rounded shadow-xl border border-primary/20 z-10 w-20">
              <p className="text-[9px] text-primary font-bold">NOV 2025</p>
              <p className="text-xs font-bold">$22.4B</p>
            </div>
          </div>
          <div className="flex-[0.5] h-full bg-primary/15 rounded-t-md border-t-2 border-primary/60 border-dashed relative"></div>
          <div className="flex-[0.5] h-[95%] bg-primary/10 rounded-t-md border-t-2 border-primary/40 border-dashed relative"></div>
          <div className="flex-[0.5] h-[98%] bg-primary/5 rounded-t-md border-t-2 border-primary/20 border-dashed relative"></div>
        </div>
        {/* Bottom Selector Pills */}
        <div className="flex justify-center flex-none">
          <div className="bg-surface-container-low p-1 rounded-full flex gap-1 neumorphic-recessed">
            <button className="px-5 py-1.5 rounded-full text-[10px] font-semibold text-on-surface-variant hover:text-on-surface transition-colors">1 Month</button>
            <button className="px-5 py-1.5 rounded-full text-[10px] font-semibold bg-primary text-on-primary-container shadow-lg shadow-primary/20">3 Months</button>
            <button className="px-5 py-1.5 rounded-full text-[10px] font-semibold text-on-surface-variant hover:text-on-surface transition-colors">6 Months</button>
            <button className="px-5 py-1.5 rounded-full text-[10px] font-semibold text-on-surface-variant hover:text-on-surface transition-colors">12 Months</button>
          </div>
        </div>
      </div>

      {/* Middle Row: Drivers and Insight */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 flex-none">
        {/* Left Card: Forecast Drivers */}
        <div className="lg:col-span-3 bg-surface-container-high rounded-lg p-5 neumorphic-elevated">
          <h4 className="text-base font-bold font-headline mb-4">Forecast Drivers</h4>
          <div className="space-y-3">
            {/* Driver Item: Oil */}
            <div className="flex items-center justify-between p-3 bg-surface-container-low rounded-md group hover:bg-surface-container transition-colors">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-tertiary/10 flex items-center justify-center text-tertiary group-hover:scale-110 transition-transform">
                  <span className="material-symbols-outlined text-lg" data-icon="oil_barrel">oil_barrel</span>
                </div>
                <span className="font-medium text-xs">Oil Price</span>
              </div>
              <div className="flex items-center gap-6">
                <div className="flex flex-col items-end">
                  <span className="text-[9px] text-on-surface-variant">Correlation</span>
                  <span className="text-xs font-bold text-on-surface">0.82</span>
                </div>
                <span className="material-symbols-outlined text-lg text-error" data-icon="trending_up">trending_up</span>
              </div>
            </div>
            {/* Driver Item: USD/INR */}
            <div className="flex items-center justify-between p-3 bg-surface-container-low rounded-md group hover:bg-surface-container transition-colors">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                  <span className="material-symbols-outlined text-lg" data-icon="currency_exchange">currency_exchange</span>
                </div>
                <span className="font-medium text-xs">USD/INR</span>
              </div>
              <div className="flex items-center gap-6">
                <div className="flex flex-col items-end">
                  <span className="text-[9px] text-on-surface-variant">Correlation</span>
                  <span className="text-xs font-bold text-on-surface">0.64</span>
                </div>
                <span className="material-symbols-outlined text-lg text-tertiary" data-icon="trending_down">trending_down</span>
              </div>
            </div>
            {/* Driver Item: China */}
            <div className="flex items-center justify-between p-3 bg-surface-container-low rounded-md group hover:bg-surface-container transition-colors">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-on-surface-variant/10 flex items-center justify-center text-on-surface-variant">
                  <span className="material-symbols-outlined text-lg" data-icon="public">public</span>
                </div>
                <span className="font-medium text-xs">Imports from China</span>
              </div>
              <div className="flex items-center gap-6">
                <div className="flex flex-col items-end">
                  <span className="text-[9px] text-on-surface-variant">Correlation</span>
                  <span className="text-xs font-bold text-on-surface">0.45</span>
                </div>
                <span className="material-symbols-outlined text-lg text-error" data-icon="trending_up">trending_up</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Card: Forecast Insight */}
        <div className="lg:col-span-2 bg-surface-container-high rounded-lg p-5 neumorphic-elevated relative overflow-hidden group">
          <div className="absolute -right-10 -top-10 w-40 h-40 bg-primary/5 rounded-full blur-3xl group-hover:bg-primary/10 transition-all"></div>
          <div className="relative z-10 h-full flex flex-col">
            <div className="flex items-center gap-3 mb-4">
              <span className="material-symbols-outlined text-primary text-lg" data-icon="lightbulb" style={{ fontVariationSettings: "'FILL' 1" }}>lightbulb</span>
              <h4 className="text-base font-bold font-headline">Forecast Insight</h4>
            </div>
            <div className="bg-surface-container-lowest/50 p-4 rounded-lg border border-outline-variant/10 flex-1 flex items-center">
              <p className="text-on-surface-variant text-[11px] leading-relaxed font-body italic">
                "Trade deficit is expected to increase moderately next month due to higher oil prices and rising imports from China. Our AI model predicts a peak in Q4, primarily driven by seasonal electronics demand."
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
        </div>
      </div>

      {/* Footer */}
      <footer className="pt-2 pb-1 text-center flex-none">
        <p className="text-[9px] text-on-surface-variant uppercase tracking-[0.2em]">Engineered by TradeCast proprietary Neural Engines • v2.4.1</p>
      </footer>
    </>
  );
}
