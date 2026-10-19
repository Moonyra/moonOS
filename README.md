# moonOS Desktop

moonOS Desktop ist Yanniks interaktive Portfolio-Seite im Stil eines kleinen
persönlichen Betriebssystems. Statt einer klassischen Landingpage kannst du
Fenster öffnen, verschieben, minimieren und maximieren.

## Funktionen

- Animierter Video-Hintergrund mit abgedunkeltem, transparentem Fenstersystem
- Fenster für **About me**, **Projects**, **GitHub**, **Skills**, **Settings**,
  **Music Player**, **Guestbook** und **Terminal**
- Verlinkte Profile für GitHub, Spotify und Steam
- Musikbereich mit Spotify-Link und Lieblingsgenres
- Gästebuch mit Name (max. 15 Zeichen), Pronomen (max. 10 Zeichen) und
  Nachricht (max. 150 Zeichen)
- Gästebuch-Einträge werden lokal im Browser gespeichert
- Mehrere Themes: DarkPurple, Blossom, Darkblue und Dark
- Systemsimulation beim Starten und Herunterfahren
- Terminal-Befehle wie `help`, `apps`, `open`, `close`, `matrix`, `neofetch`
  und `fortune`
- Taskbar mit Uhrzeit, Online-Status sowie CPU- und RAM-Anzeige

## Projektstruktur

- `src/App.tsx` verwaltet den Desktop-Zustand und das Fenstersystem
- `src/components/` enthält wiederverwendbare Desktop-Komponenten
- `src/components/apps/` enthält den Inhalt der einzelnen Fenster-Apps
- `src/data/desktop.ts` definiert App-Registry, Themes und gemeinsame Typen
- `src/assets/` enthält Medien für den Desktop

## Tech-Stack

- React
- TypeScript
- Vite
- Tailwind CSS
- Lucide React


**MOSTLY MADE BY AI AS A FUN PROJECT!**
