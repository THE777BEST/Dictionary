export function EmptyState({ description, hint, icon, title }) {
  return (
    <div className="flex min-h-[58vh] flex-col items-center justify-center px-6 text-center animate-fade-in">
      <div className="relative mb-8 flex size-28 items-center justify-center rounded-full bg-[radial-gradient(circle_at_30%_30%,rgba(147,197,253,0.98),rgba(59,130,246,0.95)_55%,rgba(15,23,42,0)_72%)] shadow-[0_20px_50px_rgba(59,130,246,0.25)]">
        <div className="absolute inset-4 rounded-full bg-white/25 backdrop-blur-sm dark:bg-white/10" />
        <div className="relative text-white">{icon}</div>
      </div>

      <h2 className="text-[1.65rem] font-semibold tracking-tight text-slate-900 dark:text-white">
        {title}
      </h2>
      <p className="mt-3 max-w-[18rem] text-sm leading-6 text-slate-600 dark:text-slate-300">
        {description}
      </p>
      {hint ? (
        <p className="mt-3 text-sm font-medium text-slate-500 dark:text-slate-400">
          {hint}
        </p>
      ) : null}
    </div>
  );
}
