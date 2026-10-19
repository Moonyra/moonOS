import { themes } from "../../data/desktop";
import type { ThemeName } from "../../data/desktop";

export default function SettingsApp({ theme, themeName, onThemeChange }: { theme: typeof themes[ThemeName]; themeName: ThemeName; onThemeChange: (theme: ThemeName) => void }) {
return (
      <div className={`space-y-5 p-7 ${theme.text}`}>
        <div><h2 className="text-2xl font-bold">Settings</h2><p className={`mt-1 text-sm ${theme.muted}`}>Choose a theme for your desktop.</p></div>
        <div className="grid grid-cols-2 gap-3">
          {(Object.keys(themes) as ThemeName[]).map((name) => (
            <button className={`rounded-xl border p-3 text-left transition hover:-translate-y-0.5 ${themeName === name ? "border-[#6b9b70] ring-2 ring-[#6b9b70]/30" : "border-black/10"}`} key={name} onClick={() => onThemeChange(name)}>
              <span className={`mb-2 block h-12 rounded-lg ${themes[name].desktop}`} />
              <span className="text-sm font-semibold">{themes[name].name}</span>
            </button>
          ))}
        </div>
      </div>
    );
}
