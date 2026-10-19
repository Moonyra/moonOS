import { useState, type FormEvent } from "react";
import { themes } from "../../data/desktop";
import type { GuestbookEntry, ThemeName } from "../../data/desktop";

export default function Guestbook({ theme, entries, onAddEntry }: { theme: typeof themes[ThemeName]; entries: GuestbookEntry[]; onAddEntry: (entry: GuestbookEntry) => void }) {
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
