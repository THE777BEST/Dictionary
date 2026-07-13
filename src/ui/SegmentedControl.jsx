export function SegmentedControl({
  ariaLabel,
  compact = false,
  onChange,
  options,
  value,
}) {
  return (
    <div
      aria-label={ariaLabel}
      className={`inline-flex rounded-full border border-slate-200/70 bg-white/75 p-1 shadow-[0_10px_30px_rgba(15,23,42,0.08)] backdrop-blur-xl dark:border-white/10 dark:bg-slate-950/45 dark:shadow-[0_18px_40px_rgba(2,12,25,0.35)] ${
        compact ? "gap-1" : "gap-1.5"
      }`}
      role="tablist"
    >
      {options.map((option) => {
        const isActive = option.value === value;

        return (
          <button
            aria-selected={isActive}
            className={`rounded-full font-semibold transition-all duration-300 active:scale-95 ${
              compact
                ? "min-w-[58px] px-4 py-2 text-sm"
                : "min-w-[88px] px-4 py-2.5 text-sm"
            } ${
              isActive
                ? "scale-105 bg-[#3B82F6] text-white shadow-[0_10px_24px_rgba(59,130,246,0.45)]"
                : "text-slate-500 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white"
            }`}
            key={option.value}
            onClick={() => onChange(option.value)}
            role="tab"
            type="button"
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
}
