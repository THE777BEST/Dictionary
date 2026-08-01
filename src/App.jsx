import { useEffect, useMemo, useState } from "react";
import { useDebouncedValue } from "./hooks/useDebouncedValue.js";
import { copy } from "./lib/copy.js";
import {
  getAllDictionaryEntries,
  getRandomWord,
  searchDictionary,
  warmDictionaryCache,
} from "./lib/dictionary.js";
import { getAiInsights } from "./lib/ai.js";
import {
  readJsonStorage,
  readStringStorage,
  writeJsonStorage,
} from "./lib/storage.js";
import { BottomNavigation } from "./ui/BottomNavigation.jsx";
import { FavoritesScreen } from "./ui/FavoritesScreen.jsx";
import { SearchScreen } from "./ui/SearchScreen.jsx";
import { SettingsScreen } from "./ui/SettingsScreen.jsx";
import { TopBar } from "./ui/TopBar.jsx";
import { toFavoriteWord } from "./utils/favorites.js";

const STORAGE_KEYS = {
  appLanguage: "lugat_app_language",
  favorites: "lugat_favorites",
  fontSize: "lugat_font_size",
  history: "lugat_search_history",
  recent: "lugat_recent_words",
  searchDirection: "lugat_search_direction",
  theme: "lugat_theme",
};

function readStoredOption(key, fallback, allowedOptions) {
  const saved = readStringStorage(key, fallback);
  return allowedOptions.includes(saved) ? saved : fallback;
}

function readStoredFavorites() {
  const saved = readJsonStorage(STORAGE_KEYS.favorites, []);
  if (!Array.isArray(saved)) {
    return [];
  }

  return saved
    .map((item) => toFavoriteWord(item))
    .filter((item) => item.id.length > 0);
}

function readStoredWordList(key) {
  const saved = readJsonStorage(key, []);
  if (!Array.isArray(saved)) {
    return [];
  }

  return saved
    .map((item) => toFavoriteWord(item))
    .filter((item) => item.id.length > 0);
}

function pushUniqueFront(list, item, limit = 12) {
  const next = [item, ...list.filter((current) => current.id !== item.id)];
  return next.slice(0, limit);
}

function normalizeText(value = "") {
  return String(value).trim().toLowerCase();
}

function shuffleList(list) {
  return [...list].sort(() => Math.random() - 0.5);
}

function pickLabel(entry, direction = "en") {
  return direction === "en" ? entry.eng : entry.uzb || entry.eng;
}

function buildQuizQuestion(entries, direction) {
  const eligible = entries.filter(
    (entry) => String(entry.eng ?? "").trim() && String(entry.uzb ?? "").trim()
  );

  if (eligible.length === 0) {
    return null;
  }

  const source = eligible[Math.floor(Math.random() * eligible.length)];
  const promptLabel = direction === "en" ? "EN" : "UZ";
  const answerLabel = direction === "en" ? source.uzb : source.eng;
  const pool = shuffleList(
    eligible
    .filter((entry) => entry.id !== source.id)
    .map((entry) => (direction === "en" ? entry.uzb : entry.eng))
      .filter(Boolean)
  );

  const uniqueChoices = [answerLabel];
  for (const candidate of pool) {
    if (uniqueChoices.length >= 4) {
      break;
    }
    if (!uniqueChoices.includes(candidate)) {
      uniqueChoices.push(candidate);
    }
  }

  while (uniqueChoices.length < 4 && uniqueChoices.length < entries.length) {
    const fallback = direction === "en"
      ? entries[(Math.random() * entries.length) | 0].uzb
      : entries[(Math.random() * entries.length) | 0].eng;
    if (fallback && !uniqueChoices.includes(fallback)) {
      uniqueChoices.push(fallback);
    }
  }

  const choices = uniqueChoices
    .slice(0, 4)
    .sort(() => Math.random() - 0.5)
    .map((label) => ({
      label,
      state: "idle",
      value: normalizeText(label),
    }));

  return {
    answer: {
      answerLabel: "",
      correct: false,
      feedback: "",
      prompt: pickLabel(source, direction),
      promptLabel,
      revealed: false,
      value: normalizeText(answerLabel),
    },
    choices,
    entry: source,
  };
}

