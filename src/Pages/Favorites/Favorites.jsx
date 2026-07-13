import "./favorites.css";

const texts = {
  en: {
    clearAll: "Clear all",
    emptyDescription:
      "Tap the heart icon near a word in Search, and it will appear here.",
    emptyTitle: "No favorite words yet",
    remove: "Remove from favorites",
    title: "Favorites",
    wordsCount: (count) => `${count} saved words`,
  },
  uz: {
    clearAll: "Hammasini tozalash",
    emptyDescription:
      "Qidiruv bo'limida so'z yonidagi yurakchani bossangiz, u shu yerga saqlanadi.",
    emptyTitle: "Hozircha sevimli so'z yo'q",
    remove: "Sevimlidan o'chirish",
    title: "Sevimli so'zlar",
    wordsCount: (count) => `${count} ta saqlangan so'z`,
  },
};

export default function Favorites({
  favorites,
  language,
  onClearFavorites,
  onRemoveFavorite,
}) {
  const t = language === "en" ? texts.en : texts.uz;

  return (
    <section className="favorites-container">
      <div className="favorites-header">
        <h2>{t.title}</h2>
        {favorites.length > 0 && (
          <button
            className="clear-all-btn"
            onClick={onClearFavorites}
            type="button"
          >
            {t.clearAll}
          </button>
        )}
      </div>

      {favorites.length === 0 ? (
        <div className="favorites-empty">
          <p className="favorites-empty-title">{t.emptyTitle}</p>
          <p>{t.emptyDescription}</p>
        </div>
      ) : (
        <>
          <p className="favorites-count">{t.wordsCount(favorites.length)}</p>
          <div className="favorites-list">
            {favorites.map((word, index) => (
              <article className="favorite-item" key={word.id}>
                <div className="favorite-top">
                  <h3>
                    {index + 1}) {word.eng}
                  </h3>
                  <button
                    aria-label={t.remove}
                    className="remove-favorite-btn"
                    onClick={() => onRemoveFavorite(word.id)}
                    type="button"
                  >
                    <svg
                      aria-hidden="true"
                      fill="none"
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      viewBox="0 0 24 24"
                    >
                      <path d="m6 6 12 12M18 6 6 18" />
                    </svg>
                  </button>
                </div>
                <p>
                  <b>{word.type || "-"}</b> | {word.uzb || "-"} |{" "}
                  <i>/{word.tran || "-"}/</i>
                </p>
              </article>
            ))}
          </div>
        </>
      )}
    </section>
  );
}
