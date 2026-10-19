import { themes } from "../../data/desktop";
import type { ThemeName } from "../../data/desktop";

export default function ProjectsApp({ theme }: { theme: typeof themes[ThemeName] }) {
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
