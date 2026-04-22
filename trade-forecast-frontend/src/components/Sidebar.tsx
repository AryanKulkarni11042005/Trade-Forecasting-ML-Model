import { NavLink } from 'react-router-dom';
import { useThemeStore } from '../store/themeStore';

export default function Sidebar() {
  const { isDark } = useThemeStore();

  const navItems = [
    { name: 'Dashboard', path: '/', icon: 'dashboard' },
    { name: 'Forecast', path: '/forecast', icon: 'trending_up' },
    { name: 'Simulator', path: '/simulator', icon: 'analytics' },
    { name: 'Explainability', path: '/explainability', icon: 'query_stats' },
    { name: 'Explorer', path: '/explorer', icon: 'database' },
    { name: 'About', path: '/about', icon: 'info' },
  ];

  return (
    <aside
      className="fixed left-0 top-0 h-screen w-60 flex flex-col py-6 shadow-2xl z-50 border-r transition-colors duration-300"
      style={{
        backgroundColor: isDark ? '#0b0e14' : '#e0e3e9',
        borderColor: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.06)',
      }}
    >
      <div className="px-6 mb-8">
        <h1
          className="text-xl font-black tracking-tight font-headline"
          style={{ color: isDark ? '#00D1FF' : '#0088aa' }}
        >
          TradeCast
        </h1>
      </div>
      <nav id="sidebar-nav" className="flex-1 space-y-1">
        {navItems.map((item) => (
          <NavLink
            key={item.name}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center gap-3 py-2.5 px-6 font-label text-xs font-medium transition-all ${
                isActive
                  ? `rounded-r-full border-l-4 shadow-[0_0_20px_rgba(0,209,255,0.1)] ${
                      isDark
                        ? 'bg-sky-500/10 text-[#00D1FF] border-[#00D1FF]'
                        : 'bg-sky-500/15 text-[#0077aa] border-[#0088aa]'
                    }`
                  : `border-l-4 border-transparent ${
                      isDark
                        ? 'text-[#a9abb3] hover:text-white hover:bg-white/5'
                        : 'text-[#5a5d65] hover:text-[#1a1c22] hover:bg-black/5'
                    }`
              }`
            }
            id={`nav-${item.name.toLowerCase()}`}
          >
            <span className="material-symbols-outlined text-xl" data-icon={item.icon}>
              {item.icon}
            </span>
            {item.name}
          </NavLink>
        ))}
      </nav>

    </aside>
  );
}
