import { motion } from 'framer-motion';

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] as const },
  }),
};

export default function About() {
  return (
    <div className="flex-1 flex flex-col max-w-6xl mx-auto w-full py-4 space-y-8 overflow-hidden">
      {/* Hero Inspiration Section */}
      <motion.section
        custom={0} initial="hidden" animate="visible" variants={fadeUp}
        className="text-center"
      >
        <h2 className="text-5xl font-black font-headline tracking-tighter text-on-surface mb-4 bg-gradient-to-br from-white to-primary-dim bg-clip-text text-transparent">
          TradeCast
        </h2>
        <div className="relative inline-block px-12">
          <p className="text-xl font-medium font-headline text-on-surface-variant leading-relaxed italic">
            "Forecasting trade deficit is not only a machine learning problem, but also a data problem."
          </p>
          <div className="absolute -top-4 left-0 text-primary/20 text-7xl font-serif">&ldquo;</div>
        </div>
        <div className="mt-6 flex justify-center gap-3">
          <div className="h-1 w-16 rounded-full bg-primary/20" />
          <div className="h-1 w-8 rounded-full bg-primary" />
          <div className="h-1 w-16 rounded-full bg-primary/20" />
        </div>
      </motion.section>

      {/* Inspiration & Purpose Row */}
      <motion.section
        custom={1} initial="hidden" animate="visible" variants={fadeUp}
        className="grid grid-cols-1 lg:grid-cols-2 gap-6"
      >
        <div className="neumorphic-elevated bg-surface-container-high p-8 rounded-[1.5rem] border border-white/5">
          <div className="flex items-center gap-3 mb-4">
            <span className="material-symbols-outlined text-primary text-3xl" data-icon="auto_awesome">auto_awesome</span>
            <h3 className="text-lg font-bold font-headline text-on-surface">The Inspiration</h3>
          </div>
          <p className="text-sm text-on-surface-variant font-inter leading-relaxed">
            When India signed the 'Mother of All Trade Deals' in January 2026, I became deeply curious about the nation's future. I wondered if there was a way to predict how India would look after such a landmark agreement, which sparked the initial idea for TradeCast.
          </p>
        </div>
        <div className="neumorphic-elevated bg-surface-container-high p-8 rounded-[1.5rem] border border-white/5">
          <div className="flex items-center gap-3 mb-4">
            <span className="material-symbols-outlined text-primary text-3xl" data-icon="architecture">architecture</span>
            <h3 className="text-lg font-bold font-headline text-on-surface">Why I Built This</h3>
          </div>
          <p className="text-sm text-on-surface-variant font-inter leading-relaxed">
            I wanted to solve this challenge through the lens of a Machine Learning Engineer. After two long months of intensive research and development, I built TradeCast to transform complex trade dynamics into a readable narrative of economic health.
          </p>
        </div>
      </motion.section>

      {/* Tech Stack Compact Grid */}
      <motion.section
        custom={2} initial="hidden" animate="visible" variants={fadeUp}
      >
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-xl font-bold font-headline text-on-surface">The Intelligence Engine</h3>
          </div>
          <div className="h-[1px] flex-grow mx-6 bg-outline-variant/10" />
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {[
            { name: 'CatBoost', icon: 'hub', color: 'text-primary', hover: 'group-hover:bg-primary/10' },
            { name: 'FastAPI', icon: 'bolt', color: 'text-tertiary', hover: 'group-hover:bg-tertiary/10' },
            { name: 'React', icon: 'deployed_code', color: 'text-sky-400', hover: 'group-hover:bg-sky-400/10' },
            { name: 'Supabase', icon: 'database', color: 'text-emerald-400', hover: 'group-hover:bg-emerald-400/10' },
            { name: 'Docker', icon: 'box', color: 'text-blue-400', hover: 'group-hover:bg-blue-400/10' },
            { name: 'Airflow', icon: 'cyclone', color: 'text-primary-dim', hover: 'group-hover:bg-primary-dim/10' },
          ].map((tech, i) => (
            <motion.div
              key={tech.name}
              custom={3 + i * 0.5}
              initial="hidden"
              animate="visible"
              variants={fadeUp}
              className="neumorphic-elevated bg-surface-container-high p-4 rounded-xl text-center group border border-white/5"
            >
              <div className={`w-10 h-10 rounded-lg bg-surface-container-lowest neumorphic-recessed flex items-center justify-center mx-auto mb-2 ${tech.hover} transition-colors`}>
                <span className={`material-symbols-outlined ${tech.color} text-xl`} data-icon={tech.icon}>{tech.icon}</span>
              </div>
              <h4 className="text-xs font-bold font-headline text-on-surface">{tech.name}</h4>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* Footer */}
      <motion.footer
        custom={4} initial="hidden" animate="visible" variants={fadeUp}
        className="mt-auto py-4 border-t border-white/5 flex items-center justify-between gap-8"
      >
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-full bg-red-400/10 flex items-center justify-center border border-red-400/20">
            <span className="material-symbols-outlined text-red-400 text-xl" data-icon="favorite">favorite</span>
          </div>
          <div>
            <h5 className="font-bold text-sm text-on-surface">Made with Love and Hardwork by Aryan Kulkarni ❤️</h5>
            <p className="text-[10px] text-on-surface-variant uppercase tracking-widest">TradeCast © 2025</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <a
            className="flex items-center gap-3 px-5 py-2.5 rounded-full neumorphic-elevated bg-surface-container-high text-on-surface-variant hover:text-primary transition-all group border border-white/5 hover:scale-105"
            href="https://www.linkedin.com/in/aryan-kulkarni-a24a182b9"
            target="_blank"
            rel="noopener noreferrer"
          >
            <span className="font-bold text-xs uppercase tracking-wider">LinkedIn</span>
          </a>
          <a
            className="flex items-center gap-3 px-5 py-2.5 rounded-full neumorphic-elevated bg-surface-container-high text-on-surface-variant hover:text-white transition-all group border border-white/5 hover:scale-105"
            href="https://github.com/AryanKulkarni11042005/Trade-Forecasting-ML-Model.git"
            target="_blank"
            rel="noopener noreferrer"
          >
            <span className="font-bold text-xs uppercase tracking-wider">GitHub</span>
          </a>
        </div>
      </motion.footer>
    </div>
  );
}
