import { SegmentedControl } from "./SegmentedControl.jsx";
import { SearchIcon } from "./Icons.jsx";

export function TopBar({
  activeTab,
  onSearchDirectionChange,
  onSearchQueryChange,
  searchDirection,
  searchQuery,
  text,
}) {
  if (activeTab === "search") {
    return (
      <header className="fixed left-1/2 top-0 z-30 w-full max-w-[430px] -translate-x-1/2 px-4 pt-[calc(env(safe-area-inset-top)+0.9rem)]">
        <div className="rounded-[30px] border border-slate-200/70 bg-white/78 p-3 shadow-[0_20px_50px_rgba(15,23,42,0.12)] backdrop-blur-2xl dark:border-white/10 dark:bg-slate-950/58 dark:shadow-[0_26px_55px_rgba(2,12,25,0.5)]">
          <div className="flex items-center gap-3">
            <label className="relative flex-1">
              <SearchIcon className="pointer-events-none absolute left-4 top-1/2 size-5 -translate-y-1/2 text-slate-400 dark:text-slate-500" />
              <input
                autoComplete="off"
                className="h-14 w-full rounded-[30px] border border-slate-200/70 bg-slate-50/90 pl-12 pr-4 text-[15px] font-medium text-slate-900 outline-none transition duration-300 placeholder:text-slate-400 focus:border-[#3B82F6] focus:ring-4 focus:ring-[#3B82F6]/15 dark:border-white/10 dark:bg-white/7 dark:text-slate-50 dark:placeholder:text-slate-500"
                onChange={(event) => onSearchQueryChange(event.target.value)}
                placeholder={text.search.placeholder}
                type="search"
                value={searchQuery}
              />
            </label>

            <SegmentedControl
              ariaLabel={text.search.directionLabel}
              compact
              onChange={onSearchDirectionChange}
              options={[
                { label: "EN", value: "en" },
                { label: "UZ", value: "uz" },
              ]}
              value={searchDirection}
            />
          </div>
        </div>
      </header>
    );
  }

  const screenText = text[activeTab];

  return (
    <header className="fixed left-1/2 top-0 z-30 w-full max-w-[430px] -translate-x-1/2 px-4 pt-[calc(env(safe-area-inset-top)+0.9rem)]">
      <div className="rounded-[30px] border border-slate-200/70 bg-white/78 px-5 py-4 shadow-[0_20px_50px_rgba(15,23,42,0.12)] backdrop-blur-2xl dark:border-white/10 dark:bg-slate-950/58 dark:shadow-[0_26px_55px_rgba(2,12,25,0.5)]">
        <p className="text-xs font-medium uppercase tracking-[0.24em] text-[#3B82F6]">
          {screenText.title}
        </p>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-300">
          {screenText.subtitle}
        </p>
      </div>
    </header>
  );
}
