import Coffee from "../Pages/Coffee/Coffee.jsx";
import { SparkBookIcon } from "./Icons.jsx";
import { SegmentedControl } from "./SegmentedControl.jsx";

function SettingCard({ children, subtitle, title }) {
  return (
    <section className="rounded-[24px] border border-slate-200/75 bg-white/88 p-5 shadow-[0_12px_30px_rgba(15,23,42,0.08)] backdrop-blur-xl dark:border-white/10 dark:bg-white/[0.08] dark:shadow-[0_14px_34px_rgba(2,12,25,0.22)]">
      <div className="flex items-start gap-3">
        <div className="flex size-11 shrink-0 items-center justify-center rounded-2xl bg-[#3B82F6]/10 text-[#3B82F6]">
          <SparkBookIcon className="size-5" />
        </div>
        <div className="min-w-0 flex-1">
          <h2 className="text-base font-semibold text-slate-900 dark:text-white">
            {title}
          </h2>
          {subtitle ? (
            <p className="mt-1 text-sm leading-6 text-slate-500 dark:text-slate-300">
              {subtitle}
            </p>
          ) : null}
        </div>
      </div>
      <div className="mt-4">{children}</div>
    </section>
  );
}

function SettingField({ label, children }) {
  return (
    <div className="space-y-2">
      <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-500 dark:text-slate-400">
        {label}
      </p>
      {children}
    </div>
  );
}

export function SettingsScreen({
  appLanguage,
  fontSize,
  onFontSizeChange,
  onLanguageChange,
  onThemeChange,
  text,
  theme,
}) {
  const fontSizeOptions = [
    { label: text.common.small || "Small", value: "small" },
    { label: text.common.medium || "Medium", value: "medium" },
    { label: text.common.large || "Large", value: "large" },
  ];

  return (
    <section className="space-y-4 animate-fade-in">
      <SettingCard subtitle={text.settings.subtitle} title={text.settings.title}>
        <div className="grid gap-4">
          <SettingField label={text.settings.appLanguage}>
            <SegmentedControl
              ariaLabel={text.settings.appLanguage}
              onChange={onLanguageChange}
              options={[
                { label: text.common.english, value: "en" },
                { label: text.common.uzbek, value: "uz" },
              ]}
              stretch
              value={appLanguage}
            />
          </SettingField>

          <SettingField label={text.settings.theme}>
            <SegmentedControl
              ariaLabel={text.settings.theme}
              onChange={onThemeChange}
              options={[
                { label: text.common.dark, value: "dark" },
                { label: text.common.light, value: "light" },
              ]}
              stretch
              value={theme}
            />
          </SettingField>

          <SettingField label={text.settings.fontSize}>
            <SegmentedControl
              ariaLabel={text.settings.fontSize}
              onChange={onFontSizeChange}
              options={fontSizeOptions}
              stretch
              value={fontSize}
            />
          </SettingField>
        </div>
      </SettingCard>

      <SettingCard title={text.settings.support}>
        <Coffee language={appLanguage} />
      </SettingCard>
    </section>
  );
}
