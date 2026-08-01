import { useEffect, useMemo, useState } from "react";
import { createWordId } from "../../utils/favorites.js";
import "./search.css";

const vocabularyModules = import.meta.glob("../../vocabularies/*.js");

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

function formatTran(tran) {
  if (!tran) {
    return "";
  }

  return tran.replace(/^\/+|\/+$/g, "").trim();
}

function HeartIcon({ filled = false }) {
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

async function loadVocabulary(letter) {
  const modulePath = `../../vocabularies/${letter}.js`;
  const loader = vocabularyModules[modulePath];

  if (!loader) {
    return [];
  }

  const module = await loader();
  return normalizeVocabulary(module.default);
}

function Search({ favorites, language, onToggleFavorite }) {
  const [word, setWord] = useState("");
  const [vocabulary, setVocabulary] = useState([]);

  const t = language === "en" ? texts.en : texts.uz;

  useEffect(() => {
    const input = word.trim().toLowerCase();
    if (!input || !/^[a-z]$/.test(input[0])) {
      return;
    }

    const letter = input[0];
    let isCancelled = false;

    loadVocabulary(letter)
      .then((items) => {
        if (!isCancelled) {
          setVocabulary(items);
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
  const filtered = useMemo(() => {
    if (!normalizedWord) {
      return [];
    }

    const activeVocabulary =
      /^[a-z]$/.test(normalizedWord[0]) ? vocabulary : [];

    return activeVocabulary
      .filter((obj) => {
        const engLower = obj.eng.toLowerCase();
        const uzbLower = obj.uzb.toLowerCase();
        return (
          engLower.startsWith(normalizedWord) || uzbLower.includes(normalizedWord)
        );
      })
      .sort((a, b) => {
        const aEng = a.eng.toLowerCase();
        const bEng = b.eng.toLowerCase();
        const aStartsWith = aEng.startsWith(normalizedWord);
        const bStartsWith = bEng.startsWith(normalizedWord);

        if (aStartsWith && !bStartsWith) return -1;
        if (!aStartsWith && bStartsWith) return 1;
        return aEng.localeCompare(bEng);
      });
  }, [normalizedWord, vocabulary]);

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
          {filtered.map((obj, index) => {
            const wordId = createWordId(obj);
            const isFavorite = favoriteIds.has(wordId);

            return (
              <div className="result-item" key={wordId || `${obj.eng}-${index}`}>
                <div className="result-head">
                  <h3>
                    {index + 1}) {obj.eng}
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
                  <b>{obj.type}</b> | {obj.uzb}
                  {obj.tran && (
                    <span className="result-spelling">
                      /{formatTran(obj.tran)}/
                    </span>
                  )}
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
