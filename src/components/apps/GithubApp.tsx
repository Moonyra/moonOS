import { GitBranch } from "lucide-react";
import { themes } from "../../data/desktop";
import type { ThemeName } from "../../data/desktop";

export default function GithubApp({ theme }: { theme: typeof themes[ThemeName] }) {
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
