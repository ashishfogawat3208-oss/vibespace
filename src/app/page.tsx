"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export default function HomePage() {
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user);
    });
  }, []);

  const signInWithGoogle = async () => {
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo:
          "https://vibespace-pi.vercel.app/post",
      },
    });
  };

  const logout = async () => {
    await supabase.auth.signOut();
    setUser(null);
  };

  return (
    <main className="min-h-screen bg-black text-white flex items-center justify-center px-6">

      <div className="max-w-3xl text-center">

        <h1 className="text-7xl font-black mb-6">
          VibeSpace ✨
        </h1>

        <p className="text-xl text-white/70 mb-4">
          Share your vibes without fear.
        </p>

        <p className="text-white/40 mb-10">
          Express emotions. Connect with people.
          Discover trending moods.
        </p>

        <div className="flex justify-center gap-3 flex-wrap mb-12">

          <span className="bg-white/10 px-4 py-2 rounded-full">
            💔 Heartbroken
          </span>

          <span className="bg-white/10 px-4 py-2 rounded-full">
            🔥 Motivated
          </span>

          <span className="bg-white/10 px-4 py-2 rounded-full">
            🌙 Midnight Thoughts
          </span>

          <span className="bg-white/10 px-4 py-2 rounded-full">
            😂 Funny
          </span>

        </div>

        {user ? (
          <div>

            <h2 className="text-2xl font-bold text-purple-400 mb-8">
              Welcome,{" "}
              {user.user_metadata?.full_name ||
                user.email}
              👋
            </h2>

            <div className="flex justify-center gap-4 flex-wrap">

              <a
                href="/post"
                className="bg-purple-500 hover:bg-purple-400 px-6 py-3 rounded-xl font-semibold"
              >
                Share Post
              </a>

              <a
                href="/explore"
                className="bg-white/10 hover:bg-white/20 px-6 py-3 rounded-xl"
              >
                Explore
              </a>

              <button
                onClick={logout}
                className="bg-red-500 hover:bg-red-400 px-6 py-3 rounded-xl"
              >
                Logout
              </button>

            </div>

          </div>
        ) : (
          <div className="flex justify-center gap-4 flex-wrap">

            <button
              onClick={signInWithGoogle}
              className="bg-white text-black px-6 py-3 rounded-xl font-bold"
            >
              Continue with Google
            </button>

            <a
              href="/explore"
              className="bg-white/10 hover:bg-white/20 px-6 py-3 rounded-xl"
            >
              Explore
            </a>

          </div>
        )}

      </div>

    </main>
  );
}