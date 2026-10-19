import { MoonStar, Power, Sparkles } from "lucide-react";
import { useEffect, useState } from "react";

type SequencePhase = {
  progress: number;
  duration: number;
  status: string;
  message: string;
};

const bootPhases: SequencePhase[] = [
  { progress: 7, duration: 420, status: "Starting session", message: "[  OK  ] moonOS session started" },
  { progress: 16, duration: 520, status: "Loading desktop", message: "[  OK  ] Loading desktop interface" },
  { progress: 16, duration: 750, status: "Waiting for browser", message: "[ WAIT ] Waiting for browser resources" },
  { progress: 34, duration: 560, status: "Preparing workspace", message: "[  OK  ] Preparing desktop workspace" },
  { progress: 49, duration: 470, status: "Restoring local data", message: "[  OK  ] Reading guestbook from local storage" },
  { progress: 49, duration: 720, status: "Checking local data", message: "[ WAIT ] Checking saved browser data" },
  { progress: 72, duration: 650, status: "Loading desktop media", message: "[  OK  ] Preparing background media" },
  { progress: 86, duration: 480, status: "Checking connection", message: "[  OK  ] Browser connection checked" },
  { progress: 94, duration: 620, status: "Finishing setup", message: "[ WAIT ] Waiting for interface to finish loading" },
  { progress: 100, duration: 420, status: "Desktop ready", message: "[  OK  ] moonOS desktop is ready" },
];

const shutdownPhases: SequencePhase[] = [
  { progress: 12, duration: 420, status: "Closing windows", message: "[  OK  ] Closing open desktop windows" },
  { progress: 28, duration: 460, status: "Saving local data", message: "[  OK  ] Guestbook changes saved by browser" },
  { progress: 28, duration: 650, status: "Finishing browser tasks", message: "[ WAIT ] Waiting for browser tasks to finish" },
  { progress: 52, duration: 520, status: "Stopping desktop", message: "[  OK  ] Stopping desktop animations" },
  { progress: 73, duration: 470, status: "Releasing interface", message: "[  OK  ] Releasing desktop interface" },
  { progress: 73, duration: 650, status: "Closing session", message: "[ WAIT ] Closing moonOS session" },
  { progress: 100, duration: 520, status: "Session closed", message: "[  OK  ] moonOS session ended" },
];

type SystemSequenceProps = {
  type: "boot" | "shutdown";
  onDone?: () => void;
};

