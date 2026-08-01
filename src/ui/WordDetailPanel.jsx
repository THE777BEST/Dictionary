import { BrainIcon, PlayIcon, StarIcon, XIcon, VolumeIcon } from "./Icons.jsx";

function Chip({ children }) {
  return (
    <span className="inline-flex max-w-full items-center rounded-full border border-slate-200/70 bg-slate-900/[0.04] px-3 py-1 text-xs font-medium text-slate-700 dark:border-white/10 dark:bg-white/8 dark:text-slate-100">
      {children}
    </span>
  );
}

function Section({ icon, title, children }) {
  return (
    <section className="rounded-[22px] border border-slate-200/70 bg-white/72 p-4 shadow-[0_12px_28px_rgba(15,23,42,0.06)] dark:border-white/10 dark:bg-white/[0.06]">
      <div className="flex items-center gap-2">
        {icon}
        <h3 className="text-sm font-semibold uppercase tracking-[0.18em] text-[#3B82F6]">
          {title}
        </h3>
      </div>
      <div className="mt-3">{children}</div>
    </section>
  );
}

export function WordDetailPanel({
  aiInsights,
  entry,
  isFavorite,
  onClose,
  onSpeak,
  onToggleFavorite,
  text,
}) {
  const definition = aiInsights?.definition?.trim();
  const aiExamples = aiInsights?.examples ?? [];
  const synonyms = aiInsights?.synonyms ?? entry.syn ?? [];
  const antonyms = aiInsights?.antonyms ?? entry.ant ?? [];
  const pronunciation = aiInsights?.pronunciation || entry.pronunciation || entry.tran;

  return (
    <section className="animate-rise-in rounded-[30px] border border-[#3B82F6]/18 bg-[linear-gradient(180deg,rgba(59,130,246,0.14),rgba(255,255,255,0.78))] p-4 shadow-[0_18px_44px_rgba(15,23,42,0.12)] backdrop-blur-xl dark:border-white/10 dark:bg-[linear-gradient(180deg,rgba(15,23,42,0.92),rgba(15,23,42,0.72))] dark:shadow-[0_22px_50px_rgba(2,12,25,0.38)]">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-[#3B82F6]">
            {text.common.ai}
          </p>
          <h2 className="mt-1 truncate text-2xl font-semibold tracking-tight text-slate-950 dark:text-white">
            {entry.eng}
          </h2>
          <p className="mt-2 text-base font-medium text-slate-700 dark:text-slate-100">
            {entry.uzb || "-"}
          </p>
          {pronunciation ? (
            <p className="mt-2 text-sm text-slate-500 dark:text-slate-300">
              {pronunciation}
            </p>
          ) : null}
        </div>

        <div className="flex shrink-0 flex-col gap-2">
          <button
            aria-label={text.common.pronunciation}
            className="inline-flex size-11 items-center justify-center rounded-2xl border border-slate-200/70 bg-white/80 text-slate-600 transition active:scale-95 hover:text-[#3B82F6] dark:border-white/10 dark:bg-white/8 dark:text-slate-200"
            onClick={() => onSpeak?.(entry)}
            type="button"
          >
            <VolumeIcon className="size-5" />
          </button>
          <button
            aria-label={isFavorite ? text.common.removeFavorite : text.common.saveFavorite}
            className={`inline-flex size-11 items-center justify-center rounded-2xl border transition active:scale-95 ${
              isFavorite
                ? "border-[#3B82F6]/40 bg-[#3B82F6] text-white shadow-[0_10px_24px_rgba(59,130,246,0.35)]"
                : "border-slate-200/70 bg-white/80 text-slate-500 hover:text-[#3B82F6] dark:border-white/10 dark:bg-white/8 dark:text-slate-200"
            }`}
            onClick={() => onToggleFavorite(entry)}
            type="button"
          >
            <StarIcon className="size-5" filled={isFavorite} />
          </button>
          <button
            aria-label={text.common.close}
            className="inline-flex size-11 items-center justify-center rounded-2xl border border-slate-200/70 bg-white/80 text-slate-500 transition active:scale-95 hover:text-slate-900 dark:border-white/10 dark:bg-white/8 dark:text-slate-200 dark:hover:text-white"
            onClick={onClose}
            type="button"
          >
            <XIcon className="size-5" />
          </button>
        </div>
      </div>

      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        <Section icon={<BrainIcon className="size-4" />} title={text.common.definition}>
          <p className="text-sm leading-6 text-slate-700 dark:text-slate-100">
            {definition || `${entry.eng} - ${entry.uzb || "-"}`}
          </p>
        </Section>

        <Section icon={<PlayIcon className="size-4" />} title={text.common.examples}>
          {aiExamples.length > 0 ? (
            <ul className="space-y-2">
              {aiExamples.map((example) => (
                <li
                  className="rounded-2xl border border-slate-200/70 bg-slate-900/[0.03] px-3 py-2 text-sm leading-6 text-slate-700 dark:border-white/10 dark:bg-white/[0.04] dark:text-slate-100"
                  key={example}
                >
                  {example}
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm leading-6 text-slate-500 dark:text-slate-300">
              {text.common.loading}
            </p>
          )}
        </Section>
      </div>

      <div className="mt-3 grid gap-3 sm:grid-cols-2">
        <Section icon={<BrainIcon className="size-4" />} title={text.common.synonyms}>
          <div className="flex flex-wrap gap-2">
            {synonyms.length > 0 ? (
              synonyms.slice(0, 10).map((item) => <Chip key={item}>{item}</Chip>)
            ) : (
              <p className="text-sm text-slate-500 dark:text-slate-300">-</p>
            )}
          </div>
        </Section>
        <Section icon={<BrainIcon className="size-4" />} title={text.common.antonyms}>
          <div className="flex flex-wrap gap-2">
            {antonyms.length > 0 ? (
              antonyms.slice(0, 10).map((item) => <Chip key={item}>{item}</Chip>)
            ) : (
              <p className="text-sm text-slate-500 dark:text-slate-300">-</p>
            )}
          </div>
        </Section>
      </div>

      {entry.examples?.length ? (
        <section className="mt-3 rounded-[22px] border border-slate-200/70 bg-white/72 p-4 dark:border-white/10 dark:bg-white/[0.06]">
          <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#3B82F6]">
            {text.common.examples}
          </p>
          <ul className="mt-3 space-y-2 text-sm leading-6 text-slate-700 dark:text-slate-100">
            {entry.examples.slice(0, 3).map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </section>
      ) : null}
    </section>
  );
}
