export function SegmentedControl({
  ariaLabel,
  compact = false,
  className = "",
  stretch = false,
  onChange,
  options,
  value,
}) {
  const gridColumns = stretch ? `repeat(${options.length}, minmax(0, 1fr))` : undefined;

  return (
      <div
      aria-label={ariaLabel}
      className={`max-w-full rounded-[22px] border border-slate-200/75 bg-white/80 p-1 shadow-[0_10px_28px_rgba(15,23,42,0.08)] backdrop-blur-xl dark:border-white/10 dark:bg-slate-950/45 dark:shadow-[0_18px_40px_rgba(2,12,25,0.35)] ${
        stretch ? "grid w-full" : "inline-flex w-auto"
      } ${compact ? "gap-1" : "gap-1.5"} ${className}`}
      style={gridColumns ? { gridTemplateColumns: gridColumns } : undefined}
      role="radiogroup"
    >
      {options.map((option) => {
        const isActive = option.value === value;

        return (
          <button
            aria-checked={isActive}
            className={`min-w-0 rounded-full font-semibold transition-all duration-200 active:scale-[0.98] ${
              compact
                ? "h-10 px-4 text-xs"
                : stretch
                  ? "h-12 px-3 text-sm"
                  : "h-11 min-w-[92px] px-4 text-sm"
            } ${
              isActive
                ? "bg-[#3B82F6] text-white shadow-[0_10px_22px_rgba(59,130,246,0.35)]"
                : "bg-transparent text-slate-600 hover:bg-slate-900/[0.04] hover:text-slate-950 dark:text-slate-300 dark:hover:bg-white/[0.06] dark:hover:text-white"
            }`}
            key={option.value}
            onClick={() => onChange(option.value)}
            role="radio"
            type="button"
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
}