export default function SystemSequence({ type, onDone }: SystemSequenceProps) {
  const [progress, setProgress] = useState(0);
  const [activePhaseIndex, setActivePhaseIndex] = useState(0);
  const [typedText, setTypedText] = useState({ phaseIndex: 0, text: "" });
  const [isComplete, setIsComplete] = useState(false);
  const [isExiting, setIsExiting] = useState(false);
  const isBooting = type === "boot";
  const phases = isBooting ? bootPhases : shutdownPhases;
  const activePhase = phases[activePhaseIndex];
  const recentLines = phases.slice(Math.max(0, activePhaseIndex - 3), activePhaseIndex);
  const typedMessage = typedText.phaseIndex === activePhaseIndex
    ? typedText.text
    : "";

  useEffect(() => {
    const startedAt = performance.now();
    const timer = window.setInterval(() => {
      const elapsed = performance.now() - startedAt;
      let elapsedBeforePhase = 0;
      let previousProgress = 0;

      for (let index = 0; index < phases.length; index += 1) {
        const phase = phases[index];
        const phaseElapsed = elapsed - elapsedBeforePhase;

        if (phaseElapsed < phase.duration) {
          const fraction = Math.max(0, phaseElapsed / phase.duration);
          setActivePhaseIndex(index);
          setProgress(Math.min(
            99,
            Math.round(previousProgress + (phase.progress - previousProgress) * fraction),
          ));
          return;
        }

        elapsedBeforePhase += phase.duration;
        previousProgress = phase.progress;
      }

      window.clearInterval(timer);
      setActivePhaseIndex(phases.length - 1);
      setProgress(100);
      setIsComplete(true);
    }, isBooting ? 35 : 30);

    return () => window.clearInterval(timer);
  }, [isBooting, phases]);

  useEffect(() => {
    let characterCount = 0;
    const timer = window.setInterval(() => {
      characterCount += 1;
      setTypedText({
        phaseIndex: activePhaseIndex,
        text: activePhase.message.slice(0, characterCount),
      });
      if (characterCount >= activePhase.message.length) {
        window.clearInterval(timer);
      }
    }, 16);
    return () => window.clearInterval(timer);
  }, [activePhaseIndex, activePhase.message]);

  useEffect(() => {
    if (!isComplete || !isBooting) return;
    const exitTimer = window.setTimeout(() => setIsExiting(true), 450);
    const doneTimer = window.setTimeout(() => onDone?.(), 1100);
    return () => {
      window.clearTimeout(exitTimer);
      window.clearTimeout(doneTimer);
    };
  }, [isComplete, isBooting, onDone]);

  const StatusIcon = isBooting ? MoonStar : Power;

  return (
    <div className={`absolute inset-0 z-[100] flex items-center justify-center overflow-hidden bg-[#090711] px-4 py-6 text-[#e9ddf6] sm:px-8 ${isExiting ? "boot-exit" : ""}`}>
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_50%_44%,rgba(117,75,158,0.2),transparent_58%)]" />
      <div className="star-twinkle pointer-events-none absolute left-[14%] top-[18%] h-1 w-1 rounded-full bg-[#dfc5ff] shadow-[0_0_14px_4px_rgba(191,151,239,0.35)]" />
      <div className="star-twinkle pointer-events-none absolute right-[17%] top-[27%] h-1.5 w-1.5 rounded-full bg-[#c7a3f0] shadow-[0_0_16px_4px_rgba(191,151,239,0.3)] [animation-delay:700ms]" />
      <div className="star-twinkle pointer-events-none absolute bottom-[20%] left-[24%] h-1 w-1 rounded-full bg-[#dfc5ff] shadow-[0_0_14px_4px_rgba(191,151,239,0.3)] [animation-delay:1200ms]" />

      <section className="boot-enter relative w-full max-w-xl overflow-hidden rounded-[28px] border border-white/10 bg-[#12101b]/90 shadow-[0_32px_120px_rgba(0,0,0,0.65)] backdrop-blur-2xl">
        <div className="h-px w-full bg-gradient-to-r from-transparent via-[#c19aeb]/70 to-transparent" />
        <div className="p-6 sm:p-9">
          <header className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="moon-glow grid h-11 w-11 place-items-center rounded-2xl border border-[#c19aeb]/25 bg-[#a574d0]/10 text-[#e3c8ff]">
                <MoonStar size={22} strokeWidth={1.7} />
              </div>
              <div>
                <p className="text-lg font-extrabold tracking-tight text-white">moonOS</p>
                <p className="font-mono text-[10px] uppercase tracking-[.2em] text-[#8d7c9e]">Personal desktop</p>
              </div>
            </div>
            <div className="flex items-center gap-2 rounded-full border border-white/10 bg-white/[.04] px-3 py-1.5">
              <span className={`h-1.5 w-1.5 rounded-full ${isBooting ? "animate-pulse bg-[#b89be1]" : "bg-[#d68b9a]"}`} />
              <span className="font-mono text-[10px] uppercase tracking-wider text-[#b9a9c9]">
                {isBooting ? "System boot" : "Powering off"}
              </span>
            </div>
          </header>

          <div className="my-8 flex flex-col items-center text-center sm:my-10">
            <div className="relative mb-5 grid h-24 w-24 place-items-center">
              <div className="moon-orbit absolute inset-0 rounded-full border border-[#bd9add]/20" />
              <div className="absolute inset-2 rounded-full bg-[#9c67c8]/10 blur-lg" />
              <div className="relative grid h-[4.25rem] w-[4.25rem] place-items-center rounded-[24px] border border-[#d6b8f4]/20 bg-gradient-to-br from-[#30213f] to-[#181320] text-[#e7d3fa] shadow-[0_0_45px_rgba(166,112,207,0.22)]">
                <StatusIcon size={32} strokeWidth={1.45} />
              </div>
              <Sparkles className="absolute right-0 top-2 text-[#d5b0f3]" size={15} />
            </div>
            <p className="mb-2 font-mono text-[10px] uppercase tracking-[.28em] text-[#ad8bc8]">
              {isBooting ? "A new day, a new session" : "Until next time"}
            </p>
            <h1 className="text-2xl font-semibold tracking-tight text-white sm:text-3xl">
              {isBooting ? "Waking up your world" : "See you under the moon"}
            </h1>
            <p className="mt-2 max-w-sm text-sm leading-6 text-[#9c91a8]">
              {isBooting
                ? "Getting your little corner of the internet ready."
                : "Saving your session and tucking everything in."}
            </p>
          </div>

          <div className="rounded-2xl border border-white/[.07] bg-black/25 p-4 sm:p-5">
            <div className="mb-3 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-[#ad89d1] shadow-[0_0_10px_rgba(173,137,209,0.75)]" />
                <span className="font-mono text-xs text-[#ddd0e9]">
                  {isBooting ? "yannik@moonos:~$ startx" : "yannik@moonos:~$ shutdown"}
                </span>
              </div>
              <span className="font-mono text-[10px] tabular-nums text-[#8d7c9e]">
                {String(activePhaseIndex + 1).padStart(2, "0")} / {String(phases.length).padStart(2, "0")}
              </span>
            </div>
            <div className="h-[88px] overflow-hidden border-l border-[#775a91]/40 pl-3 font-mono text-[10px] leading-[22px] text-[#bba6ce] sm:text-xs">
              {recentLines.map((line) => (
                <p className="log-line truncate" key={line.message}>{line.message}</p>
              ))}
              <p className="log-line truncate" key={activePhase.message}>
                {typedMessage}
                {typedMessage.length < activePhase.message.length && <span className="ml-0.5 animate-pulse text-[#dfc5ff]">▍</span>}
              </p>
            </div>
          </div>

          <div className="mt-6">
            <div className="mb-2 flex items-center justify-between font-mono text-[10px] uppercase tracking-wider text-[#9a89a8]">
              <span>{activePhase.status}</span>
              <span className="tabular-nums text-[#d7c4e9]">{progress}%</span>
            </div>
            <div
              className="h-2 overflow-hidden rounded-full bg-white/[.07]"
              role="progressbar"
              aria-label={isBooting ? "System startup progress" : "Shutdown progress"}
              aria-valuemin={0}
              aria-valuemax={100}
              aria-valuenow={progress}
            >
              <div
                className="progress-shimmer h-full rounded-full bg-gradient-to-r from-[#7953a0] via-[#c39ae8] to-[#ead5ff] shadow-[0_0_16px_rgba(190,145,231,0.45)] transition-[width] duration-100"
                style={{ width: `${progress}%` }}
              />
            </div>
            <p className="mt-3 text-center font-mono text-[9px] tracking-[.14em] text-[#71647d]">
              {isBooting ? "KERNEL 1.0.0-MOONOS · SESSION INITIALIZING" : "SYNCING SESSION · SAFE TO POWER OFF"}
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
