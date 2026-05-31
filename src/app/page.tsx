"use client";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-black text-white flex flex-col items-center justify-center">

      <h1 className="text-7xl font-black mb-4">
        VibeSpace ✨
      </h1>

      <p className="text-white/60 mb-10">
        Share your vibes without fear.
      </p>

      <div className="flex gap-4">

        <a
          href="/post"
          className="bg-purple-500 px-6 py-3 rounded-xl"
        >
          Share Post
        </a>

        <a
          href="/explore"
          className="bg-white/10 px-6 py-3 rounded-xl"
        >
          Explore
        </a>

        <a
          href="/login"
          className="bg-white text-black px-6 py-3 rounded-xl"
        >
          Login
        </a>

      </div>

    </main>
  );
}