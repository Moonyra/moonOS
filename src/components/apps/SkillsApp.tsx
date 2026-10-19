import { themes } from "../../data/desktop";
import type { ThemeName } from "../../data/desktop";

export default function SkillsApp({ theme }: { theme: typeof themes[ThemeName] }) {
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
