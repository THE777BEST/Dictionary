import { StarIcon } from "./Icons.jsx";
import { AIExplanationTrigger } from "./AIExplanationTrigger.jsx";

export function WordCard({
  actionLabels,
  entry,
  isFavorite,
  onOpenExplanation,
  onToggleFavorite,
  primaryLabel,
  secondaryLabel,
  tertiaryLabel,
  title,
}) {
  return (
    <article className="rounded-[28px] border border-slate-200/70 bg-white/78 p-4 shadow-[0_16px_40px_rgba(15,23,42,0.08)] backdrop-blur-xl transition duration-300 hover:-translate-y-0.5 hover:shadow-[0_20px_48px_rgba(15,23,42,0.12)] dark:border-white/10 dark:bg-white/10 dark:shadow-[0_18px_45px_rgba(2,12,25,0.3)]">
      <div className="flex items-start gap-3">
        <div className="min-w-0 flex-1">
          <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-[#3B82F6]">
            {primaryLabel}
          </p>
          <h3 className="mt-1 truncate text-xl font-semibold tracking-tight text-slate-900 dark:text-white">
            {title}
          </h3>
          <p className="mt-3 text-[15px] font-medium leading-6 text-slate-700 dark:text-slate-100">
            {secondaryLabel}
          </p>
          {tertiaryLabel ? (
            <p className="mt-2 text-sm text-slate-500 dark:text-slate-300">
              {tertiaryLabel}
            </p>
          ) : null}
          {entry.tran ? (
            <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
              /{entry.tran}/
            </p>
          ) : null}
        </div>

        <AIExplanationTrigger onClick={() => onOpenExplanation(entry)} />

        <button
          aria-label={
            isFavorite ? actionLabels.removeFavorite : actionLabels.saveFavorite
          }
          className={`mt-1 inline-flex size-11 items-center justify-center rounded-2xl border transition-all duration-300 active:scale-95 ${
            isFavorite
              ? "scale-105 border-[#3B82F6]/40 bg-[#3B82F6] text-white shadow-[0_12px_28px_rgba(59,130,246,0.42)]"
              : "border-slate-200/70 bg-slate-900/5 text-slate-500 hover:border-[#3B82F6]/35 hover:bg-[#3B82F6]/10 hover:text-[#3B82F6] dark:border-white/10 dark:bg-white/10 dark:text-slate-100"
          }`}
          onClick={() => onToggleFavorite(entry)}
          type="button"
        >
          <StarIcon className="size-5" filled={isFavorite} />
        </button>
      </div>
    </article>
  );
}
