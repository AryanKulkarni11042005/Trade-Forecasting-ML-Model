export default function Explainability() {
  return (
    <div className="h-full flex flex-col gap-4">
      {/* Header Section */}
      <div className="flex-none">
        <h2 className="text-2xl font-headline font-extrabold tracking-tight text-on-surface">Why did the model predict this?</h2>
        <p className="text-xs text-on-surface-variant font-body">Deep analysis of neural weights and feature attribution for the current trade deficit projection.</p>
      </div>

      {/* Bento Layout Grid */}
      <div className="flex-1 grid grid-cols-12 grid-rows-4 gap-4 min-h-0">
        {/* Central Feature Importance Card */}
        <div className="col-span-12 row-span-2 bg-surface-container-high rounded-lg p-5 neumorphic-elevated flex flex-col">
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
            {[
              { name: 'Crude Oil (Brent)', pct: '42.4%', w: '42.4%', opacity: '' },
              { name: 'USD/INR Rate', pct: '28.1%', w: '28.1%', opacity: 'opacity-80' },
              { name: 'Net Export Momentum', pct: '18.5%', w: '18.5%', opacity: 'opacity-60' },
              { name: 'Industrial Index', pct: '11.0%', w: '11.0%', opacity: 'opacity-40' },
            ].map((f) => (
              <div key={f.name} className="group">
                <div className="flex justify-between text-[10px] mb-1 px-1">
                  <span className="text-on-surface font-semibold">{f.name}</span>
                  <span className="text-primary font-bold">{f.pct}</span>
                </div>
                <div className="h-2 w-full bg-surface-container-lowest rounded-full overflow-hidden neumorphic-recessed">
                  <div className={`h-full bg-gradient-to-r from-primary to-primary-container rounded-full ${f.opacity}`} style={{ width: f.w }}></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Feature Contribution Section (SHAP Style) */}
        <div className="col-span-12 row-span-2 grid grid-cols-2 gap-4">
          {/* Positive Contribution */}
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2 mb-1">
              <div className="w-1.5 h-4 bg-tertiary rounded-full shadow-[0_0_8px_rgba(170,255,220,0.5)]"></div>
              <h3 className="text-xs font-headline font-bold text-tertiary">Increasing Deficit</h3>
            </div>
            <div className="grid grid-cols-2 gap-2 flex-1">
              <div className="bg-surface-container-high rounded-lg p-3 neumorphic-elevated flex flex-col justify-between">
                <div className="flex justify-between items-center">
                  <span className="material-symbols-outlined text-tertiary bg-tertiary/10 p-1.5 rounded-lg text-base" data-icon="oil_barrel">oil_barrel</span>
                  <span className="text-base font-black text-tertiary">+8%</span>
                </div>
                <p className="text-[10px] font-bold text-on-surface mt-1">Oil Price impact</p>
                <p className="text-[8px] text-on-surface-variant leading-tight line-clamp-2">Geopolitical tensions drove Brent prices to $94/bbl.</p>
              </div>
              <div className="bg-surface-container-high rounded-lg p-3 neumorphic-elevated flex flex-col justify-between">
                <div className="flex justify-between items-center">
                  <span className="material-symbols-outlined text-tertiary bg-tertiary/10 p-1.5 rounded-lg text-base" data-icon="currency_exchange">currency_exchange</span>
                  <span className="text-base font-black text-tertiary">+5%</span>
                </div>
                <p className="text-[10px] font-bold text-on-surface mt-1">USD/INR impact</p>
                <p className="text-[8px] text-on-surface-variant leading-tight line-clamp-2">Currency depreciation made imports more expensive.</p>
              </div>
            </div>
          </div>

          {/* Negative Contribution */}
          <div className="flex flex-col gap-2 h-full">
            <div className="flex items-center gap-2 mb-1">
              <div className="w-1.5 h-4 bg-error rounded-full shadow-[0_0_8px_rgba(255,113,108,0.5)]"></div>
              <h3 className="text-xs font-headline font-bold text-error">Reducing Deficit</h3>
            </div>
            <div className="bg-surface-container-high rounded-lg p-3 neumorphic-elevated flex-1 flex flex-col justify-between">
              <div className="flex justify-between items-center mb-1">
                <span className="material-symbols-outlined text-error bg-error/10 p-1.5 rounded-lg text-base" data-icon="trending_down">trending_down</span>
                <span className="text-base font-black text-error">-2%</span>
              </div>
              <div className="flex flex-col gap-1">
                <p className="text-[10px] font-bold text-on-surface">Lower exports impact</p>
                <p className="text-[8px] text-on-surface-variant leading-tight line-clamp-2">Slowdown in non-essential imports offset some energy spend.</p>
              </div>
              <div className="bg-surface-container-lowest p-2 rounded-lg neumorphic-recessed mt-2">
                <div className="flex items-center justify-between text-[7px] uppercase tracking-widest text-on-surface-variant mb-1 font-bold">
                  <span>Trend</span>
                  <span className="text-error">Declining Influence</span>
                </div>
                <div className="h-6 flex items-end gap-1 px-1">
                  <div className="flex-1 bg-error/20 h-[80%] rounded-t-sm"></div>
                  <div className="flex-1 bg-error/30 h-[70%] rounded-t-sm"></div>
                  <div className="flex-1 bg-error/40 h-[50%] rounded-t-sm"></div>
                  <div className="flex-1 bg-error/50 h-[40%] rounded-t-sm"></div>
                  <div className="flex-1 bg-error/60 h-[20%] rounded-t-sm"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
