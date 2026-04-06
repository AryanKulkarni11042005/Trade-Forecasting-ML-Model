export default function Explorer() {
  return (
    <div className="flex-1 flex flex-col gap-6 overflow-hidden">
      {/* Header & Top Filter Bar */}
      <section className="shrink-0">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold font-headline mb-1 text-on-surface">Data Explorer</h2>
            <p className="text-on-surface-variant text-xs font-label">Granular economic time-series analysis and raw data extraction.</p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <div className="bg-surface-container-low px-4 py-2 rounded-full flex items-center gap-3 neumorphic-recessed">
              <span className="material-symbols-outlined text-on-surface-variant text-sm" data-icon="calendar_today">calendar_today</span>
              <span className="text-xs font-medium text-on-surface">Jan 2023 - Oct 2025</span>
              <span className="material-symbols-outlined text-on-surface-variant text-sm" data-icon="expand_more">expand_more</span>
            </div>
          </div>
        </div>
        {/* Variable Filter Chips */}
        <div className="flex flex-wrap gap-2 mt-4">
          <button className="px-4 py-1.5 rounded-full bg-primary-container text-on-primary-container text-[10px] font-bold transition-transform active:scale-95 flex items-center gap-2 shadow-lg shadow-primary/20">
            <span className="material-symbols-outlined text-xs" data-icon="check_circle" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
            Trade Deficit
          </button>
          <button className="px-4 py-1.5 rounded-full bg-surface-container-high text-on-surface-variant hover:text-on-surface text-[10px] font-bold transition-all hover:bg-surface-container-highest">Imports</button>
          <button className="px-4 py-1.5 rounded-full bg-surface-container-high text-on-surface-variant hover:text-on-surface text-[10px] font-bold transition-all hover:bg-surface-container-highest">Exports</button>
          <button className="px-4 py-1.5 rounded-full bg-surface-container-high text-on-surface-variant hover:text-on-surface text-[10px] font-bold transition-all hover:bg-surface-container-highest">Oil Price</button>
          <button className="px-4 py-1.5 rounded-full bg-surface-container-high text-on-surface-variant hover:text-on-surface text-[10px] font-bold transition-all hover:bg-surface-container-highest">USD/INR</button>
        </div>
      </section>

      {/* Interactive Preview Chart */}
      <div className="p-6 bg-surface-container-high rounded-lg shadow-2xl relative overflow-hidden group shrink-0 h-[220px] flex flex-col">
        <div className="absolute -right-20 -top-20 w-80 h-80 bg-primary/5 rounded-full blur-[100px]"></div>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-xl">
              <span className="material-symbols-outlined text-primary text-xl" data-icon="show_chart">show_chart</span>
            </div>
            <div>
              <h3 className="text-sm font-bold font-headline">Time-Series Preview</h3>
              <p className="text-[10px] text-on-surface-variant font-label">Visualizing Trade Deficit (Billion USD)</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded bg-tertiary/10 text-tertiary text-[9px] font-bold">LIVE SYNC</span>
          </div>
        </div>
        {/* Chart Bars */}
        <div className="flex-1 w-full flex items-end justify-between gap-2 px-2 pb-2">
          {['2/3', '1/2', '3/4', '2/3', '4/5', '1/3', '1/2', '2/3', '5/6', '3/4', '4/5', 'full'].map((h, i) => (
            <div key={i} className={`w-full bg-gradient-to-t from-primary/30 to-primary/5 h-${h} rounded-t-md transition-all hover:from-primary/50`}></div>
          ))}
        </div>
        <div className="flex justify-between px-2 text-[9px] text-on-surface-variant font-medium shrink-0">
          <span>OCT 24</span><span>JAN 25</span><span>APR 25</span><span>JUL 25</span><span>OCT 25</span>
        </div>
      </div>

      {/* Large Data Table Container */}
      <section className="bg-surface-container-high rounded-lg shadow-2xl overflow-hidden flex flex-col flex-1 min-h-0">
        {/* Table Header/Toolbar */}
        <div className="p-4 flex flex-col md:flex-row md:items-center justify-between gap-4 shrink-0">
          <div className="relative max-w-xs w-full">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-lg" data-icon="search">search</span>
            <input className="w-full bg-surface-container-low border-none rounded-full py-1.5 pl-10 pr-4 text-xs focus:ring-1 focus:ring-primary/40 neumorphic-recessed placeholder:text-on-surface-variant/50 text-on-surface" placeholder="Search..." type="text" />
          </div>
          <button className="bg-primary-container text-on-primary-container px-4 py-2 rounded-full text-xs font-bold flex items-center gap-2 transition-transform active:scale-95 shadow-lg shadow-primary/10 cursor-pointer">
            <span className="material-symbols-outlined text-sm" data-icon="download">download</span>
            Export CSV
          </button>
        </div>

        {/* The Table */}
        <div className="flex-1 overflow-y-auto">
          <table className="w-full text-left border-collapse">
            <thead className="sticky top-0 bg-surface-container-high z-10">
              <tr className="bg-surface-container-highest/50">
                <th className="px-6 py-3 text-[10px] font-bold text-on-surface-variant uppercase tracking-widest border-b border-outline-variant/10">Date</th>
                <th className="px-4 py-3 text-[10px] font-bold text-on-surface-variant uppercase tracking-widest border-b border-outline-variant/10">Imports (B)</th>
                <th className="px-4 py-3 text-[10px] font-bold text-on-surface-variant uppercase tracking-widest border-b border-outline-variant/10">Exports (B)</th>
                <th className="px-4 py-3 text-[10px] font-bold text-on-surface-variant uppercase tracking-widest border-b border-outline-variant/10">Oil Price</th>
                <th className="px-4 py-3 text-[10px] font-bold text-on-surface-variant uppercase tracking-widest border-b border-outline-variant/10">USD/INR</th>
                <th className="px-4 py-3 text-[10px] font-bold text-on-surface-variant uppercase tracking-widest border-b border-outline-variant/10">Deficit</th>
                <th className="px-6 py-3 text-right border-b border-outline-variant/10"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant/5">
              {[
                { date: 'Oct 2025', imp: '$62.4', exp: '$38.1', oil: '$84.20', usd: '83.15', deficit: '-$24.3B', highlight: false },
                { date: 'Sep 2025', imp: '$60.1', exp: '$39.5', oil: '$81.50', usd: '82.90', deficit: '-$20.6B', highlight: true },
                { date: 'Aug 2025', imp: '$58.9', exp: '$37.2', oil: '$79.40', usd: '83.02', deficit: '-$21.7B', highlight: false },
                { date: 'Jul 2025', imp: '$57.4', exp: '$40.8', oil: '$76.10', usd: '82.45', deficit: '-$16.6B', highlight: false },
              ].map((row) => (
                <tr key={row.date} className="hover:bg-white/5 transition-colors group">
                  <td className={`px-6 py-3 text-xs font-medium ${row.highlight ? 'text-primary' : ''}`}>{row.date}</td>
                  <td className="px-4 py-3 text-xs text-on-surface-variant">{row.imp}</td>
                  <td className="px-4 py-3 text-xs text-on-surface-variant">{row.exp}</td>
                  <td className="px-4 py-3 text-xs text-on-surface-variant">{row.oil}</td>
                  <td className="px-4 py-3 text-xs text-on-surface-variant">{row.usd}</td>
                  <td className="px-4 py-3">
                    <span className="px-2 py-0.5 rounded-full bg-error-container/20 text-error-dim text-[10px] font-bold">{row.deficit}</span>
                  </td>
                  <td className="px-6 py-3 text-right">
                    <span className="material-symbols-outlined text-on-surface-variant opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer text-sm" data-icon="more_vert">more_vert</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Table Footer */}
        <div className="px-6 py-3 border-t border-outline-variant/10 flex items-center justify-between text-[10px] text-on-surface-variant shrink-0">
          <span>Showing 1-4 of 32 results</span>
          <div className="flex items-center gap-3">
            <button className="flex items-center gap-1 hover:text-on-surface transition-colors disabled:opacity-30" disabled>
              <span className="material-symbols-outlined text-xs" data-icon="chevron_left">chevron_left</span>
              Prev
            </button>
            <div className="flex gap-1">
              <span className="w-5 h-5 flex items-center justify-center rounded bg-primary-container text-on-primary-container font-bold">1</span>
              <span className="w-5 h-5 flex items-center justify-center rounded hover:bg-white/5 cursor-pointer">2</span>
            </div>
            <button className="flex items-center gap-1 hover:text-on-surface transition-colors">
              Next
              <span className="material-symbols-outlined text-xs" data-icon="chevron_right">chevron_right</span>
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
