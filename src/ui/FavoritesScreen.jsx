import { EmptyState } from "./EmptyState.jsx";
import { StarIcon } from "./Icons.jsx";
import { WordCard } from "./WordCard.jsx";

export function FavoritesScreen({
  favorites,
  onClearFavorites,
  onOpenEntry,
  onToggleFavorite,
  text,
}) {
  if (favorites.length === 0) {
    return (
      <EmptyState
        description={text.favorites.emptyDescription}
        icon={<StarIcon className="size-14" filled />}
        title={text.favorites.emptyTitle}
      />
    );
  }

  return (
    <section className="space-y-4 animate-fade-in">
      <div className="flex items-center justify-between px-1">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-[#3B82F6]">
            {text.favorites.title}
          </p>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-300">
            {text.favorites.items(favorites.length)}
          </p>
        </div>

        <button
          className="rounded-full border border-slate-200/70 bg-white/65 px-4 py-2 text-sm font-semibold text-slate-700 transition duration-300 hover:border-rose-400/40 hover:text-rose-500 active:scale-95 dark:border-white/10 dark:bg-white/8 dark:text-slate-100 dark:hover:text-rose-300"
          onClick={onClearFavorites}
          type="button"
        >
          {text.favorites.clearAll}
        </button>
      </div>

      {favorites.map((entry, index) => (
        <div
          className="animate-rise-in"
          key={entry.id}
          style={{ animationDelay: `${index * 40}ms` }}
        >
          <WordCard
            actionLabels={{
              removeFavorite: text.common.removeFavorite,
              saveFavorite: text.common.saveFavorite,
            }}
            entry={entry}
            isFavorite
            onOpen={onOpenEntry}
            onToggleFavorite={onToggleFavorite}
            primaryLabel="EN"
            secondaryLabel={entry.uzb || "-"}
            tertiaryLabel={entry.type || null}
            title={entry.eng}
          />
        </div>
      ))}
    </section>
  );
}
