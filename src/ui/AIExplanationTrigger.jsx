import { Info } from "lucide-react";

export function AIExplanationTrigger({ onClick }) {
  return (
    <button
      aria-label="View AI Explanation"
      className="mt-1 inline-flex size-8 shrink-0 items-center justify-center rounded-full bg-transparent text-slate-400 transition-all duration-200 hover:bg-[#3B82F6]/10 hover:text-[#3B82F6] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#3B82F6]/60 dark:text-slate-300 dark:hover:bg-[#3B82F6]/20 dark:hover:text-[#93c5fd]"
      onClick={(event) => {
        event.stopPropagation();
        onClick();
      }}
      type="button"
    >
      <Info aria-hidden="true" size={17} strokeWidth={2} />
    </button>
  );
}
