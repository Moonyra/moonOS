import { useCallback, useEffect, useRef, useState } from "react";
import { Maximize2, Minus, Power, X } from "lucide-react";
import hintergrundVideo from "./assets/background.mp4";
import { apps, isGuestbookEntry, themes } from "./data/desktop";
import type { AppId, GuestbookEntry, ThemeName } from "./data/desktop";
import ResourceMeter from "./components/ResourceMeter";
import SystemSequence from "./components/SystemSequence";
import WindowContent from "./components/WindowContent";

export default function App() {
  // Start with a clear desktop; apps can be opened from the taskbar.
  const [offeneApps, setOffeneApps] = useState<AppId[]>([]);
  const [aktivesFenster, setAktivesFenster] = useState<AppId | null>(null);
  const [themeName, setThemeName] = useState<ThemeName>("darkPurple");
  const [wirdHeruntergefahren, setWirdHeruntergefahren] = useState(false);
  const [wirdGestartet, setWirdGestartet] = useState(true);
  const [uhrzeit, setUhrzeit] = useState(new Date());
  const [ramUsage, setRamUsage] = useState(0);
  const [cpuUsage, setCpuUsage] = useState(0);
  const [online, setOnline] = useState(navigator.onLine);
  const [minimierteApps, setMinimierteApps] = useState<AppId[]>([]);
  const [maximierteApps, setMaximierteApps] = useState<AppId[]>([]);
  const [gaestebuchEintraege, setGaestebuchEintraege] = useState<GuestbookEntry[]>(() => {
    const gespeichert = window.localStorage.getItem("miraos-guestbook");
    if (!gespeichert) return [];
    try {
      const parsed: unknown = JSON.parse(gespeichert);
      return Array.isArray(parsed) ? parsed.filter(isGuestbookEntry) : [];
    } catch {
      return [];
    }
  });
  const [positionen, setPositionen] = useState<Record<AppId, { x: number; y: number }>>({
    about: { x: 90, y: 100 },
    projects: { x: 150, y: 140 },
    github: { x: 210, y: 180 },
    skills: { x: 210, y: 180 },
    settings: { x: 270, y: 220 },
    music: { x: 330, y: 260 },
    guestbook: { x: 390, y: 300 },
    terminal: { x: 390, y: 300 },
  });
  const dragInfo = useRef<{ id: AppId; offsetX: number; offsetY: number } | null>(null);
  const theme = themes[themeName];
  useEffect(() => {
    window.localStorage.setItem("miraos-guestbook", JSON.stringify(gaestebuchEintraege));
  }, [gaestebuchEintraege]);
  const bootBeendet = useCallback(() => {
    setWirdGestartet(false);
  }, []);

  // update the clock
  useEffect(() => {
    const timer = window.setInterval(() => setUhrzeit(new Date()), 1000);
    return () => window.clearInterval(timer);
  }, []);

  // Browsers do not expose real system CPU usage to normal web pages.
  useEffect(() => {
    const updateUsage = () => {
      const memory = (performance as Performance & {
        memory?: { usedJSHeapSize: number; jsHeapSizeLimit: number };
      }).memory;
      const ram = memory
        ? Math.round((memory.usedJSHeapSize / memory.jsHeapSizeLimit) * 100)
        : 38 + Math.round(Math.random() * 8);
      setRamUsage(Math.min(99, ram));

      // This shows browser activity, not the whole computer CPU usage.
      const time = performance.now();
      const activity = 8 + Math.round((Math.sin(time / 1400) + 1) * 7) + Math.round(Math.random() * 5);
      setCpuUsage(activity);
    };
    updateUsage();
    const timer = window.setInterval(updateUsage, 2000);
    return () => window.clearInterval(timer);
  }, []);

  // Keep the network status in sync with the browser connection.
  useEffect(() => {
    const handleOnline = () => setOnline(true);
    const handleOffline = () => setOnline(false);
    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);
    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  function appOeffnen(id: AppId) {
    setOffeneApps((aktuelle) => (aktuelle.includes(id) ? aktuelle : [...aktuelle, id]));
    setAktivesFenster(id);
  }

  function fensterSchliessen(id: AppId) {
    setOffeneApps((aktuelle) => aktuelle.filter((appId) => appId !== id));
    setMinimierteApps((aktuelle) => aktuelle.filter((appId) => appId !== id));
    setMaximierteApps((aktuelle) => aktuelle.filter((appId) => appId !== id));
    setAktivesFenster((aktuelle) => (aktuelle === id ? null : aktuelle));
  }

  function fensterMinimieren(id: AppId) {
    setMinimierteApps((aktuelle) =>
      aktuelle.includes(id) ? aktuelle.filter((appId) => appId !== id) : [...aktuelle, id],
    );
  }

  function fensterMaximieren(id: AppId) {
    setMaximierteApps((aktuelle) =>
      aktuelle.includes(id) ? aktuelle.filter((appId) => appId !== id) : [...aktuelle, id],
    );
    setMinimierteApps((aktuelle) => aktuelle.filter((appId) => appId !== id));
  }

  function fensterBewegen(event: React.PointerEvent<HTMLDivElement>) {
    if (!dragInfo.current) return;
    const { id, offsetX, offsetY } = dragInfo.current;
    setPositionen((aktuelle) => ({
      ...aktuelle,
      [id]: { x: Math.max(8, event.clientX - offsetX), y: Math.max(0, event.clientY - offsetY) },
    }));
  }

  function dragStarten(event: React.PointerEvent<HTMLDivElement>, id: AppId) {
    const position = positionen[id];
    dragInfo.current = { id, offsetX: event.clientX - position.x, offsetY: event.clientY - position.y };
    setAktivesFenster(id);
    event.currentTarget.setPointerCapture(event.pointerId);
  }

  function shutdownStarten() {
    setWirdHeruntergefahren(true);
  }

  return (
    <main className={`relative h-screen overflow-hidden ${theme.desktop} font-sans ${theme.text}`} onPointerMove={fensterBewegen} onPointerUp={() => { dragInfo.current = null; }}>
      {/* background video */}
      <video
        className="pointer-events-none absolute inset-0 h-full w-full object-cover"
        src={hintergrundVideo}
        autoPlay
        loop
        muted
        playsInline
        aria-hidden="true"
      />
      {/* dark overlay for better text */}
      <div className="pointer-events-none absolute inset-0 bg-black/25" />

      {/* render open windows */}
      {offeneApps.map((id, index) => {
        const app = apps.find((eintrag) => eintrag.id === id);
        if (!app) return null;
        const AppIcon = app.icon;
        return (
          <div className={`${minimierteApps.includes(id) ? "hidden" : ""} ${maximierteApps.includes(id) ? "fixed inset-x-2 bottom-[74px] top-2 w-auto" : "absolute sm:w-[600px]"} flex min-h-[220px] min-w-[280px] max-w-[calc(100%-32px)] resize flex-col overflow-auto rounded-2xl border border-black/10 shadow-[0_30px_80px_rgba(43,42,35,.3)] backdrop-blur-md`} key={id} style={{ ...(maximierteApps.includes(id) ? {} : { left: positionen[id].x, top: positionen[id].y }), zIndex: aktivesFenster === id ? 30 : 20 + index, backgroundColor: theme.window }} onPointerDown={() => setAktivesFenster(id)}>
            <div className="flex shrink-0 cursor-grab items-center justify-between border-b border-black/10 px-4 py-3 active:cursor-grabbing" style={{ backgroundColor: theme.panel }} onPointerDown={(event) => dragStarten(event, id)}>
              <div className="flex items-center gap-2 text-sm font-bold"><AppIcon size={17} /> {app.name}</div>
              <div className="flex items-center gap-1">
                <button className="rounded-md p-1.5 text-[#b5bac1] hover:bg-white/10 hover:text-white" onPointerDown={(event) => event.stopPropagation()} onClick={() => fensterMinimieren(id)} aria-label="Fenster minimieren"><Minus size={15} /></button>
                <button className="rounded-md p-1.5 text-[#b5bac1] hover:bg-white/10 hover:text-white" onPointerDown={(event) => event.stopPropagation()} onClick={() => fensterMaximieren(id)} aria-label={maximierteApps.includes(id) ? "Fenster wiederherstellen" : "Fenster maximieren"}><Maximize2 size={15} /></button>
                <button className="rounded-md p-1.5 text-[#b5bac1] hover:bg-white/10 hover:text-white" onPointerDown={(event) => event.stopPropagation()} onClick={() => fensterSchliessen(id)} aria-label="Fenster schließen"><X size={18} /></button>
              </div>
            </div>
            <div className={`min-h-0 flex-1 bg-black/10 ${id === "terminal" ? "flex flex-col" : ""}`}>
              <WindowContent appId={id} theme={theme} themeName={themeName} onThemeChange={setThemeName} onOpenApp={appOeffnen} onCloseApp={fensterSchliessen} guestbookEntries={gaestebuchEintraege} onAddGuestbookEntry={(entry) => setGaestebuchEintraege((current) => [entry, ...current])} />
            </div>
          </div>
        );
      })}

      {/* shutdown screen */}
      {wirdGestartet && <SystemSequence type="boot" onDone={bootBeendet} />}
      {wirdHeruntergefahren && <SystemSequence type="shutdown" />}

      {/* bottom taskbar */}
      <footer className="absolute bottom-0 left-0 right-0 z-40 flex h-[74px] items-center justify-between border-t border-black/10 px-5 shadow-[0_-8px_30px_rgba(43,42,35,.12)] backdrop-blur-xl" style={{ backgroundColor: theme.panel }}>
        <div className="flex items-center gap-2">
          <button className="grid h-11 w-11 place-items-center rounded-lg bg-[#292b29] text-white hover:bg-[#9a4b4b]" onClick={shutdownStarten} aria-label="Computer herunterfahren"><Power size={20} /></button>
          <div className="mx-2 h-9 w-px bg-black/10" />
          {apps.map(({ id, name, icon: Icon, color }) => (
            <button
              className={`group relative grid h-14 w-14 place-items-center rounded-lg transition hover:-translate-y-1 ${offeneApps.includes(id) ? "bg-white/15 shadow-sm" : "opacity-60 hover:bg-white/10 hover:opacity-100"} ${aktivesFenster === id ? "ring-2 ring-[#6b9b70]/60" : ""}`}
              key={id}
              onClick={() => {
                appOeffnen(id);
                setMinimierteApps((aktuelle) => aktuelle.filter((appId) => appId !== id));
              }}
              title={name}
              aria-label={`${name} öffnen`}
            >
              <span className={`absolute inset-2 rounded-md ${color} opacity-80 transition group-hover:opacity-100`} />
              <Icon className="relative" size={23} />
              {offeneApps.includes(id) && <span className="absolute bottom-0.5 h-1 w-1 rounded-full bg-[#292b29]" />}
            </button>
          ))}
        </div>
        <div className={`flex items-center gap-5 text-2xl ${theme.muted}`}>
          <div className="flex items-center gap-2 text-base">
            <span className={`h-3 w-3 rounded-full ${online ? "bg-[#6b9b70]" : "bg-[#b85d7e]"}`} />
            <span>{online ? "Online" : "Offline"}</span>
          </div>
          <ResourceMeter label="CPU" value={cpuUsage} />
          <ResourceMeter label="RAM" value={ramUsage} />
          <span className="font-mono">{uhrzeit.toLocaleTimeString("de-DE", { hour: "2-digit", minute: "2-digit" })}</span>
        </div>
      </footer>
    </main>
  );
}
