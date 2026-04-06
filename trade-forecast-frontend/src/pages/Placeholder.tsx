export default function Placeholder({ title }: { title: string }) {
  return (
    <div className="flex-1 w-full h-full flex flex-col items-center justify-center neumorphic-elevated rounded-xl border border-white/5">
      <span className="material-symbols-outlined text-4xl text-primary/30 mb-4" data-icon="construction">
        construction
      </span>
      <h2 className="text-2xl font-headline font-bold text-on-surface mb-2">{title}</h2>
      <p className="text-on-surface-variant text-sm max-w-sm text-center">
        This section is currently under development. Detailed analytics and features will be implemented here soon.
      </p>
    </div>
  );
}
