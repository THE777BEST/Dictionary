import { useState } from "react";

const cardNumber = "4916 9903 4324 1615";

const texts = {
  en: {
    copied: "Copied",
    copy: "Copy card number",
    message:
      "If this dictionary helps you, you can support development with a small donation.",
    title: "Buy me a coffee",
  },
  uz: {
    copied: "Nusxalandi",
    copy: "Karta raqamini nusxalash",
    message:
      "Agar ushbu lug'at foydali bo'lsa, kichik donat bilan rivojlanishni qo'llab-quvvatlashingiz mumkin.",
    title: "Buy me a coffee",
  },
};

function Coffee({ language = "uz" }) {
  const [isCopied, setIsCopied] = useState(false);
  const t = language === "en" ? texts.en : texts.uz;

  async function handleCopyCard() {
    try {
      await navigator.clipboard.writeText(cardNumber);
      setIsCopied(true);
      window.setTimeout(() => setIsCopied(false), 1500);
    } catch {
      setIsCopied(false);
    }
  }

  return (
    <section className="rounded-[24px] border border-dashed border-slate-200/70 bg-slate-50/70 p-4 text-center dark:border-white/10 dark:bg-slate-950/35">
      <div
        aria-hidden="true"
        className="mx-auto mb-3 flex size-14 items-center justify-center rounded-full bg-[#3B82F6]/12 text-3xl shadow-[0_12px_28px_rgba(59,130,246,0.16)]"
      >
        {"\u2615"}
      </div>
      <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
        {t.title}
      </h3>
      <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">
        {t.message}
      </p>
      <div className="mt-4 flex items-center gap-2 rounded-[18px] border border-slate-200/70 bg-white/80 p-2 dark:border-white/10 dark:bg-white/6">
        <div className="min-w-0 flex-1 rounded-[14px] bg-slate-100 px-3 py-3 text-left font-mono text-[0.95rem] tracking-[0.14em] text-slate-800 dark:bg-slate-900/70 dark:text-slate-100">
          {cardNumber}
        </div>
        <button
          aria-label={t.copy}
          className={`inline-flex size-12 shrink-0 items-center justify-center rounded-[16px] border transition-all duration-300 active:scale-95 ${
            isCopied
              ? "border-emerald-400 bg-emerald-500/12 text-emerald-500"
              : "border-slate-200/70 bg-white text-slate-500 hover:border-[#3B82F6]/35 hover:bg-[#3B82F6]/10 hover:text-[#3B82F6] dark:border-white/10 dark:bg-white/8 dark:text-slate-200"
          }`}
          onClick={handleCopyCard}
          type="button"
        >
          <svg
            aria-hidden="true"
            fill="none"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            className="size-[18px]"
            viewBox="0 0 24 24"
          >
            <rect height="12" rx="2" ry="2" width="12" x="9" y="9" />
            <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
          </svg>
        </button>
      </div>
      <p
        className={`mt-2 min-h-5 text-sm font-medium text-emerald-500 transition-opacity duration-200 ${
          isCopied ? "opacity-100" : "opacity-0"
        }`}
      >
        {t.copied}
      </p>
    </section>
  );
}

export default Coffee;
