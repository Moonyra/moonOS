import { useCallback, useEffect, useRef, useState, type FormEvent } from "react";
import {
  Code2,
  Folder,
  GitBranch,
  Music2,
  Maximize2,
  MessageSquare,
  Minus,
  Settings,
  Power,
  Terminal as TerminalIcon,
  UserRound,
  X,
} from "lucide-react";
import hintergrundVideo from "./assets/background.mp4";
import profilePicture from "./assets/Profilepic.jpg";

// each app has a name icon and window content
const apps = [
  { id: "about", name: "About me", icon: UserRound, color: "bg-[#f2b5a7]" },
  { id: "projects", name: "Projects", icon: Folder, color: "bg-[#f2d27d]" },
  { id: "github", name: "Github", icon: GitBranch, color: "bg-[#c9b9e8]" },
  { id: "skills", name: "Skills", icon: Code2, color: "bg-[#b6d7b9]" },
  { id: "settings", name: "Settings", icon: Settings, color: "bg-[#c4c9c5]" },
  { id: "music", name: "Music Player", icon: Music2, color: "bg-[#e6a8bd]" },
  { id: "guestbook", name: "Guestbook", icon: MessageSquare, color: "bg-[#b8a5d6]" },
  { id: "terminal", name: "Terminal", icon: TerminalIcon, color: "bg-[#9eb6ae]" },
] as const;

type AppId = (typeof apps)[number]["id"];
type ThemeName = "darkPurple" | "blossom" | "darkBlue" | "dark";
type GuestbookEntry = { name: string; pronouns: string; message: string; createdAt: string };

function isGuestbookEntry(value: unknown): value is GuestbookEntry {
  if (!value || typeof value !== "object") return false;
  const entry = value as Record<string, unknown>;
  return typeof entry.name === "string"
    && typeof entry.pronouns === "string"
    && typeof entry.message === "string"
    && typeof entry.createdAt === "string";
}

const themes: Record<ThemeName, { name: string; desktop: string; panel: string; window: string; text: string; muted: string; terminal: string }> = {
  darkPurple: { name: "DarkPurple", desktop: "bg-[#171321]", panel: "rgba(29, 23, 42, 0.9)", window: "rgba(35, 31, 45, 0.92)", text: "text-[#f2f3f5]", muted: "text-[#b5bac1]", terminal: "bg-[#241c35] text-[#e5d6f5]" },
  blossom: { name: "Blossom", desktop: "bg-[#ead3d8]", panel: "rgba(61, 39, 48, 0.9)", window: "rgba(56, 39, 45, 0.92)", text: "text-[#f2f3f5]", muted: "text-[#c9b8bf]", terminal: "bg-[#3b252f] text-[#ffdce6]" },
  darkBlue: { name: "Darkblue", desktop: "bg-[#101c2d]", panel: "rgba(19, 35, 56, 0.9)", window: "rgba(27, 40, 55, 0.92)", text: "text-[#f2f3f5]", muted: "text-[#b5c5d5]", terminal: "bg-[#14283d] text-[#c7e4ff]" },
  dark: { name: "Dark", desktop: "bg-[#171918]", panel: "rgba(29, 32, 30, 0.9)", window: "rgba(35, 39, 37, 0.92)", text: "text-[#f2f3f5]", muted: "text-[#b8c0ba]", terminal: "bg-[#202a27] text-[#c8e8c9]" },
};

