import AboutApp from "./apps/AboutApp";
import ProjectsApp from "./apps/ProjectsApp";
import GithubApp from "./apps/GithubApp";
import SkillsApp from "./apps/SkillsApp";
import MusicApp from "./apps/MusicApp";
import SettingsApp from "./apps/SettingsApp";
import Guestbook from "./apps/Guestbook";
import Terminal from "./apps/Terminal";
import { themes } from "../data/desktop";
import type { AppId, GuestbookEntry, ThemeName } from "../data/desktop";

type WindowContentProps = {
  appId: AppId;
  theme: typeof themes[ThemeName];
  themeName: ThemeName;
  onThemeChange: (theme: ThemeName) => void;
  onOpenApp: (id: AppId) => void;
  onCloseApp: (id: AppId) => void;
  guestbookEntries: GuestbookEntry[];
  onAddGuestbookEntry: (entry: GuestbookEntry) => void;
};

export default function WindowContent({ appId, theme, themeName, onThemeChange, onOpenApp, onCloseApp, guestbookEntries, onAddGuestbookEntry }: WindowContentProps) {
  switch (appId) {
    case "about": return <AboutApp />;
    case "projects": return <ProjectsApp theme={theme} />;
    case "github": return <GithubApp theme={theme} />;
    case "skills": return <SkillsApp theme={theme} />;
    case "music": return <MusicApp theme={theme} />;
    case "settings": return <SettingsApp theme={theme} themeName={themeName} onThemeChange={onThemeChange} />;
    case "guestbook": return <Guestbook theme={theme} entries={guestbookEntries} onAddEntry={onAddGuestbookEntry} />;
    case "terminal": return <Terminal theme={theme} themeName={themeName} onOpenApp={onOpenApp} onCloseApp={onCloseApp} />;
  }
}