function getChoiceState(choice, answer) {
  if (!answer.revealed) {
    return "idle";
  }

  if (choice.value === answer.value) {
    return "correct";
  }

  if (choice.value === answer.selectedValue && !answer.correct) {
    return "incorrect";
  }

  return "idle";
}

function App() {
  const [activeTab, setActiveTab] = useState("search");
  const [theme, setTheme] = useState(() =>
    readStoredOption(STORAGE_KEYS.theme, "dark", ["light", "dark"])
  );
  const [appLanguage, setAppLanguage] = useState(() =>
    readStoredOption(STORAGE_KEYS.appLanguage, "en", ["en", "uz"])
  );
  const [fontSize, setFontSize] = useState(() =>
    readStoredOption(STORAGE_KEYS.fontSize, "medium", [
      "small",
      "medium",
      "large",
    ])
  );
  const [searchDirection, setSearchDirection] = useState(() =>
    readStoredOption(STORAGE_KEYS.searchDirection, "en", ["en", "uz"])
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [searchError, setSearchError] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [favorites, setFavorites] = useState(readStoredFavorites);
  const [history, setHistory] = useState(() =>
    readStoredWordList(STORAGE_KEYS.history)
  );
  const [recentlyViewed, setRecentlyViewed] = useState(() =>
    readStoredWordList(STORAGE_KEYS.recent)
  );
  const [selectedEntry, setSelectedEntry] = useState(null);
  const [selectedAiInsights, setSelectedAiInsights] = useState(null);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiError, setAiError] = useState("");
  const [wordOfDay, setWordOfDay] = useState(null);
  const [quizState, setQuizState] = useState({
    active: false,
    answer: {
      answerLabel: "",
      correct: false,
      feedback: "",
      prompt: "",
      promptLabel: "",
      revealed: false,
      selectedValue: "",
      value: "",
    },
    choices: [],
    entry: null,
    score: {
      correct: 0,
      current: 0,
      revealed: 0,
      total: 0,
      wrong: 0,
    },
    finished: false,
    questionLimit: 10,
  });

  const debouncedQuery = useDebouncedValue(searchQuery, 280);
  const text = copy[appLanguage];
  const favoriteIds = useMemo(
    () => new Set(favorites.map((item) => item.id)),
    [favorites]
  );

  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
    document.documentElement.style.colorScheme = theme;
    document.body.dataset.theme = theme;
    localStorage.setItem(STORAGE_KEYS.theme, theme);
  }, [theme]);

  useEffect(() => {
    document.documentElement.setAttribute("data-font-size", fontSize);
    localStorage.setItem(STORAGE_KEYS.fontSize, fontSize);
  }, [fontSize]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.appLanguage, appLanguage);
    document.documentElement.lang = appLanguage === "uz" ? "uz" : "en";
  }, [appLanguage]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.searchDirection, searchDirection);
  }, [searchDirection]);

  useEffect(() => {
    writeJsonStorage(STORAGE_KEYS.favorites, favorites);
  }, [favorites]);

  useEffect(() => {
    writeJsonStorage(STORAGE_KEYS.history, history);
  }, [history]);

  useEffect(() => {
    writeJsonStorage(STORAGE_KEYS.recent, recentlyViewed);
  }, [recentlyViewed]);

  useEffect(() => {
    const normalizedQuery = debouncedQuery.trim();

    if (!normalizedQuery) {
      setSearchResults([]);
      setSearchError("");
      setIsSearching(false);
      return;
    }

    let isCancelled = false;
    setSelectedEntry(null);

    async function runSearch() {
      setSearchError("");
      setIsSearching(true);
      try {
        const nextResults = await searchDictionary(
          normalizedQuery,
          searchDirection
        );

        if (isCancelled) {
          return;
        }

        setSearchResults(nextResults);
        setHistory((prev) =>
          pushUniqueFront(prev, { id: normalizedQuery, eng: normalizedQuery }, 12)
        );
      } catch (error) {
        if (!isCancelled) {
          setSearchResults([]);
          setSearchError(error instanceof Error ? error.message : text.common.error);
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
  }, [debouncedQuery, searchDirection, text.common.error]);

  useEffect(() => {
    let cancelled = false;

    async function loadRandomWord() {
      const nextWord = await getRandomWord();
      if (!cancelled) {
        setWordOfDay(nextWord);
      }
    }

    loadRandomWord().catch(() => {});

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    const idle =
      window.requestIdleCallback ??
      ((callback) => window.setTimeout(() => callback({ didTimeout: false, timeRemaining: () => 0 }), 800));

    const cancelIdle =
      window.cancelIdleCallback ?? ((id) => window.clearTimeout(id));

    const taskId = idle(() => {
      warmDictionaryCache().catch(() => {});
    });

    return () => cancelIdle(taskId);
  }, []);

  useEffect(() => {
    document.title = selectedEntry
      ? `${selectedEntry.eng} | Lugat`
      : "Lugat Dictionary";
  }, [selectedEntry]);

  useEffect(() => {
    if (!selectedEntry) {
      setSelectedAiInsights(null);
      setAiError("");
      setAiLoading(false);
      return;
    }

    let cancelled = false;

    async function loadAiInsights() {
      setAiLoading(true);
      setAiError("");

      try {
        const insights = await getAiInsights(selectedEntry, appLanguage);
        if (!cancelled) {
          setSelectedAiInsights(insights);
        }
      } catch (error) {
        if (!cancelled) {
          setAiError(
            error instanceof Error ? error.message : text.common.error
          );
        }
      } finally {
        if (!cancelled) {
          setAiLoading(false);
        }
      }
    }

    loadAiInsights();

    return () => {
      cancelled = true;
    };
  }, [appLanguage, selectedEntry, text.common.error]);

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

  function handleOpenEntry(entry) {
    if (!entry) {
      setSelectedEntry(null);
      return;
    }

    setActiveTab("search");
    setSelectedEntry(entry);
    setRecentlyViewed((prev) => pushUniqueFront(prev, toFavoriteWord(entry), 8));
  }

  function clearFavorites() {
    setFavorites([]);
  }

  function clearHistory() {
    setHistory([]);
  }

  function selectHistoryItem(query) {
    setActiveTab("search");
    setSearchQuery(query);
  }

  function speakEntry(entry) {
    if (!entry || !("speechSynthesis" in window)) {
      return;
    }

    const utterance = new SpeechSynthesisUtterance(entry.eng);
    utterance.lang = "en-US";
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utterance);
  }

  async function startQuiz(questionLimit = quizState.questionLimit) {
    const entries = await getAllDictionaryEntries();
    const nextQuestion = buildQuizQuestion(entries, searchDirection);

    if (!nextQuestion) {
      return;
    }

    setQuizState({
      active: true,
      answer: {
        ...nextQuestion.answer,
        selectedValue: "",
      },
      choices: nextQuestion.choices,
      entry: nextQuestion.entry,
      score: {
        correct: 0,
        current: 1,
        revealed: 0,
        total: 0,
        wrong: 0,
      },
      finished: false,
      questionLimit,
    });
  }

  async function nextQuizQuestion({ preserveScore = true } = {}) {
    if (quizState.score.current >= quizState.questionLimit) {
      setQuizState((prev) => ({ ...prev, active: false, finished: true }));
      return;
    }

    const entries = await getAllDictionaryEntries();
    const nextQuestion = buildQuizQuestion(entries, searchDirection);

    if (!nextQuestion) {
      return;
    }

    setQuizState((prev) => ({
      active: true,
      answer: {
        ...nextQuestion.answer,
        selectedValue: "",
      },
      choices: nextQuestion.choices,
      entry: nextQuestion.entry,
      score: preserveScore
        ? { ...prev.score, current: prev.score.current + 1 }
        : prev.score,
    }));
  }

  function closeQuiz() {
    setQuizState((prev) => ({ ...prev, active: false, finished: false }));
  }

  function setQuizQuestionLimit(questionLimit) {
    setQuizState((prev) => ({ ...prev, questionLimit }));
  }

  function revealQuizAnswer() {
    setQuizState((prev) => ({
      ...prev,
      answer: {
        ...prev.answer,
        correct: false,
        feedback: text.study.answerRevealed,
        revealed: true,
      },
      score: prev.answer.revealed
        ? prev.score
        : {
            ...prev.score,
            revealed: prev.score.revealed + 1,
            total: prev.score.total + 1,
          },
    }));
  }

  function answerQuiz(choiceValue) {
    setQuizState((prev) => {
      const nextCorrect = choiceValue === prev.answer.value;
      const alreadyRevealed = prev.answer.revealed;

      return {
        ...prev,
        answer: {
          ...prev.answer,
          correct: nextCorrect,
          feedback: nextCorrect
            ? text.study.correct
            : text.study.incorrect,
          revealed: true,
          selectedValue: choiceValue,
        },
        score:
          !alreadyRevealed
            ? {
                ...prev.score,
                correct: nextCorrect
                  ? prev.score.correct + 1
                  : prev.score.correct,
                total: prev.score.total + 1,
                wrong: nextCorrect ? prev.score.wrong : prev.score.wrong + 1,
              }
            : prev.score,
      };
    });
  }

  function skipQuiz() {
    revealQuizAnswer();
  }

  const hasSearchValue = searchQuery.trim().length > 0;
  const isTyping = hasSearchValue && searchQuery.trim() !== debouncedQuery.trim();
  const quizPanel = {
    active: quizState.active,
    answer: quizState.answer,
    choices: quizState.choices.map((choice) => ({
      ...choice,
      state: getChoiceState(choice, quizState.answer),
    })),
    finished: quizState.finished,
    onAnswer: answerQuiz,
    onCountChange: setQuizQuestionLimit,
    onClose: closeQuiz,
    onNext: () => nextQuizQuestion(),
    onSkip: skipQuiz,
    onStart: startQuiz,
    questionLimit: quizState.questionLimit,
    score: quizState.score,
  };

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
              aiInsights={
                aiLoading
                  ? { definition: text.common.loading, examples: [], synonyms: [], antonyms: [] }
                  : selectedAiInsights || null
              }
              aiError={aiError}
              favoriteIds={favoriteIds}
              history={history.map((item) => item.eng)}
              isSearching={isSearching}
              isTyping={isTyping}
              onClearHistory={clearHistory}
              onOpenEntry={handleOpenEntry}
              onSelectHistory={selectHistoryItem}
              onSpeak={speakEntry}
              onToggleFavorite={toggleFavorite}
              query={searchQuery}
              quizState={quizPanel}
              recentlyViewed={recentlyViewed}
              results={searchResults}
              searchDirection={searchDirection}
              selectedEntry={selectedEntry}
              searchError={searchError}
              text={text}
              wordOfDay={wordOfDay}
            />
          ) : null}

          {activeTab === "favorites" ? (
            <FavoritesScreen
              favorites={favorites}
              onClearFavorites={clearFavorites}
              onOpenEntry={handleOpenEntry}
              onToggleFavorite={toggleFavorite}
              text={text}
            />
          ) : null}

          {activeTab === "settings" ? (
            <SettingsScreen
              appLanguage={appLanguage}
              fontSize={fontSize}
              onFontSizeChange={setFontSize}
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
      </div>
    </div>
  );
}

export default App;
