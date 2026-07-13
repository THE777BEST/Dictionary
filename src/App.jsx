import { useEffect, useMemo, useState } from "react";
import { useDebouncedValue } from "./hooks/useDebouncedValue.js";
import { copy } from "./lib/copy.js";
import { searchDictionary } from "./lib/dictionary.js";
import { BottomNavigation } from "./ui/BottomNavigation.jsx";
import { FavoritesScreen } from "./ui/FavoritesScreen.jsx";
import { SearchScreen } from "./ui/SearchScreen.jsx";
import { SettingsScreen } from "./ui/SettingsScreen.jsx";
import { TopBar } from "./ui/TopBar.jsx";
import { AIExplanationModal } from "./ui/AIExplanationModal.jsx";
import { toFavoriteWord } from "./utils/favorites.js";

const STORAGE_KEYS = {
  appLanguage: "lugat_app_language",
  favorites: "lugat_favorites",
  searchDirection: "lugat_search_direction",
  theme: "lugat_theme",
};

function readStoredOption(key, fallback, allowedOptions) {
  try {
    const saved = localStorage.getItem(key);
    return allowedOptions.includes(saved) ? saved : fallback;
  } catch {
    return fallback;
  }
}

function readStoredFavorites() {
  try {
    const saved = localStorage.getItem(STORAGE_KEYS.favorites);
    if (!saved) {
      return [];
    }

    const parsed = JSON.parse(saved);
    if (!Array.isArray(parsed)) {
      return [];
    }

    return parsed
      .map((item) => toFavoriteWord(item))
      .filter((item) => item.id.length > 0);
  } catch {
    return [];
  }
}

function App() {
  const [activeTab, setActiveTab] = useState("search");
  const [theme, setTheme] = useState(() =>
    readStoredOption(STORAGE_KEYS.theme, "dark", ["light", "dark"])
  );
  const [appLanguage, setAppLanguage] = useState(() =>
    readStoredOption(STORAGE_KEYS.appLanguage, "en", ["en", "uz"])
  );
  const [searchDirection, setSearchDirection] = useState(() =>
    readStoredOption(STORAGE_KEYS.searchDirection, "en", ["en", "uz"])
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [favorites, setFavorites] = useState(readStoredFavorites);
  const [isSearching, setIsSearching] = useState(false);
  const [explanationEntry, setExplanationEntry] = useState(null);

  const debouncedQuery = useDebouncedValue(searchQuery, 280);
  const text = copy[appLanguage];
  const favoriteIds = useMemo(
    () => new Set(favorites.map((item) => item.id)),
    [favorites]
  );

  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
    document.documentElement.style.colorScheme = theme;
    localStorage.setItem(STORAGE_KEYS.theme, theme);
  }, [theme]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.appLanguage, appLanguage);
  }, [appLanguage]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.searchDirection, searchDirection);
  }, [searchDirection]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.favorites, JSON.stringify(favorites));
  }, [favorites]);

  useEffect(() => {
    const normalizedQuery = debouncedQuery.trim();

    if (!normalizedQuery) {
      setSearchResults([]);
      setIsSearching(false);
      return;
    }

    let isCancelled = false;

    async function runSearch() {
      setIsSearching(true);

      try {
        const nextResults = await searchDictionary(
          normalizedQuery,
          searchDirection
        );

        if (!isCancelled) {
          setSearchResults(nextResults);
        }
      } catch {
        if (!isCancelled) {
          setSearchResults([]);
        }
      } finally {
        if (!isCancelled) {
          setIsSearching(false);
        }
      }
    }

    runSearch();

    return () => {
      isCancelled = true;
    };
  }, [debouncedQuery, searchDirection]);

  function toggleFavorite(word) {
    const favoriteWord = toFavoriteWord(word);
    if (!favoriteWord.id) {
      return;
    }

    setFavorites((prev) => {
      const alreadyFavorite = prev.some((item) => item.id === favoriteWord.id);
      if (alreadyFavorite) {
        return prev.filter((item) => item.id !== favoriteWord.id);
      }

      return [favoriteWord, ...prev];
    });
  }

  function clearFavorites() {
    setFavorites([]);
  }

  const hasSearchValue = searchQuery.trim().length > 0;
  const isTyping = hasSearchValue && searchQuery.trim() !== debouncedQuery.trim();

  return (
    <div className="relative min-h-screen overflow-hidden bg-[linear-gradient(180deg,#eff6ff_0%,#dbeafe_42%,#bfdbfe_100%)] text-slate-900 transition-colors duration-300 dark:bg-[linear-gradient(180deg,#0f2027_0%,#203a43_48%,#2c5364_100%)] dark:text-slate-50">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute left-1/2 top-[-7rem] h-52 w-52 -translate-x-1/2 rounded-full bg-[#3B82F6]/25 blur-3xl dark:bg-[#3B82F6]/35" />
        <div className="absolute bottom-10 left-[-3rem] h-44 w-44 rounded-full bg-cyan-300/20 blur-3xl dark:bg-cyan-400/15" />
        <div className="absolute bottom-24 right-[-4rem] h-60 w-60 rounded-full bg-sky-400/15 blur-3xl dark:bg-sky-500/20" />
      </div>

      <div className="relative mx-auto min-h-screen w-full max-w-[430px] px-4">
        <TopBar
          activeTab={activeTab}
          onSearchDirectionChange={setSearchDirection}
          onSearchQueryChange={setSearchQuery}
          searchDirection={searchDirection}
          searchQuery={searchQuery}
          text={text}
        />

        <main className="pb-[calc(env(safe-area-inset-bottom)+7.25rem)] pt-[calc(env(safe-area-inset-top)+7.25rem)]">
          {activeTab === "search" ? (
            <SearchScreen
              favoriteIds={favoriteIds}
              isSearching={isSearching}
              isTyping={isTyping}
              onOpenExplanation={setExplanationEntry}
              onToggleFavorite={toggleFavorite}
              query={searchQuery}
              results={searchResults}
              searchDirection={searchDirection}
              text={text}
            />
          ) : null}

          {activeTab === "favorites" ? (
            <FavoritesScreen
              favorites={favorites}
              onClearFavorites={clearFavorites}
              onOpenExplanation={setExplanationEntry}
              onToggleFavorite={toggleFavorite}
              text={text}
            />
          ) : null}

          {activeTab === "settings" ? (
            <SettingsScreen
              appLanguage={appLanguage}
              onLanguageChange={setAppLanguage}
              onThemeChange={setTheme}
              text={text}
              theme={theme}
            />
          ) : null}
        </main>

        <BottomNavigation
          activeTab={activeTab}
          onChange={setActiveTab}
          text={text}
        />

        {explanationEntry ? (
          <AIExplanationModal
            entry={explanationEntry}
            isFavorite={favoriteIds.has(explanationEntry.id)}
            language={appLanguage}
            onClose={() => setExplanationEntry(null)}
            onToggleFavorite={toggleFavorite}
          />
        ) : null}
      </div>
    </div>
  );
}

export default App;
