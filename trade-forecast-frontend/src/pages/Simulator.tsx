export default function Simulator() {
  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      {/* Page Header & Presets */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-6 shrink-0 gap-4">
        <div>
          <h2 className="text-3xl font-extrabold font-headline tracking-tight text-on-surface mb-1">Scenario Simulator</h2>
          <p className="text-on-surface-variant text-sm max-w-lg">Adjust variables to model trade deficit sensitivity.</p>
        </div>
        <div className="flex flex-wrap gap-2 items-center">
          <span className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest mr-2">Presets:</span>
          <button className="px-3 py-1 bg-surface-container-high hover:bg-surface-container-highest text-primary-fixed border border-primary-fixed/20 rounded-full text-[10px] font-bold transition-all">Oil Shock</button>
          <button className="px-3 py-1 bg-surface-container-high hover:bg-surface-container-highest text-on-surface-variant rounded-full text-[10px] font-bold transition-all">Strong Dollar</button>
          <button className="px-3 py-1 bg-surface-container-high hover:bg-surface-container-highest text-on-surface-variant rounded-full text-[10px] font-bold transition-all">China Surge</button>
        </div>
      </div>

      {/* Dashboard Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 flex-1 overflow-hidden min-h-0">
        {/* Left Panel: Control Center */}
        <div className="lg:col-span-4 h-full flex flex-col overflow-hidden">
          <div className="bg-surface-container-low rounded-lg p-6 shadow-inner flex flex-col h-full overflow-hidden">
            <div className="flex items-center gap-3 mb-6 shrink-0">
              <span className="material-symbols-outlined text-primary text-[20px]" data-icon="tune">tune</span>
              <h3 className="text-base font-bold font-headline">Variable Controls</h3>
            </div>
            {/* Sliders Container */}
            <div className="flex-1 overflow-y-auto space-y-6 pr-2">
              {/* Oil Price */}
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <label className="text-xs font-medium text-on-surface-variant">Oil Price % Change</label>
                  <span className="text-primary text-xs font-bold">+8.5%</span>
                </div>
                <div className="relative h-1.5 w-full bg-surface-container-highest rounded-full">
                  <div className="absolute left-0 top-0 h-full bg-gradient-to-r from-primary to-primary-container rounded-full" style={{ width: '72%' }}></div>
                  <div className="absolute top-1/2 left-[72%] -translate-y-1/2 w-4 h-4 bg-primary rounded-full shadow-[0_0_10px_rgba(105,218,255,0.4)] border-2 border-surface cursor-pointer"></div>
                </div>
                <div className="flex justify-between text-[8px] text-outline"><span>-20%</span><span>0%</span><span>+20%</span></div>
              </div>
              {/* USD/INR */}
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <label className="text-xs font-medium text-on-surface-variant">USD/INR % Change</label>
                  <span className="text-on-surface text-xs font-bold">-2.1%</span>
                </div>
                <div className="relative h-1.5 w-full bg-surface-container-highest rounded-full">
                  <div className="absolute left-0 top-0 h-full bg-gradient-to-r from-primary/40 to-primary/60 rounded-full" style={{ width: '45%' }}></div>
                  <div className="absolute top-1/2 left-[45%] -translate-y-1/2 w-4 h-4 bg-on-surface-variant rounded-full border-2 border-surface cursor-pointer"></div>
                </div>
                <div className="flex justify-between text-[8px] text-outline"><span>-20%</span><span>0%</span><span>+20%</span></div>
              </div>
              {/* Import China */}
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <label className="text-xs font-medium text-on-surface-variant">Imports from China</label>
                  <span className="text-on-surface text-xs font-bold">0.0%</span>
                </div>
                <div className="relative h-1.5 w-full bg-surface-container-highest rounded-full">
                  <div className="absolute top-1/2 left-[50%] -translate-y-1/2 w-4 h-4 bg-on-surface-variant rounded-full border-2 border-surface cursor-pointer"></div>
                </div>
                <div className="flex justify-between text-[8px] text-outline"><span>-20%</span><span>0%</span><span>+20%</span></div>
              </div>
              {/* Import USA */}
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <label className="text-xs font-medium text-on-surface-variant">Imports from USA</label>
                  <span className="text-error text-xs font-bold">+12.4%</span>
                </div>
                <div className="relative h-1.5 w-full bg-surface-container-highest rounded-full">
                  <div className="absolute left-0 top-0 h-full bg-gradient-to-r from-primary to-primary-container rounded-full" style={{ width: '81%' }}></div>
                  <div className="absolute top-1/2 left-[81%] -translate-y-1/2 w-4 h-4 bg-primary rounded-full border-2 border-surface cursor-pointer"></div>
                </div>
                <div className="flex justify-between text-[8px] text-outline"><span>-20%</span><span>0%</span><span>+20%</span></div>
              </div>
            </div>
            <div className="mt-6 flex flex-col gap-2 shrink-0">
              <button className="w-full py-3 bg-gradient-to-br from-primary to-primary-container text-on-primary-fixed text-sm font-bold rounded-xl shadow-lg shadow-primary/10 active:scale-95 transition-all cursor-pointer">Apply Scenario</button>
              <button className="w-full py-2 text-on-surface-variant hover:text-on-surface text-xs font-semibold rounded-xl transition-colors cursor-pointer">Reset Scenario</button>
            </div>
          </div>
        </div>

        {/* Right Panel: Impact Preview */}
        <div className="lg:col-span-8 flex flex-col gap-6 overflow-hidden h-full">
          {/* Result Cards Bento */}
          <div className="grid grid-cols-2 gap-4 shrink-0">
            <div className="bg-surface-container-high rounded-lg p-5 relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-3 opacity-5 group-hover:opacity-10 transition-opacity">
                <span className="material-symbols-outlined text-4xl" data-icon="visibility">visibility</span>
              </div>
              <p className="text-[10px] font-bold text-outline uppercase tracking-widest mb-1">Current Prediction</p>
              <h4 className="text-2xl font-black font-headline text-on-surface">$24.2B</h4>
              <p className="text-[10px] text-on-surface-variant mt-1">Baseline deficit for Q4 2025</p>
            </div>
            <div className="bg-surface-container-high rounded-lg p-5 relative border-l-4 border-primary">
              <p className="text-[10px] font-bold text-primary uppercase tracking-widest mb-1">Simulated Deficit</p>
              <h4 className="text-2xl font-black font-headline text-on-surface">$27.8B</h4>
              <div className="flex items-center gap-2 mt-1">
                <div className="bg-error/10 px-1.5 py-0.5 rounded-full flex items-center gap-1">
                  <span className="material-symbols-outlined text-error text-[12px]" data-icon="trending_up">trending_up</span>
                  <span className="text-error text-[10px] font-bold">+$3.6B</span>
                </div>
                <span className="text-[10px] text-on-surface-variant">vs current</span>
              </div>
            </div>
          </div>

          {/* Comparison Chart */}
          <div className="bg-surface-container-high rounded-lg p-6 flex flex-col flex-1 overflow-hidden">
            <div className="flex justify-between items-center mb-6 shrink-0">
              <div>
                <h3 className="text-base font-bold font-headline">Temporal Impact Projection</h3>
                <p className="text-[10px] text-on-surface-variant">6-month forecast comparison (USD Billions)</p>
              </div>
              <div className="flex gap-4">
                <div className="flex items-center gap-1.5">
                  <div className="w-2 h-2 rounded-full bg-outline-variant"></div>
                  <span className="text-[9px] font-bold text-outline uppercase">Baseline</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="w-2 h-2 rounded-full bg-primary"></div>
                  <span className="text-[9px] font-bold text-primary uppercase">Simulated</span>
                </div>
              </div>
            </div>
            {/* Visual chart */}
            <div className="flex-1 min-h-0 relative w-full flex items-end gap-2 pb-4">
              {[
                { label: 'Oct', base: '40%', sim: '55%', op: '40' },
                { label: 'Nov', base: '45%', sim: '62%', op: '50' },
                { label: 'Dec', base: '42%', sim: '68%', op: '60' },
                { label: 'Jan', base: '50%', sim: '75%', op: '70' },
                { label: 'Feb', base: '55%', sim: '82%', op: '80' },
                { label: 'Mar', base: '60%', sim: '90%', op: '' },
              ].map((m) => (
                <div key={m.label} className="flex-1 flex flex-col justify-end gap-1 h-full">
                  <div className="w-full bg-surface-container-highest rounded-t-sm" style={{ height: m.base }}></div>
                  <div className={`w-full bg-primary${m.op ? `/${m.op}` : ''} rounded-t-sm`} style={{ height: m.sim }}></div>
                  <span className="text-[9px] text-center mt-1 text-outline">{m.label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* AI Insights */}
          <div className="bg-gradient-to-br from-surface-container-high to-surface-container rounded-lg p-5 border border-white/5 shrink-0">
            <div className="flex items-start gap-4">
              <div className="p-2.5 bg-tertiary/10 rounded-xl shrink-0">
                <span className="material-symbols-outlined text-tertiary text-[20px]" data-icon="auto_awesome">auto_awesome</span>
              </div>
              <div>
                <h4 className="text-xs font-bold text-on-surface mb-1">AI Simulation Verdict</h4>
                <p className="text-xs text-on-surface-variant leading-relaxed">
                  The simulation suggests a <span className="text-primary font-bold">14.8% increase</span> in trade deficit primarily driven by Oil price fluctuations. Net impact is significantly negative for Q1 2026.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
