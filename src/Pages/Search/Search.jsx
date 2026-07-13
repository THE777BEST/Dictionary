import { useEffect, useMemo, useState } from "react";
import { createWordId } from "../../utils/favorites.js";
import "./search.css";

const texts = {
  en: {
    noResult: "No words found",
    placeholder: "Type a word...",
    removeFavorite: "Remove from favorites",
    saveFavorite: "Save to favorites",
  },
  uz: {
    noResult: "So'z topilmadi",
    placeholder: "So'zni kiriting...",
    removeFavorite: "Sevimlidan o'chirish",
    saveFavorite: "Sevimliga qo'shish",
  },
};

function normalizeVocabulary(data) {
  if (!Array.isArray(data)) {
    return [];
  }

  return data
    .filter((item) => item && typeof item === "object" && !Array.isArray(item))
    .map((item) => ({
      ...item,
      eng: String(item.eng ?? "").trim(),
      tran: String(item.tran ?? "").trim(),
      type: String(item.type ?? "").trim(),
      uzb: String(item.uzb ?? "").trim(),
    }))
    .filter((item) => item.eng.length > 0);
}

function HeartIcon({ filled }) {
  return (
    <svg
      aria-hidden="true"
      fill={filled ? "currentColor" : "none"}
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      viewBox="0 0 24 24"
    >
      <path d="M12.1 20.3 4.9 13a4.8 4.8 0 0 1 0-6.9 4.7 4.7 0 0 1 6.8 0l.3.3.3-.3a4.7 4.7 0 0 1 6.8 0 4.8 4.8 0 0 1 0 6.9l-7.2 7.3a.5.5 0 0 1-.8 0Z" />
    </svg>
  );
}

function Search({ favorites, language, onToggleFavorite }) {
  const [word, setWord] = useState("");
  const [vocabulary, setVocabulary] = useState([]);

  const t = language === "en" ? texts.en : texts.uz;

  useEffect(() => {
    const input = word.trim().toLowerCase();
    if (!input) {
      setVocabulary([]);
      return;
    }

    const letter = input[0];
    if (!/^[a-z]$/.test(letter)) {
      setVocabulary([]);
      return;
    }

    let isCancelled = false;

    import(`../../vocabularies/${letter}.js`)
      .then((module) => {
        if (!isCancelled) {
          setVocabulary(normalizeVocabulary(module.default));
        }
      })
      .catch(() => {
        if (!isCancelled) {
          setVocabulary([]);
        }
      });

    return () => {
      isCancelled = true;
    };
  }, [word]);

  const normalizedWord = word.trim().toLowerCase();
  const filtered =
    normalizedWord === ""
      ? []
      : vocabulary.filter((obj) =>
          obj.eng.toLowerCase().startsWith(normalizedWord)
        );

  const favoriteIds = useMemo(
    () => new Set(favorites.map((favorite) => favorite.id)),
    [favorites]
  );

  return (
    <div className="search-container">
      <input
        onChange={(e) => setWord(e.target.value)}
        placeholder={t.placeholder}
        type="text"
        value={word}
      />

      {normalizedWord !== "" && filtered.length === 0 && (
        <p className="search-hint">{t.noResult}</p>
      )}

      {filtered.length > 0 && (
        <div className="results">
          {filtered.map((obj, i) => {
            const wordId = createWordId(obj);
            const isFavorite = favoriteIds.has(wordId);

            return (
              <div className="result-item" key={wordId || `${obj.eng}-${i}`}>
                <div className="result-head">
                  <h3>
                    {i + 1}) {obj.eng}
                  </h3>
                  <button
                    aria-label={isFavorite ? t.removeFavorite : t.saveFavorite}
                    className={`ios-favorite-btn ${isFavorite ? "is-favorite" : ""}`}
                    onClick={() => onToggleFavorite(obj)}
                    type="button"
                  >
                    <HeartIcon filled={isFavorite} />
                  </button>
                </div>

                <p>
                  <b>{obj.type}</b> | {obj.uzb} | <i>/{obj.tran}/</i>
                </p>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default Search;
