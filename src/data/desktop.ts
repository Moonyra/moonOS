import { Code2, Folder, GitBranch, MessageSquare, Music2, Settings, Terminal as TerminalIcon, UserRound } from "lucide-react";

export const apps = [
  { id: "about", name: "About me", icon: UserRound, color: "bg-[#f2b5a7]" },
  { id: "projects", name: "Projects", icon: Folder, color: "bg-[#f2d27d]" },
  { id: "github", name: "Github", icon: GitBranch, color: "bg-[#c9b9e8]" },
  { id: "skills", name: "Skills", icon: Code2, color: "bg-[#b6d7b9]" },
  { id: "settings", name: "Settings", icon: Settings, color: "bg-[#c4c9c5]" },
  { id: "music", name: "Music Player", icon: Music2, color: "bg-[#e6a8bd]" },
  { id: "guestbook", name: "Guestbook", icon: MessageSquare, color: "bg-[#b8a5d6]" },
  { id: "terminal", name: "Terminal", icon: TerminalIcon, color: "bg-[#9eb6ae]" },
] as const;

export type AppId = (typeof apps)[number]["id"];

export type ThemeName = "darkPurple" | "blossom" | "darkBlue" | "dark";

export type GuestbookEntry = { name: string; pronouns: string; message: string; createdAt: string };

export function isGuestbookEntry(value: unknown): value is GuestbookEntry {
  if (!value || typeof value !== "object") return false;
  const entry = value as Record<string, unknown>;
  return typeof entry.name === "string"
    && typeof entry.pronouns === "string"
    && typeof entry.message === "string"
    && typeof entry.createdAt === "string";
}

export const themes: Record<ThemeName, { name: string; desktop: string; panel: string; window: string; text: string; muted: string; terminal: string }> = {
  darkPurple: { name: "DarkPurple", desktop: "bg-[#171321]", panel: "rgba(29, 23, 42, 0.9)", window: "rgba(35, 31, 45, 0.92)", text: "text-[#f2f3f5]", muted: "text-[#b5bac1]", terminal: "bg-[#241c35] text-[#e5d6f5]" },
  blossom: { name: "Blossom", desktop: "bg-[#ead3d8]", panel: "rgba(61, 39, 48, 0.9)", window: "rgba(56, 39, 45, 0.92)", text: "text-[#f2f3f5]", muted: "text-[#c9b8bf]", terminal: "bg-[#3b252f] text-[#ffdce6]" },
  darkBlue: { name: "Darkblue", desktop: "bg-[#101c2d]", panel: "rgba(19, 35, 56, 0.9)", window: "rgba(27, 40, 55, 0.92)", text: "text-[#f2f3f5]", muted: "text-[#b5c5d5]", terminal: "bg-[#14283d] text-[#c7e4ff]" },
  dark: { name: "Dark", desktop: "bg-[#171918]", panel: "rgba(29, 32, 30, 0.9)", window: "rgba(35, 39, 37, 0.92)", text: "text-[#f2f3f5]", muted: "text-[#b8c0ba]", terminal: "bg-[#202a27] text-[#c8e8c9]" },
};
