import { PlayIcon, XIcon } from "./Icons.jsx";

function ChoiceButton({
  active,
  children,
  disabled = false,
  onClick,
  state = "idle",
}) {
  const palette =
    state === "correct"
      ? "border-emerald-400 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300"
      : state === "incorrect"
        ? "border-rose-400 bg-rose-500/10 text-rose-700 dark:text-rose-300"
        : active
          ? "border-[#3B82F6]/40 bg-[#3B82F6]/10 text-[#1d4ed8] dark:text-white"
          : "border-slate-200/70 bg-white/80 text-slate-700 hover:border-[#3B82F6]/35 hover:text-[#3B82F6] dark:border-white/10 dark:bg-white/8 dark:text-slate-100";

  return (
    <button
      className={`w-full rounded-[18px] border px-4 py-3 text-left text-sm font-medium transition active:scale-[0.99] ${palette}`}
      disabled={disabled}
      onClick={onClick}
      type="button"
    >
      {children}
    </button>
  );
}

export function QuizPanel({
  active,
  answer,
  choices,
  finished,
  onAnswer,
  onCountChange,
  onClose,
  onNext,
  onStart,
  onSkip,
  questionLimit,
  score,
  text,
  title,
}) {
  const questionOptions = [5, 10, 20, 30];

  if (!active) {
    return (
      <section className="rounded-[30px] border border-slate-200/70 bg-white/78 p-4 shadow-[0_16px_40px_rgba(15,23,42,0.08)] backdrop-blur-xl dark:border-white/10 dark:bg-white/10 dark:shadow-[0_18px_45px_rgba(2,12,25,0.3)]">
        <div className="flex items-center justify-between gap-3">
          <div className="min-w-0">
            <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-[#3B82F6]">
              {text.study.title}
            </p>
            <h2 className="mt-1 text-xl font-semibold text-slate-950 dark:text-white">
              {finished ? text.study.finishedTitle : title}
            </h2>
            {finished ? (
              <p className="mt-2 text-sm text-slate-500 dark:text-slate-300">
                {text.study.finalScore(score.correct, score.total)}
              </p>
            ) : null}
          </div>
          <button
            className="inline-flex size-11 items-center justify-center rounded-2xl border border-[#3B82F6]/20 bg-[#3B82F6] text-white shadow-[0_12px_28px_rgba(59,130,246,0.3)] transition active:scale-95"
            onClick={() => onStart(questionLimit)}
            type="button"
            title={text.study.startQuiz}
          >
            <PlayIcon className="size-5" />
          </button>
        </div>
        <p className="mt-3 text-sm leading-6 text-slate-600 dark:text-slate-300">
          {finished ? text.study.tryAgain : text.study.wordBank}
        </p>
        <div className="mt-4">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500 dark:text-slate-300">
            {text.study.questionCount}
          </p>
          <div className="mt-2 grid grid-cols-4 gap-2">
            {questionOptions.map((count) => {
              const isSelected = questionLimit === count;

              return (
                <button
                  aria-pressed={isSelected}
                  className={`rounded-2xl border px-2 py-2.5 text-sm font-semibold transition active:scale-95 ${
                    isSelected
                      ? "border-[#3B82F6]/30 bg-[#3B82F6] text-white shadow-[0_10px_24px_rgba(59,130,246,0.24)]"
                      : "border-slate-200/70 bg-white/70 text-slate-700 hover:border-[#3B82F6]/35 dark:border-white/10 dark:bg-white/8 dark:text-slate-100"
                  }`}
                  key={count}
                  onClick={() => onCountChange(count)}
                  type="button"
                >
                  <span className="block">{count}</span>
                  {isSelected ? (
                    <span className="mt-0.5 block text-[10px] font-medium">
                      {text.study.selected}
                    </span>
                  ) : null}
                </button>
              );
            })}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="animate-rise-in rounded-[30px] border border-[#3B82F6]/18 bg-[linear-gradient(180deg,rgba(255,255,255,0.88),rgba(239,246,255,0.84))] p-4 shadow-[0_18px_44px_rgba(15,23,42,0.12)] backdrop-blur-xl dark:border-white/10 dark:bg-[linear-gradient(180deg,rgba(15,23,42,0.92),rgba(15,23,42,0.72))]">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-[#3B82F6]">
            {text.study.title}
          </p>
          <h2 className="mt-1 text-xl font-semibold text-slate-950 dark:text-white">
            {title}
          </h2>
          <p className="mt-2 text-sm text-slate-500 dark:text-slate-300">
            {text.study.progress(score.current, questionLimit)} /{" "}
            {text.study.score(score.correct, score.total)}
          </p>
        </div>
        <button
          className="inline-flex size-11 items-center justify-center rounded-2xl border border-slate-200/70 bg-white/80 text-slate-500 transition active:scale-95 dark:border-white/10 dark:bg-white/8 dark:text-slate-200"
          onClick={onClose}
          type="button"
        >
          <XIcon className="size-5" />
        </button>
      </div>

      <div className="mt-4 rounded-[24px] border border-slate-200/70 bg-white/80 p-4 dark:border-white/10 dark:bg-white/[0.06]">
        <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#3B82F6]">
          {answer.promptLabel}
        </p>
        <h3 className="mt-2 text-2xl font-semibold tracking-tight text-slate-950 dark:text-white">
          {answer.prompt}
        </h3>
      </div>

      <div className="mt-3 grid gap-2">
        {choices.map((choice) => (
          <ChoiceButton
            active={choice.value === answer.selectedValue}
            disabled={answer.revealed}
            key={choice.value}
            onClick={() => (answer.revealed ? null : onAnswer(choice.value))}
            state={choice.state}
          >
            {choice.label}
          </ChoiceButton>
        ))}
      </div>

      <div className="mt-3 flex items-center justify-between gap-2">
        <p
          className={`text-sm font-medium ${
            answer.revealed
              ? answer.correct
                ? "text-emerald-500"
                : "text-rose-500"
              : "text-slate-500 dark:text-slate-300"
          }`}
        >
          {answer.feedback}
        </p>
        <div className="flex gap-2">
          <button
            className="rounded-full border border-slate-200/70 bg-white/80 px-4 py-2 text-sm font-semibold text-slate-700 transition active:scale-95 dark:border-white/10 dark:bg-white/8 dark:text-slate-100"
            disabled={answer.revealed}
            onClick={onSkip}
            type="button"
          >
            {text.study.revealAnswer}
          </button>
          <button
            className="rounded-full border border-[#3B82F6]/20 bg-[#3B82F6] px-4 py-2 text-sm font-semibold text-white transition active:scale-95 disabled:cursor-not-allowed disabled:opacity-45"
            disabled={!answer.revealed}
            onClick={onNext}
            type="button"
          >
            {score.current >= questionLimit
              ? text.study.finishQuiz
              : text.study.nextQuestion}
          </button>
        </div>
      </div>
    </section>
  );
}
