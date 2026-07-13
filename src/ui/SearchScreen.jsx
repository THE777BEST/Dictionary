import { EmptyState } from "./EmptyState.jsx";
import { SearchIcon } from "./Icons.jsx";
import { WordCard } from "./WordCard.jsx";

export function SearchScreen({
  favoriteIds,
  isSearching,
  isTyping,
  onOpenExplanation,
  onToggleFavorite,
  query,
  results,
  searchDirection,
  text,
}) {
  const hasQuery = query.trim().length > 0;
  const showTyping = hasQuery && (isTyping || isSearching);

  if (!hasQuery) {
    return (
      <EmptyState
        description={text.search.emptyDescription}
        hint={text.search.emptyHint}
        icon={<SearchIcon className="size-14" />}
        title={text.search.emptyTitle}
      />
    );
  }

  if (showTyping) {
    return (
      <section className="animate-fade-in">
        <div className="rounded-[28px] border border-slate-200/70 bg-white/78 p-5 shadow-[0_16px_40px_rgba(15,23,42,0.08)] backdrop-blur-xl dark:border-white/10 dark:bg-white/10 dark:shadow-[0_18px_45px_rgba(2,12,25,0.3)]">
          <div className="flex items-center gap-4">
            <div className="flex gap-2">
              <span className="size-3 rounded-full bg-[#3B82F6] animate-pulse-soft" />
              <span
                className="size-3 rounded-full bg-[#3B82F6]/75 animate-pulse-soft"
                style={{ animationDelay: "120ms" }}
              />
              <span
                className="size-3 rounded-full bg-[#3B82F6]/55 animate-pulse-soft"
                style={{ animationDelay: "240ms" }}
              />
            </div>
            <div>
              <h2 className="text-base font-semibold text-slate-900 dark:text-white">
                {text.search.searchingTitle}
              </h2>
              <p className="mt-1 text-sm text-slate-500 dark:text-slate-300">
                {text.search.searchingDescription}
              </p>
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (results.length === 0) {
    return (
      <EmptyState
        description={text.search.noResultsDescription}
        icon={<SearchIcon className="size-14 opacity-80" />}
        title={text.search.noResultsTitle}
      />
    );
  }

  return (
    <section className="space-y-3 animate-fade-in">
      <div className="flex items-center justify-between px-1">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-[#3B82F6]">
            {text.search.resultsTitle}
          </p>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-300">
            {text.search.resultCount(results.length)}
          </p>
        </div>

        <span className="rounded-full border border-slate-200/70 bg-white/55 px-3 py-1.5 text-xs font-semibold text-slate-600 dark:border-white/10 dark:bg-white/8 dark:text-slate-200">
          {searchDirection.toUpperCase()}
        </span>
      </div>

      {results.map((entry, index) => {
        const primaryLabel = searchDirection === "en" ? "EN" : "UZ";
        const title = searchDirection === "en" ? entry.eng : entry.uzb;
        const secondaryLabel =
          searchDirection === "en" ? entry.uzb : entry.eng;
        const tertiaryLabel = entry.type || null;

        return (
          <div
            className="animate-rise-in"
            key={entry.id}
            style={{ animationDelay: `${index * 45}ms` }}
          >
            <WordCard
              actionLabels={{
                removeFavorite: text.common.removeFavorite,
                saveFavorite: text.common.saveFavorite,
              }}
              entry={entry}
              isFavorite={favoriteIds.has(entry.id)}
              onOpenExplanation={onOpenExplanation}
              onToggleFavorite={onToggleFavorite}
              primaryLabel={primaryLabel}
              secondaryLabel={secondaryLabel}
              tertiaryLabel={tertiaryLabel}
              title={title}
            />
          </div>
        );
      })}
    </section>
  );
}
