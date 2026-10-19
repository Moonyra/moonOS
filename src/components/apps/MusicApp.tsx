import { Music2 } from "lucide-react";
import { themes } from "../../data/desktop";
import type { ThemeName } from "../../data/desktop";
import youngGirlA from "../../assets/siinamota - Young Girl A.mp4";
import yotsuyaSan from "../../assets/四ツ谷さんによろしく - Eight.mp4";

export default function MusicApp({ theme }: { theme: typeof themes[ThemeName] }) {
  const honorableMentions = [
    { title: "Young Girl A", artist: "siinamota", video: youngGirlA },
    { title: "四ツ谷さんによろしく", artist: "Eight", video: yotsuyaSan },
  ];

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

      <div>
        <p className={`mb-1 text-xs font-semibold uppercase tracking-wider ${theme.muted}`}>
          Honorable Mentions
        </p>
        <p className={`mb-3 text-sm ${theme.muted}`}>
          Music videos I love
        </p>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {honorableMentions.map(({ title, artist, video }) => (
            <div
              key={title}
              className="rounded-xl bg-black/5 p-3"
            >
              <video
                className="mb-2 aspect-video w-full rounded-lg bg-black"
                controls
                preload="metadata"
                aria-label={`${title} by ${artist}`}
              >
                <source src={video} type="video/mp4" />
              </video>
              <p className="text-sm font-medium">{title}</p>
              <p className={`text-xs ${theme.muted}`}>{artist}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
