import { SearchIcon, SettingsIcon, StarIcon } from "./Icons.jsx";

const navIcons = {
  favorites: StarIcon,
  search: SearchIcon,
  settings: SettingsIcon,
};

export function BottomNavigation({ activeTab, onChange, text }) {
  const items = [
    { id: "search", label: text.nav.search },
    { id: "favorites", label: text.nav.favorites },
    { id: "settings", label: text.nav.settings },
  ];

  return (
    <nav className="fixed inset-x-0 bottom-0 z-30 flex justify-center">
      <div className="w-full max-w-[430px] border-t border-slate-200/70 bg-white/96 px-3 pb-[calc(env(safe-area-inset-bottom)+0.45rem)] pt-2.5 backdrop-blur-xl dark:border-white/10 dark:bg-[#0d1b23]/96">
        <div className="grid grid-cols-3 gap-1.5">
        {items.map((item) => {
          const Icon = navIcons[item.id];
          const isActive = item.id === activeTab;

          return (
            <button
              className={`flex flex-col items-center justify-center gap-1.5 rounded-full px-3 py-2.5 text-[11px] font-medium transition-all duration-200 active:scale-95 ${
                isActive
                  ? "scale-[1.02] bg-slate-900/5 text-slate-950 ring-1 ring-[#3B82F6]/18 dark:bg-white/[0.08] dark:text-white dark:ring-white/8"
                  : "text-slate-500 hover:bg-slate-900/[0.045] hover:text-slate-900 dark:text-slate-400 dark:hover:bg-white/[0.05] dark:hover:text-white"
              }`}
              key={item.id}
              onClick={() => onChange(item.id)}
              type="button"
            >
              <span
                className={`flex size-10 items-center justify-center rounded-full transition-all duration-200 ${
                  isActive
                    ? "bg-[#3B82F6] text-white shadow-[0_8px_18px_rgba(59,130,246,0.28)]"
                    : "bg-slate-900/[0.045] text-current dark:bg-white/[0.06]"
                }`}
              >
                <Icon className="size-5" />
              </span>
              <span className={`${isActive ? "font-semibold" : ""}`}>
                {item.label}
              </span>
            </button>
          );
        })}
        </div>
      </div>
    </nav>
  );
}