function App() {
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
            <div className="min-h-0 flex-1 bg-black/10">
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

function ResourceMeter({ label, value }: { label: string; value: number }) {
  return (
    <div className="hidden w-20 sm:block">
    <div className="mb-1 flex justify-between font-mono text-sm">
        <span>{label}</span>
        <span>{value}%</span>
      </div>
      <div className="h-1 overflow-hidden rounded-full bg-black/10">
        <div className="h-full rounded-full bg-[#8b5fbf] transition-[width] duration-500" style={{ width: `${value}%` }} />
      </div>
    </div>
  );
}

function SystemSequence({ type, onDone }: { type: "boot" | "shutdown"; onDone?: () => void }) {
  const [fortschritt, setFortschritt] = useState(0);
  const [sichtbareZeilen, setSichtbareZeilen] = useState(0);
  // browser can show logical cpu threads
  // physical core count is not available here
  const cpuThreads = typeof navigator === "undefined" ? 4 : navigator.hardwareConcurrency || 4;
  const sequenceLines = type === "boot" ? [
    "[  OK  ] MiraOS kernel loaded",
    `[  OK  ] CPU: ${cpuThreads} logical threads detected`,
    `[  OK  ] CPU scheduler: ${cpuThreads} worker threads online`,
    "[  OK  ] CPU frequency governor: performance",
    "[  OK  ] Microcode security patches loaded",
    "[  OK  ] Memory: 16384 MiB available",
    "[  OK  ] Memory allocator initialized",
    "[  OK  ] Swap space: enabled",
    "[  OK  ] GPU: accelerated graphics enabled",
    "[  OK  ] GPU compositor initialized",
    "[  OK  ] Checking system temperature: 38°C",
    "[  OK  ] System clock synchronized",
    "[  OK  ] Mounting virtual filesystem",
    "[  OK  ] Mounting /home/mira",
    "[  OK  ] Mounting /tmp",
    "[  OK  ] Starting device manager",
    "[  OK  ] Starting input devices",
    "[  OK  ] Starting audio service",
    "[  OK  ] Network interface: connected",
    "[  OK  ] DNS resolver configured",
    "[  OK  ] Firewall rules loaded",
    "[  OK  ] Loading desktop environment",
    "[  OK  ] Loading window compositor",
    "[  OK  ] Loading theme engine",
    "[  OK  ] Connecting to creative network",
    "[  OK  ] Checking application registry",
    "[  OK  ] Restoring user session",
    "[  OK  ] Starting background video",
    "[  OK  ] Checking desktop extensions",
    "[  OK  ] Starting notification service",
    "[  OK  ] Starting terminal service",
    "[  OK  ] Preparing taskbar",
    "[  OK  ] Launching MiraOS desktop",
  ] : [
    "[  OK  ] Stopping user sessions",
    "[  OK  ] Closing network connections",
    "[  OK  ] Stopping notification service",
    "[  OK  ] Stopping terminal service",
    "[  OK  ] Releasing CPU resources",
    "[  OK  ] Syncing memory and disk buffers",
    "[  OK  ] Closing application windows",
    "[  OK  ] Saving desktop state",
    "[  OK  ] Stopping audio service",
    "[  OK  ] Stopping window compositor",
    "[  OK  ] Stopping background video",
    "[  OK  ] Flushing filesystem journal",
    "[  OK  ] Unmounting virtual filesystem",
    "[  OK  ] Powering down ${cpuThreads} logical CPU threads",
    "[  OK  ] Releasing memory",
    "[  OK  ] Reached target Power-Off",
  ];
  const sequenceLength = sequenceLines.length;

  useEffect(() => {
    const timer = window.setInterval(() => {
      setFortschritt((aktuell) => {
        const naechsterWert = Math.min(100, aktuell + 1);
        setSichtbareZeilen(Math.ceil((naechsterWert / 100) * sequenceLength));
        if (aktuell >= 100) {
          window.clearInterval(timer);
          window.setTimeout(() => onDone?.(), type === "boot" ? 500 : 350);
          return 100;
        }

        return naechsterWert;
      });
    }, type === "boot" ? 35 : 30);
    return () => window.clearInterval(timer);
  }, [type, onDone, sequenceLength]);

  return (
    <div className="absolute inset-0 z-[100] flex items-center justify-center overflow-hidden bg-[#0d0914] px-5 py-6 font-mono text-sm text-[#d8c4f0] sm:px-10">
      <div className="flex h-full w-full max-w-6xl flex-col">
        <div className="grid flex-1 gap-8 overflow-hidden md:grid-cols-[minmax(220px,.7fr)_minmax(0,1.5fr)] md:gap-12">
          <div className="flex flex-col justify-center border-b border-[#30213d] pb-7 md:border-b-0 md:border-r md:pb-0 md:pr-10">
            <p className="text-5xl font-bold tracking-[-.08em] text-[#f0e5ff] sm:text-7xl">MiraOS</p>
            <p className="mt-3 text-xs uppercase tracking-[.22em] text-[#9d83b8]">personal operating system</p>
            <div className="mt-10 space-y-2 text-xs text-[#725c85]">
              <p>kernel 1.0.0-mira</p>
              <p>session: {type === "boot" ? "initializing" : "ending"}</p>
              <p>tty1 · 192.168.0.42</p>
            </div>
          </div>
          <div className="min-h-0 overflow-hidden pt-2">
            <p className="mb-5 text-[#f0e5ff]">
              {type === "boot" ? "mira@desktop:~$ startx" : "mira@desktop:~$ sudo shutdown now"}
            </p>
            <div className="h-full overflow-hidden border-l border-[#30213d] pl-4">
              {sequenceLines.slice(0, sichtbareZeilen).map((zeile) => (
                <p className="mb-2 whitespace-nowrap text-xs text-[#c8aee4] sm:text-sm" key={zeile}>{zeile}</p>
              ))}
            </div>
          </div>
        </div>
        <div className="shrink-0 border-t border-[#30213d] pt-5">
          <div className="h-1.5 overflow-hidden rounded-full bg-[#30213d]">
            <div className="h-full bg-[#b88be5] transition-[width] duration-75" style={{ width: `${fortschritt}%` }} />
          </div>
          <div className="mt-3 flex justify-between text-xs text-[#9d83b8]"><span>{type === "boot" ? "Starting MiraOS" : "Shutting down MiraOS"}</span><span>{fortschritt}%</span></div>
        </div>
      </div>
    </div>
  );
}

// window content is kept in its own component
function WindowContent({ appId, theme, themeName, onThemeChange, onOpenApp, onCloseApp, guestbookEntries, onAddGuestbookEntry }: { appId: AppId; theme: typeof themes[ThemeName]; themeName: ThemeName; onThemeChange: (theme: ThemeName) => void; onOpenApp: (id: AppId) => void; onCloseApp: (id: AppId) => void; guestbookEntries: GuestbookEntry[]; onAddGuestbookEntry: (entry: GuestbookEntry) => void }) {
if (appId === "about") {
  return (
    <div className="min-h-full space-y-5 bg-[#18191c] p-7 text-[#f2f3f5]">
      <div className="relative overflow-hidden rounded-2xl border border-[#5865f2]/35 bg-gradient-to-br from-[#5865f2]/30 via-[#25253a] to-[#b85d7e]/25 p-5">
        <div className="flex items-center gap-4">
          <img className="h-20 w-20 shrink-0 rounded-2xl object-cover shadow-md ring-4 ring-[#18191c]" src={profilePicture} alt="Miras Profilbild" />
          <div>
            <p className="mb-1 font-mono text-xs uppercase tracking-widest text-[#b5bac1]">About me</p>
            <h2 className="text-3xl font-bold tracking-tight">Hey, I&apos;m Mira! ♡</h2>
            <p className="mt-1 text-sm text-[#b5bac1]">Developer • Creator • Dreamer</p>
          </div>
        </div>
        <p className="mt-4 leading-6 text-[#dbdee1]">
          A little more about me, my hobbies and the things I enjoy ✨
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <section className="rounded-2xl border border-white/10 bg-[#232428] p-4">
          <h3 className="mb-3 flex items-center gap-2 font-bold">👤 Me</h3>
          <div className="space-y-2 text-sm text-[#b5bac1]">
            <p>✨ <strong className="text-[#f2f3f5]">Name:</strong> Mira</p>
            <p>🎂 <strong className="text-[#f2f3f5]">Age:</strong> 18 years</p>
            <p>💬 <strong className="text-[#f2f3f5]">Discord:</strong> <code className="rounded bg-black/25 px-1.5 py-0.5 text-[#dbdee1]">@aapfel</code></p>
            <p>🌍 <strong className="text-[#f2f3f5]">Nationality:</strong> German</p>
          </div>
        </section>

        <section className="rounded-2xl border border-white/10 bg-[#232428] p-4">
          <h3 className="mb-3 flex items-center gap-2 font-bold">🎯 Hobbies</h3>
          <div className="grid grid-cols-2 gap-2 text-sm text-[#b5bac1]">
            {["💻 Coding", "🎧 Music", "🕹️ Gaming", "🎹 Playing Piano"].map((hobby) => (
              <span className="rounded-xl bg-[#1e1f22] px-3 py-2" key={hobby}>{hobby}</span>
            ))}
          </div>
        </section>
      </div>

      <section className="rounded-2xl border border-white/10 bg-[#232428] p-4">
        <h3 className="mb-3 font-bold">⭐ Favs <span className="font-normal text-[#b5bac1]">(in order)</span></h3>
        <div className="grid gap-2 text-sm leading-5 text-[#b5bac1]">
          <p>🗺️ <strong className="text-[#f2f3f5]">Countries:</strong> Japan, Spain, Germany</p>
          <p>🥤 <strong className="text-[#f2f3f5]">Drinks:</strong> Zero Monster, Sprite, Fanta, Cola, Water</p>
          <p>📺 <strong className="text-[#f2f3f5]">Anime:</strong> TenSura, Call of the Night, Bocchi The Rock, One Piece</p>
          <p>🗣️ <strong className="text-[#f2f3f5]">Languages:</strong> German, English</p>
          <p>🍝 <strong className="text-[#f2f3f5]">Food:</strong> Baked Potatoes, Spaghetti Bolognese</p>
        </div>
      </section>
    </div>
  );
}

if (appId === "projects") {
  const projects = [
    {
      icon: "🛡️",
      name: "Backrooms - Private",
      type: "Discord Bot",
      description:
        "A custom Discord bot built for exploration of the Backrooms.",
      tech: ["Java", "JDA"],
    },
    {
      icon: "⛏️",
      name: "DreamveilSMP - Private",
      type: "Minecraft Plugins",
      description:
        "A Minecraft SMP with custom features and plugins created specifically for the server.",
      tech: ["Java", "Paper"],
    },
    {
      icon: "🎣",
      name: "CustomFishing - Private",
      type: "Minecraft Plugin",
      description:
        "A custom fishing system for Minecraft with additional mechanics and gameplay features.",
      tech: ["Java", "Paper"],
    },
    {
      icon: "🥽",
      name: "VRLinks",
      type: "Application",
      description:
        "A program created for easier copying and pasting links in VR.",
      tech: ["C#", "Application"],
    },
    {
      icon: "🔊",
      name: "VRInteractiveSoundboard",
      type: "Application",
      description:
        "An interactive soundboard designed for use in VRChat with customizable sounds and chatbox integration.",
      tech: ["Python", "Application"],
    },
    {
      icon: "🌐",
      name: "This Portfolio",
      type: "Web Development",
      description:
        "A personal portfolio designed as an interactive desktop environment instead of a traditional website.",
      tech: ["React", "TypeScript", "Tailwind", "Vite"],
    },
  ];

  return (
    <div className={`p-7 ${theme.text}`}>
      {/* header */}
      <div className="mb-6">
        <p
          className={`mb-1 font-mono text-xs uppercase tracking-widest ${theme.muted}`}
        >
          Projects
        </p>

        <h2 className="text-3xl font-bold tracking-tight">
          Things I&apos;ve built.
        </h2>

        <p className={`mt-2 text-sm leading-6 ${theme.muted}`}>
          A collection of projects, experiments and things I&apos;ve spent
          some of my time on.
        </p>
      </div>

      {/* projects */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {projects.map((project) => (
          <div
            key={project.name}
            className="group rounded-2xl border border-white/10 bg-black/15 p-4 transition-all hover:-translate-y-0.5 hover:bg-black/25 hover:shadow-sm"
          >
            <div className="flex gap-4">
              <div className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-black/5 text-xl">
                {project.icon}
              </div>

              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="font-semibold">{project.name}</h3>

                  <span
                    className={`rounded-full bg-[#b85d7e]/10 px-2 py-0.5 text-[10px] font-medium text-[#b85d7e]`}
                  >
                    {project.type}
                  </span>
                </div>

                <p
                  className={`mt-1 text-sm leading-5 ${theme.muted}`}
                >
                  {project.description}
                </p>

                <div className="mt-3 flex flex-wrap gap-1.5">
                  {project.tech.map((tech) => (
                    <span
                      key={tech}
                      className={`rounded-md bg-black/5 px-2 py-1 text-[10px] ${theme.muted}`}
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>

              <span
                className={`hidden text-xs transition-transform group-hover:translate-x-1 sm:block ${theme.muted}`}
              >
                →
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
if (appId === "github") {
  return (
    <div className={`p-7 ${theme.text}`}>
      {/* header */}
      <div className="mb-6 flex items-center gap-4">
        <div className="grid h-14 w-14 place-items-center rounded-2xl bg-black/5">
          <GitBranch size={28} />
        </div>

        <div>
          <p
            className={`mb-1 font-mono text-xs uppercase tracking-widest ${theme.muted}`}
          >
            GitHub
          </p>

          <h2 className="text-2xl font-bold">
            My code & projects.
          </h2>
        </div>
      </div>

      {/* description */}
      <p className={`mb-6 leading-7 ${theme.muted}`}>
        Most of my coding projects end up on GitHub. 
        Feel free to take a look around!
      </p>

{/* public endpoint with real github contributions */}
<div className="mb-5 rounded-2xl border border-white/10 bg-black/15 p-5">
  <div className="mb-4 flex items-center justify-between">
    <div>
      <p className="font-semibold">Contribution activity</p>
      <p className={`text-xs ${theme.muted}`}>
        Live data from github.com/moonyra
      </p>
    </div>
    <GitBranch size={18} className={theme.muted} />
  </div>
  <div className="overflow-x-auto rounded-lg bg-black/20 p-3">
    <img
      className="h-[150px] min-w-[720px] max-w-none"
      src="https://ghchart.rshah.org/7c3aed/Moonyra"
      alt="GitHub Contribution Graph für Moonyra"
    />
  </div>
</div>

      {/* github button */}
      <a
        className="inline-flex items-center gap-2 rounded-xl bg-[#292b29] px-5 py-3 text-sm font-medium text-white transition hover:bg-[#4c5149]"
        href="https://github.com/moonyra"
        target="_blank"
        rel="noreferrer"
      >
        <GitBranch size={16} />
        Visit my GitHub
        <span className="ml-1">↗</span>
      </a>
    </div>
  );
}
if (appId === "skills") {
  const skillGroups = [
    {
      icon: "🌐",
      title: "Frontend",
      skills: [
        "React",
        "TypeScript",
        "Tailwind CSS",
        "Vite",
        "CSS",
      ],
    },
    {
      icon: "☕",
      title: "Backend",
      skills: [
        "Java",
        "C#",
        "Python",
        "Paper",
        "Spigot",
        "JDA",
        "Gradle",
        "Maven"
      ],
    },
    {
      icon: "🛠️",
      title: "Tools",
      skills: [
        "Git",
        "GitHub",
        "IntelliJ IDEA",
        "VS Code"
      ],
    },
  ];

  return (
    <div className={`p-7 ${theme.text}`}>
      <div className="mb-6">
        <p
          className={`mb-1 font-mono text-xs uppercase tracking-widest ${theme.muted}`}
        >
          Skills
        </p>

        <h2 className="text-3xl font-bold tracking-tight">
          My toolbox.
        </h2>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {skillGroups.map((group) => (
          <div
            key={group.title}
            className="rounded-2xl border border-white/10 bg-black/15 p-4 transition hover:bg-black/25"
          >
            <div className="mb-4 flex items-center gap-3">
              <div className="grid h-10 w-10 place-items-center rounded-xl bg-black/5 text-lg">
                {group.icon}
              </div>

              <h3 className="font-semibold">
                {group.title}
              </h3>
            </div>

            <div className="flex flex-wrap gap-2">
              {group.skills.map((skill) => (
                <span
                  key={skill}
                  className="rounded-lg bg-black/5 px-2.5 py-1.5 text-xs font-medium transition hover:bg-black/10"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
if (appId === "music") {
  return (
    <div className={`p-7 ${theme.text}`}>
      <h2 className="mb-1 text-2xl font-bold">Music</h2>
      <p className={`mb-6 text-sm ${theme.muted}`}>
        A little look into my music taste ♡
      </p>

      <a
        className="mb-6 flex items-center justify-between rounded-2xl bg-[#1ed760] px-4 py-3 text-[#102017] transition hover:bg-[#4de681]"
        href="https://open.spotify.com/user/mfnzqlxo89yv3uvna2f5th253?si=c51118c876704bee"
        target="_blank"
        rel="noreferrer"
      >
        <span className="flex items-center gap-3">
          <Music2 size={22} />
          <span>
            <span className="block text-xs font-semibold uppercase tracking-wider opacity-70">Spotify</span>
            <span className="block font-bold">@Moonyra</span>
          </span>
        </span>
        <span className="text-lg">↗</span>
      </a>

      {/* favorite genres */}
      <div className="mb-6">
        <p className={`mb-3 text-xs font-semibold uppercase tracking-wider ${theme.muted}`}>
          Favorite genres
        </p>

        <div className="flex flex-wrap gap-2">
          {[
            "J-Pop",
            "Vocaloid",
            "J-Rock",
            "Anime OSTs",
            "Electronic",
            "Alternative",
          ].map((genre) => (
            <span
              key={genre}
              className="rounded-full bg-[#b85d7e]/15 px-3 py-1.5 text-xs font-medium text-[#b85d7e]"
            >
              {genre}
            </span>
          ))}
        </div>
      </div>

      {/* favorite artists */}
      <div>
        <p className={`mb-3 text-xs font-semibold uppercase tracking-wider ${theme.muted}`}>
          Favorite artists
        </p>

        <div className="space-y-2">
          {[
            ["Ado", "J-Pop"],
            ["Creepy Nuts", "J-Pop / J-Rock"],
            ["Kikuo", "Vocaloid"],
            ["9Lana", "J-Pop"],
            ["Eve", "J-Pop / J-Rock"],
          ].map(([artist, genre], index) => (
            <div
              key={artist}
              className="flex items-center justify-between rounded-xl bg-black/5 px-4 py-3 transition hover:bg-black/10"
            >
              <div className="flex items-center gap-3">
                <span className={`w-5 text-xs ${theme.muted}`}>
                  {String(index + 1).padStart(2, "0")}
                </span>

                <span className="font-medium">{artist}</span>
              </div>

              <span className={`text-xs ${theme.muted}`}>
                {genre}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
  if (appId === "guestbook") {
    return <Guestbook theme={theme} entries={guestbookEntries} onAddEntry={onAddGuestbookEntry} />;
  }
  if (appId === "settings") {
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
  return <Terminal theme={theme} themeName={themeName} onOpenApp={onOpenApp} onCloseApp={onCloseApp} />;
}

function Guestbook({ theme, entries, onAddEntry }: { theme: typeof themes[ThemeName]; entries: GuestbookEntry[]; onAddEntry: (entry: GuestbookEntry) => void }) {
  const [name, setName] = useState("");
  const [pronouns, setPronouns] = useState("");
  const [message, setMessage] = useState("");

  function eintragAbsenden(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const cleanName = name.trim();
    const cleanPronouns = pronouns.trim();
    const cleanMessage = message.trim();
    if (!cleanName || !cleanPronouns || !cleanMessage) return;
    onAddEntry({ name: cleanName, pronouns: cleanPronouns, message: cleanMessage, createdAt: new Date().toISOString() });
    setName("");
    setPronouns("");
    setMessage("");
  }

  return (
    <div className={`space-y-6 p-7 ${theme.text}`}>
      <div>
        <p className={`mb-1 font-mono text-xs uppercase tracking-widest ${theme.muted}`}>Guestbook</p>
        <h2 className="text-3xl font-bold tracking-tight">Leave a little note.</h2>
        <p className={`mt-2 text-sm leading-6 ${theme.muted}`}>Say hello with your name, pronouns and a short message.</p>
      </div>

      <form className="space-y-3 rounded-2xl border border-black/10 bg-black/5 p-4" onSubmit={eintragAbsenden}>
        <div className="grid gap-3 sm:grid-cols-2">
          <label className="space-y-1 text-sm font-medium">
            Name
            <input className="w-full rounded-xl border border-white/10 bg-black/20 px-3 py-2 outline-none transition placeholder:opacity-60 focus:border-[#6b9b70] focus:ring-2 focus:ring-[#6b9b70]/20" value={name} onChange={(event) => setName(event.target.value)} maxLength={15} required placeholder="Max. 15 Zeichen" />
          </label>
          <label className="space-y-1 text-sm font-medium">
            Pronouns
            <input className="w-full rounded-xl border border-white/10 bg-black/20 px-3 py-2 outline-none transition placeholder:opacity-60 focus:border-[#6b9b70] focus:ring-2 focus:ring-[#6b9b70]/20" value={pronouns} onChange={(event) => setPronouns(event.target.value)} maxLength={10} required placeholder="Max. 10 Zeichen" />
          </label>
        </div>
        <label className="block space-y-1 text-sm font-medium">
          Message
          <textarea className="min-h-24 w-full resize-y rounded-xl border border-white/10 bg-black/20 px-3 py-2 outline-none transition placeholder:opacity-60 focus:border-[#6b9b70] focus:ring-2 focus:ring-[#6b9b70]/20" value={message} onChange={(event) => setMessage(event.target.value)} maxLength={150} required placeholder="Schreib eine kurze Nachricht..." />
          <span className={`block text-right text-xs ${theme.muted}`}>{message.length}/150</span>
        </label>
        <button className="rounded-xl bg-[#292b29] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#4c5149]" type="submit">Sign guestbook</button>
      </form>

      <div className="space-y-3">
        {entries.length === 0 ? (
          <p className={`rounded-2xl border border-dashed border-black/15 p-5 text-center text-sm ${theme.muted}`}>Noch keine Einträge</p>
        ) : entries.map((entry) => (
          <article className="rounded-2xl border border-black/10 bg-black/5 p-4" key={`${entry.createdAt}-${entry.name}`}>
            <div className="mb-2 flex items-baseline justify-between gap-3">
              <h3 className="font-bold">{entry.name} <span className={`ml-1 text-xs font-normal ${theme.muted}`}>{entry.pronouns}</span></h3>
              <time className={`text-xs ${theme.muted}`} dateTime={entry.createdAt}>{new Date(entry.createdAt).toLocaleDateString("de-DE")}</time>
            </div>
            <p className={`whitespace-pre-wrap text-sm leading-6 ${theme.muted}`}>{entry.message}</p>
          </article>
        ))}
      </div>
    </div>
  );
}

type TerminalProps = {
  theme: typeof themes[ThemeName];
  themeName: ThemeName;
  onOpenApp: (id: AppId) => void;
  onCloseApp: (id: AppId) => void;
};

function Terminal({ theme, themeName, onOpenApp, onCloseApp }: TerminalProps) {
  const [eingabe, setEingabe] = useState("");
  const [ausgabe, setAusgabe] = useState<string[]>([
    "MiraOS Terminal [Version 1.0]",
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
        "neofetch             Show MiraOS system information",
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
        "        .--.          mira@desktop",
        "       |o_o |         ----------------",
        "       |:_/ |         OS: MiraOS 1.0",
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
    <div className={`flex min-h-[220px] flex-1 flex-col ${theme.terminal}`}>
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

export default App;
