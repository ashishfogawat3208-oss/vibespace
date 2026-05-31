"use client";

import { supabase } from "@/lib/supabase";

export default function HomePage() {
  const signInWithGoogle = async () => {
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo:
          "https://vibespace-pi.vercel.app/post",
      },
    });
  };

  return (
    <main className="min-h-screen bg-black text-white flex items-center justify-center">
      <div className="text-center">

        <h1 className="text-7xl font-black mb-5">
          VibeSpace ✨
        </h1>

        <p className="text-white/60 mb-10">
          Share your mood with the world.
        </p>

        <button
          onClick={signInWithGoogle}
          className="bg-white text-black px-8 py-4 rounded-full font-bold hover:scale-105 transition"
        >
          Continue with Google
        </button>

      </div>
    </main>
  );
}