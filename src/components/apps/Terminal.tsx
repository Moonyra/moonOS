import { useState, type FormEvent } from "react";
import { apps, themes } from "../../data/desktop";
import type { AppId, ThemeName } from "../../data/desktop";

export type TerminalProps = {
  theme: typeof themes[ThemeName];
  themeName: ThemeName;
  onOpenApp: (id: AppId) => void;
  onCloseApp: (id: AppId) => void;
};

export default function Terminal({ theme, themeName, onOpenApp, onCloseApp }: TerminalProps) {
  const [eingabe, setEingabe] = useState("");
  const [ausgabe, setAusgabe] = useState<string[]>([
    "moonOS Terminal [Version 1.0]",
    'Type "help" to see available commands.',
  ]);

  function befehlAusfuehren(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const befehl = eingabe.trim().toLowerCase();
    if (!befehl) return;

    const [aktion, argument] = befehl.split(/\s+/);
    const antwort: string[] = [`$ ${eingabe}`];

    if (aktion === "help") {
      antwort.push(
        "help                 Show this list",
        "apps                 List available apps",
        "open <app>           Open an app window",
        "close <app>          Close an app window",
        "matrix               Display digital rain",
        "neofetch             Show moonOS system information",
        "fortune              Print a random fortune",
        "clear                Clear the terminal",
      );
    } else if (aktion === "apps") {
      antwort.push(...apps.map(({ name, id }) => `  ${id.padEnd(10)} ${name}`));
    } else if (aktion === "open" || aktion === "close") {
      const passendeApp = apps.find((app) => app.id === argument || app.name.toLowerCase() === argument);
      if (!passendeApp) {
        antwort.push(`App not found: ${argument ?? "(missing name)"}`, 'Try "apps" to see available apps.');
      } else {
        if (aktion === "open") onOpenApp(passendeApp.id);
        else onCloseApp(passendeApp.id);
        antwort.push(`${aktion === "open" ? "Opened" : "Closed"} ${passendeApp.name}.`);
      }
    } else if (aktion === "clear") {
      setAusgabe([]);
      setEingabe("");
      return;
    } else if (aktion === "matrix") {
      const matrixChars = "アカサタナ01ABCDEFGHIJKLMNOPQRSTUVWXYZ";
      const rain = Array.from({ length: 12 }, (_, zeile) =>
        Array.from({ length: 48 }, (_, spalte) =>
          (zeile + spalte * 3 + Math.floor(Math.random() * 7)) % 5 === 0
            ? matrixChars[Math.floor(Math.random() * matrixChars.length)]
            : " ",
        ).join(""),
      );
      antwort.push(...rain);
    } else if (aktion === "neofetch") {
      antwort.push(
        "        .--.          yannik@desktop",
        "       |o_o |         ----------------",
        "       |:_/ |         OS: moonOS 1.0",
        "      //   \\ \\        Host: Personal Desktop",
        "     (|     | )       CPU: Browser activity",
        "    /'\\_   _/`\\       Memory: Browser managed",
        "    \\___)=(___/       Theme: " + themes[themeName].name,
      );
    } else if (aktion === "fortune") {
      const fortunes = [
        "Small steps still move you forward. ✨",
        "Any sufficiently advanced bug is indistinguishable from a feature.",
        "Make something today that your future self will enjoy.",
        "The best interface is the one that feels like home.",
        "Keep creating weird little things. They often become the most memorable.",
      ];
      antwort.push(fortunes[Math.floor(Math.random() * fortunes.length)]);
    } else {
      antwort.push(`Command not found: ${aktion}`, 'Type "help" for help.');
    }

    setAusgabe((aktuelle) => [...aktuelle, ...antwort]);
    setEingabe("");
  }

  return (
    <div className={`flex min-h-0 flex-1 flex-col ${theme.terminal}`}>
      <div className="flex-1 overflow-auto p-5 font-mono text-sm leading-6">
        {ausgabe.map((zeile, index) => <div className="whitespace-pre-wrap" key={`${zeile}-${index}`}>{zeile}</div>)}
        <form className="flex items-center" onSubmit={befehlAusfuehren}>
          <span className="mr-2 text-[#9cb59e]">$</span>
          <input
            className="min-w-0 flex-1 bg-transparent outline-none placeholder:opacity-50"
            value={eingabe}
            onChange={(event) => setEingabe(event.target.value)}
            placeholder="type a command..."
            autoFocus
            spellCheck={false}
            aria-label="Terminal-Befehl"
          />
        </form>
      </div>
    </div>
  );
}
