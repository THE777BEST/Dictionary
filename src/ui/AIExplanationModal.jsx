import { useEffect } from "react";
import { createPortal } from "react-dom";
import { BookOpen, Volume2, X } from "lucide-react";
import { StarIcon } from "./Icons.jsx";

function asList(value) {
  if (Array.isArray(value)) {
    return value.filter((item) => String(item).trim()).map(String);
  }

  if (!value || typeof value !== "string") {
    return [];
  }

  return value
    .replace(/<[^>]*>/g, " ")
    .split(/[;,\n]/)
    .map((item) => item.trim())
    .filter(Boolean);
}

function DetailSection({ children, title }) {
  if (!children) {
    return null;
  }

  return (
    <section className="rounded-[22px] border border-white/10 bg-white/5 p-4 shadow-[0_12px_28px_rgba(15,23,42,0.06)]">
      <div className="flex items-center gap-2">
        <BookOpen aria-hidden="true" className="size-4 text-[#60a5fa]" />
        <h3 className="text-sm font-semibold uppercase tracking-[0.18em] text-[#60a5fa]">
          {title}
        </h3>
      </div>
      <div className="mt-3">{children}</div>
    </section>
  );
}

function TagList({ items }) {
  if (items.length === 0) {
    return null;
  }

  return (
    <div className="flex flex-wrap gap-2">
      {items.slice(0, 10).map((item) => (
        <span
          className="inline-flex max-w-full items-center rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-medium text-slate-100"
          key={item}
        >
          {item}
        </span>
      ))}
    </div>
  );
}

function createExplanation(entry, language) {
  const word = entry.eng || entry.uzb;
  const translation = entry.uzb || entry.eng;

  if (!word || !translation) {
    return "";
  }

  return language === "uz"
    ? `${translation} uchun AI izohi.`
    : `${word} means ${translation}.`;
}

export function AIExplanationModal({
  entry,
  isFavorite,
  language,
  onClose,
  onToggleFavorite,
}) {
  useEffect(() => {
    function onKeyDown(event) {
      if (event.key === "Escape") {
        onClose();
      }
    }

    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [onClose]);

  useEffect(() => {
    const { body } = document;
    const previousOverflow = body.style.overflow;
    body.style.overflow = "hidden";

    return () => {
      body.style.overflow = previousOverflow;
    };
  }, []);

  if (!entry) {
    return null;
  }

  const examples = asList(entry.examples || entry.exam);
  const synonyms = asList(entry.syn);
  const antonyms = asList(entry.ant);
  const pronunciation = entry.pronunciation || entry.tran;
  const explanation = createExplanation(entry, language);

  function speakWord() {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) {
      return;
    }

    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(entry.eng);
    utterance.lang = "en-US";
    window.speechSynthesis.speak(utterance);
  }

  return createPortal(
    <div
      aria-labelledby="ai-explanation-title"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 p-4 backdrop-blur-md animate-fade-in sm:p-6"
      onClick={onClose}
      role="dialog"
    >
      <section
        className="max-h-[calc(100dvh-2rem)] w-full max-w-[34rem] overflow-y-auto rounded-[28px] border border-white/10 bg-[linear-gradient(180deg,rgba(15,23,42,0.98),rgba(15,23,42,0.92))] p-4 text-white shadow-[0_30px_80px_rgba(2,6,23,0.7)] animate-rise-in sm:max-h-[calc(100dvh-3rem)] sm:p-5"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-[#60a5fa]">
              AI Explanation
            </p>
            <h2
              className="mt-1 truncate text-2xl font-semibold tracking-tight text-white"
              id="ai-explanation-title"
            >
              {entry.eng}
            </h2>
            {pronunciation ? (
              <p className="mt-2 text-sm text-slate-300">
                {pronunciation}
              </p>
            ) : null}
            {entry.type ? (
              <p className="mt-1 text-sm font-medium text-slate-200">
                {entry.type}
              </p>
            ) : null}
          </div>

          <div className="flex shrink-0 gap-2">
            <button
              aria-label="Pronunciation"
              className="inline-flex size-11 items-center justify-center rounded-2xl border border-white/10 bg-white/5 text-slate-200 transition active:scale-95 hover:bg-white/10 hover:text-[#93c5fd]"
              onClick={speakWord}
              type="button"
            >
              <Volume2 aria-hidden="true" className="size-5" />
            </button>
            <button
              aria-label={isFavorite ? "Remove from favorites" : "Save to favorites"}
              className={`inline-flex size-11 items-center justify-center rounded-2xl border transition active:scale-95 ${
                isFavorite
                  ? "border-[#3B82F6]/45 bg-[#3B82F6] text-white shadow-[0_10px_24px_rgba(59,130,246,0.35)]"
                  : "border-white/10 bg-white/5 text-slate-200 hover:bg-white/10 hover:text-[#93c5fd]"
              }`}
              onClick={() => onToggleFavorite(entry)}
              type="button"
            >
              <StarIcon className="size-5" filled={isFavorite} />
            </button>
            <button
              aria-label="Close"
              className="inline-flex size-11 items-center justify-center rounded-2xl border border-white/10 bg-white/5 text-slate-200 transition active:scale-95 hover:bg-white/10 hover:text-white"
              onClick={onClose}
              type="button"
            >
              <X aria-hidden="true" className="size-5" />
            </button>
          </div>
        </div>

        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          <DetailSection title="AI Explanation">
            {explanation ? (
              <p className="text-sm leading-6 text-slate-200">
                {explanation}
              </p>
            ) : null}
          </DetailSection>
          <DetailSection title="Definitions">
            {entry.uzb ? (
              <p className="text-sm leading-6 text-slate-200">
                {entry.uzb}
              </p>
            ) : null}
          </DetailSection>
          <DetailSection title="Examples">
            {examples.length ? (
              <ul className="space-y-2">
                {examples.slice(0, 3).map((example) => (
                  <li
                    className="rounded-2xl border border-white/10 bg-white/5 px-3 py-2 text-sm leading-6 text-slate-200"
                    key={example}
                  >
                    {example}
                  </li>
                ))}
              </ul>
            ) : null}
          </DetailSection>
          {synonyms.length ? (
            <DetailSection title="Synonyms">
              <TagList items={synonyms} />
            </DetailSection>
          ) : null}
          {antonyms.length ? (
            <DetailSection title="Antonyms">
              <TagList items={antonyms} />
            </DetailSection>
          ) : null}
        </div>
      </section>
    </div>,
    document.body
  );
}
