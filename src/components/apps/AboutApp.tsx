import profilePicture from "../../assets/Profilepic.jpg";

export default function AboutApp() {
return (
    <div className="min-h-full space-y-5 bg-[#18191c] p-7 text-[#f2f3f5]">
      <div className="relative overflow-hidden rounded-2xl border border-[#5865f2]/35 bg-gradient-to-br from-[#5865f2]/30 via-[#25253a] to-[#b85d7e]/25 p-5">
        <div className="flex items-center gap-4">
          <img className="h-20 w-20 shrink-0 rounded-2xl object-cover shadow-md ring-4 ring-[#18191c]" src={profilePicture} alt="Yanniks Profilbild" />
          <div>
            <p className="mb-1 font-mono text-xs uppercase tracking-widest text-[#b5bac1]">About me</p>
            <h2 className="text-3xl font-bold tracking-tight">Hey, I&apos;m Yannik! ♡</h2>
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
            <p>✨ <strong className="text-[#f2f3f5]">Name:</strong> Yannik</p>
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
