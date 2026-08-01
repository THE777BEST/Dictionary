import { ClockIcon } from "./Icons.jsx";
import { QuizPanel } from "./QuizPanel.jsx";
import { WordCard } from "./WordCard.jsx";
import { WordDetailPanel } from "./WordDetailPanel.jsx";

function ActionChip({ active = false, children, onClick, tone = "neutral" }) {
  const palette =
    tone === "primary"
      ? "border-[#3B82F6]/18 bg-[#3B82F6]/12 text-[#1d4ed8] dark:text-white"
      : tone === "danger"
        ? "border-rose-400/30 bg-rose-500/10 text-rose-600 dark:text-rose-300"
        : active
          ? "border-slate-300 bg-slate-900/[0.06] text-slate-950 dark:border-white/10 dark:bg-white/10 dark:text-white"
          : "border-slate-200/70 bg-white/75 text-slate-700 hover:border-[#3B82F6]/35 hover:text-[#3B82F6] dark:border-white/10 dark:bg-white/8 dark:text-slate-100";

  return (
    <button
      className={`inline-flex max-w-full items-center rounded-full border px-3 py-2 text-sm font-medium transition active:scale-95 ${palette}`}
      onClick={onClick}
      type="button"
    >
      {children}
    </button>
  );
}

function CardSection({ children, title }) {
  return (
    <section className="rounded-[26px] border border-slate-200/70 bg-white/72 p-4 shadow-[0_14px_36px_rgba(15,23,42,0.06)] dark:border-white/10 dark:bg-white/[0.06]">
      <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-[#3B82F6]">
        {title}
      </p>
      <div className="mt-3">{children}</div>
    </section>
  );
}

export function SearchScreen({
  aiInsights,
  aiError,
  favoriteIds,
  history,
  isSearching,
  isTyping,
  onClearHistory,
  onOpenEntry,
  onSelectHistory,
  onSpeak,
  onToggleFavorite,
  query,
  quizState,
  recentlyViewed,
  results,
  searchDirection,
  selectedEntry,
  searchError,
  text,
  wordOfDay,
}) {
  const hasQuery = query.trim().length > 0;
  const showTyping = hasQuery && (isTyping || isSearching);
  return (
    <section className="space-y-4 animate-fade-in">
      {selectedEntry ? (
        <div className="space-y-3">
          <WordDetailPanel
            aiInsights={aiInsights}
            entry={selectedEntry}
            isFavorite={favoriteIds.has(selectedEntry.id)}
            onClose={() => onOpenEntry(null)}
            onSpeak={onSpeak}
            onToggleFavorite={onToggleFavorite}
            text={text}
          />
          {aiError ? (
            <div className="rounded-[22px] border border-amber-400/30 bg-amber-500/10 px-4 py-3 text-sm leading-6 text-amber-700 dark:text-amber-200">
              {aiError}
            </div>
          ) : null}
        </div>
      ) : null}

      {!hasQuery ? (
        <>
          <QuizPanel
            active={quizState.active}
            answer={quizState.answer}
            choices={quizState.choices}
            onAnswer={quizState.onAnswer}
            onClose={quizState.onClose}
            onNext={quizState.onNext}
            onSkip={quizState.onSkip}
            onStart={quizState.onStart}
            score={quizState.score}
            text={text}
            title={text.study.title}
          />

          {wordOfDay ? (
            <CardSection title={text.common.wordOfDay}>
              <WordCard
                actionLabels={{
                  removeFavorite: text.common.removeFavorite,
                  saveFavorite: text.common.saveFavorite,
                }}
                entry={wordOfDay}
                isFavorite={favoriteIds.has(wordOfDay.id)}
                onOpen={onOpenEntry}
                onToggleFavorite={onToggleFavorite}
                primaryLabel="EN"
                secondaryLabel={wordOfDay.uzb || "-"}
                tertiaryLabel={wordOfDay.type || null}
                title={wordOfDay.eng}
              />
            </CardSection>
          ) : null}

          {history.length > 0 || recentlyViewed.length > 0 ? (
            <div className="grid gap-3 md:grid-cols-2">
              {history.length > 0 ? (
                <CardSection title={text.search.historyTitle}>
                <div className="flex flex-wrap gap-2">
                  {history.map((item) => (
                    <ActionChip key={item} onClick={() => onSelectHistory(item)}>
                      {item}
                    </ActionChip>
                  ))}
                  <ActionChip onClick={onClearHistory} tone="danger">
                    {text.favorites.clearAll}
                  </ActionChip>
                </div>
                </CardSection>
              ) : null}

              {recentlyViewed.length > 0 ? (
                <CardSection title={text.common.recentlyViewed}>
                <div className="space-y-2">
                  {recentlyViewed.slice(0, 4).map((item) => (
                    <button
                      className="flex w-full items-center justify-between rounded-[18px] border border-slate-200/70 bg-white/80 px-3 py-3 text-left transition active:scale-[0.99] hover:border-[#3B82F6]/35 dark:border-white/10 dark:bg-white/8"
                      key={item.id}
                      onClick={() => onOpenEntry(item)}
                      type="button"
                    >
                      <div className="min-w-0">
                        <p className="truncate text-sm font-semibold text-slate-950 dark:text-white">
                          {item.eng}
                        </p>
                        <p className="mt-1 truncate text-xs text-slate-500 dark:text-slate-300">
                          {item.uzb || "-"}
                        </p>
                      </div>
                      <ClockIcon className="size-4 shrink-0 text-slate-400" />
                    </button>
                  ))}
                </div>
                </CardSection>
              ) : null}
            </div>
          ) : null}

        </>
      ) : null}

      {showTyping ? (
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
      ) : null}

      {searchError && hasQuery && !showTyping ? (
        <div className="rounded-[26px] border border-rose-200/70 bg-rose-50 px-4 py-3 text-sm leading-6 text-rose-700 dark:border-rose-400/20 dark:bg-rose-500/10 dark:text-rose-200">
          {searchError}
        </div>
      ) : null}

      {hasQuery && results.length === 0 && !showTyping && !searchError ? (
        <div className="rounded-[26px] border border-slate-200/70 bg-white/72 px-4 py-4 text-sm leading-6 text-slate-600 dark:border-white/10 dark:bg-white/[0.06] dark:text-slate-300">
          {text.search.noResultsDescription}
        </div>
      ) : null}

      {hasQuery && results.length > 0 ? (
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
            const secondaryLabel = searchDirection === "en" ? entry.uzb : entry.eng;
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
                  onOpen={onOpenEntry}
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
      ) : null}
    </section>
  );
}
