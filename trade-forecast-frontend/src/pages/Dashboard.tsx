export default function Dashboard() {
  return (
    <>
      {/* Row 1: KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 flex-shrink-0">
        {/* KPI 1 */}
        <div className="neumorphic-elevated rounded-xl p-4 flex flex-col gap-1 group hover:scale-[1.01] transition-all duration-300">
          <div className="flex justify-between items-start">
            <div className="p-1.5 bg-primary/10 rounded-lg text-primary">
              <span className="material-symbols-outlined text-xl" data-icon="balance">balance</span>
            </div>
            <span className="text-error text-[10px] font-bold flex items-center gap-0.5">
              +2.4% <span className="material-symbols-outlined text-[12px]" data-icon="trending_up">trending_up</span>
            </span>
          </div>
          <div>
            <p className="text-on-surface-variant text-[10px] font-label">Current Trade Deficit</p>
            <p className="text-2xl font-headline font-extrabold">$24.5B</p>
          </div>
        </div>

        {/* KPI 2 */}
        <div className="neumorphic-elevated rounded-xl p-4 flex flex-col gap-1 group hover:scale-[1.01] transition-all duration-300">
          <div className="flex justify-between items-start">
            <div className="p-1.5 bg-tertiary/10 rounded-lg text-tertiary">
              <span className="material-symbols-outlined text-xl" data-icon="timeline">timeline</span>
            </div>
            <span className="text-tertiary text-[10px] font-bold flex items-center gap-0.5">
              +2.8% <span className="material-symbols-outlined text-[12px]" data-icon="trending_up">trending_up</span>
            </span>
          </div>
          <div>
            <p className="text-on-surface-variant text-[10px] font-label">Predicted Next Month</p>
            <p className="text-2xl font-headline font-extrabold">$25.2B</p>
          </div>
        </div>

        {/* KPI 3 */}
        <div className="neumorphic-elevated rounded-xl p-4 flex flex-col gap-1 group hover:scale-[1.01] transition-all duration-300">
          <div className="flex justify-between items-start">
            <div className="p-1.5 bg-secondary/10 rounded-lg text-secondary">
              <span className="material-symbols-outlined text-xl" data-icon="warning">warning</span>
            </div>
            <div className="px-2 py-0.5 rounded-full bg-secondary-container text-on-secondary-container text-[8px] font-bold uppercase tracking-wider">Stable</div>
          </div>
          <div>
            <p className="text-on-surface-variant text-[10px] font-label">Risk Level</p>
            <p className="text-2xl font-headline font-extrabold">Moderate</p>
          </div>
        </div>

        {/* KPI 4 */}
        <div className="neumorphic-elevated rounded-xl p-4 flex flex-col gap-1 group hover:scale-[1.01] transition-all duration-300">
          <div className="flex justify-between items-start">
            <div className="p-1.5 bg-primary-dim/10 rounded-lg text-primary-dim">
              <span className="material-symbols-outlined text-xl" data-icon="smart_toy">smart_toy</span>
            </div>
            <span className="text-on-surface-variant text-[8px] uppercase tracking-widest font-black">Active</span>
          </div>
          <div>
            <p className="text-on-surface-variant text-[10px] font-label">Model Used</p>
            <p className="text-2xl font-headline font-extrabold">CatBoost</p>
          </div>
        </div>
      </div>

      {/* Row 2: Charts (This area grows/shrinks to fit viewport perfectly per user req) */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 min-h-0 flex-1">
        {/* Large Main Chart */}
        <div className="xl:col-span-2 neumorphic-elevated rounded-xl p-6 flex flex-col relative overflow-hidden">
          <div className="flex justify-between items-end mb-4">
            <div>
              <h3 className="font-headline font-bold text-lg">Actual vs Predicted Deficit</h3>
              <p className="text-on-surface-variant text-[11px] mt-0.5">Time series forecasting with confidence intervals</p>
            </div>
            <div className="flex gap-3">
              <div className="flex items-center gap-1.5 text-[10px]">
                <div className="w-2.5 h-2.5 rounded-full bg-primary"></div>
                <span>Actual</span>
              </div>
              <div className="flex items-center gap-1.5 text-[10px]">
                <div className="w-2.5 h-2.5 rounded-full border border-primary border-dashed"></div>
                <span>Predicted</span>
              </div>
            </div>
          </div>
          {/* Chart Placeholder Visual (Recharts can be dropped here later) */}
          <div className="flex-1 w-full relative min-h-0">
            {/* Confidence Interval Band */}
            <svg className="absolute inset-0 w-full h-full opacity-10" preserveAspectRatio="none" viewBox="0 0 1000 200">
              <path className="text-primary" d="M 0 120 Q 250 80 500 110 T 1000 70 L 1000 130 Q 750 150 500 130 T 0 150 Z" fill="currentColor"></path>
            </svg>
            {/* Predicted Dashed Line */}
            <svg className="absolute inset-0 w-full h-full" preserveAspectRatio="none" viewBox="0 0 1000 200">
              <path className="text-primary opacity-50" d="M 0 140 Q 250 100 500 120 T 1000 90" fill="none" stroke="currentColor" strokeDasharray="8 6" strokeWidth="3"></path>
            </svg>
            {/* Actual Solid Line */}
            <svg className="absolute inset-0 w-full h-full" preserveAspectRatio="none" viewBox="0 0 1000 200">
              <path className="text-primary" d="M 0 135 L 100 125 L 200 145 L 300 110 L 400 130 L 500 115" fill="none" stroke="currentColor" strokeWidth="4"></path>
              <circle className="fill-surface stroke-primary stroke-2" cx="500" cy="115" r="4"></circle>
            </svg>
            {/* Axis Labels */}
            <div className="absolute bottom-0 w-full flex justify-between text-[9px] text-on-surface-variant/50 pt-2">
              <span>Jan 2025</span>
              <span>Mar 2025</span>
              <span>May 2025</span>
              <span>Jul 2025</span>
              <span>Sep 2025</span>
              <span className="text-primary font-bold">Oct (Now)</span>
              <span>Dec 2025</span>
            </div>
          </div>
        </div>

        {/* Side Card: Area Chart */}
        <div className="neumorphic-elevated rounded-xl p-6 flex flex-col min-h-0">
          <h3 className="font-headline font-bold text-lg mb-0.5">Trade Components</h3>
          <p className="text-on-surface-variant text-[11px] mb-4">Imports vs Exports volume</p>
          <div className="flex-1 flex flex-col justify-around min-h-0">
            <div className="relative w-full">
              <p className="text-[9px] uppercase font-black text-primary-dim mb-1.5">Imports Trend</p>
              <div className="h-16 w-full bg-primary-dim/10 rounded-lg overflow-hidden relative border border-primary-dim/5">
                <svg className="absolute inset-0 w-full h-full" preserveAspectRatio="none" viewBox="0 0 400 60">
                  <path className="text-primary-dim/30" d="M0 60 V40 Q100 20 200 45 T400 15 V60 Z" fill="currentColor"></path>
                  <path className="text-primary-dim" d="M0 40 Q100 20 200 45 T400 15" fill="none" stroke="currentColor" strokeWidth="2"></path>
                </svg>
              </div>
            </div>
            <div className="relative w-full">
              <p className="text-[9px] uppercase font-black text-tertiary mb-1.5">Exports Trend</p>
              <div className="h-16 w-full bg-tertiary/10 rounded-lg overflow-hidden relative border border-tertiary/5">
                <svg className="absolute inset-0 w-full h-full" preserveAspectRatio="none" viewBox="0 0 400 60">
                  <path className="text-tertiary/30" d="M0 60 V45 Q100 55 200 35 T400 40 V60 Z" fill="currentColor"></path>
                  <path className="text-tertiary" d="M0 45 Q100 55 200 35 T400 40" fill="none" stroke="currentColor" strokeWidth="2"></path>
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Row 3: Detail Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 flex-shrink-0">
        {/* Oil Price */}
        <div className="neumorphic-elevated rounded-xl p-4 flex flex-col justify-between h-32 border border-white/5">
          <div className="flex justify-between items-center">
            <span className="text-[10px] font-label text-on-surface-variant">Crude Oil (WTI)</span>
            <span className="material-symbols-outlined text-on-surface-variant text-lg" data-icon="oil_barrel">oil_barrel</span>
          </div>
          <div>
            <h4 className="text-xl font-headline font-bold">$82.40</h4>
            <div className="flex items-center gap-1 text-error text-[10px] font-bold mt-0.5">
              <span className="material-symbols-outlined text-[12px]" data-icon="arrow_downward">arrow_downward</span>
              -1.2%
            </div>
          </div>
          <div className="w-full h-1 bg-surface-container-highest rounded-full overflow-hidden mt-1">
            <div className="w-2/3 h-full bg-error"></div>
          </div>
        </div>

        {/* Currency Rate */}
        <div className="neumorphic-elevated rounded-xl p-4 flex flex-col justify-between h-32 border border-white/5">
          <div className="flex justify-between items-center">
            <span className="text-[10px] font-label text-on-surface-variant">USD / INR</span>
            <span className="material-symbols-outlined text-on-surface-variant text-lg" data-icon="currency_exchange">currency_exchange</span>
          </div>
          <div>
            <h4 className="text-xl font-headline font-bold">83.12</h4>
            <div className="flex items-center gap-1 text-tertiary text-[10px] font-bold mt-0.5">
              <span className="material-symbols-outlined text-[12px]" data-icon="arrow_upward">arrow_upward</span>
              +0.4%
            </div>
          </div>
          <div className="w-full h-1 bg-surface-container-highest rounded-full overflow-hidden mt-1">
            <div className="w-3/4 h-full bg-tertiary"></div>
          </div>
        </div>

        {/* Feature Importance */}
        <div className="neumorphic-elevated rounded-xl p-4 flex flex-col h-32 border border-white/5">
          <div className="flex justify-between items-center mb-2">
            <span className="text-[10px] font-label text-on-surface-variant">Feature Impact</span>
            <span className="material-symbols-outlined text-on-surface-variant text-base" data-icon="bar_chart">bar_chart</span>
          </div>
          <div className="space-y-2 flex-1 min-h-0 overflow-hidden">
            <div className="space-y-0.5">
              <div className="flex justify-between text-[8px] text-on-surface-variant uppercase tracking-tighter">
                <span>USD Index</span>
                <span className="text-primary">+0.42</span>
              </div>
              <div className="h-1 w-full bg-surface-container-highest rounded-full overflow-hidden">
                <div className="h-full bg-primary" style={{ width: '85%' }}></div>
              </div>
            </div>
            <div className="space-y-0.5">
              <div className="flex justify-between text-[8px] text-on-surface-variant uppercase tracking-tighter">
                <span>Oil Volatility</span>
                <span className="text-primary">+0.38</span>
              </div>
              <div className="h-1 w-full bg-surface-container-highest rounded-full overflow-hidden">
                <div className="h-full bg-primary" style={{ width: '72%' }}></div>
              </div>
            </div>
          </div>
        </div>

        {/* Simulator Preview */}
        <div className="neumorphic-elevated rounded-xl p-4 flex flex-col justify-between h-32 bg-gradient-to-br from-surface-container-high to-surface-container border border-white/5">
          <div className="flex justify-between items-center">
            <span className="text-[10px] font-label text-primary font-bold">Scenario Simulator</span>
            <span className="material-symbols-outlined text-primary text-base" data-icon="psychology">psychology</span>
          </div>
          <div className="space-y-1">
            <div className="flex justify-between text-[9px] text-on-surface-variant font-bold">
              <span>Trade Tariff Stress</span>
              <span>+15%</span>
            </div>
            <div className="relative h-4 flex items-center">
              <div className="w-full h-1 bg-surface-container-highest rounded-full"></div>
              <div className="absolute w-3 h-3 rounded-full bg-primary shadow-[0_0_8px_rgba(105,218,255,0.4)] border border-white/20 left-2/3 -translate-x-1/2"></div>
            </div>
          </div>
          <button className="w-full py-1.5 bg-primary/10 hover:bg-primary/20 text-primary text-[9px] font-black uppercase tracking-widest rounded-lg transition-colors border border-primary/20 mt-1 cursor-pointer">
            Open Simulator
          </button>
        </div>
      </div>
    </>
  );
}
