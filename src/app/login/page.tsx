"use client";

import { supabase } from "@/lib/supabase";

export default function LoginPage() {
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

        <h1 className="text-6xl font-black mb-5">
          Login to VibeSpace ✨
        </h1>

        <button
          onClick={signInWithGoogle}
          className="bg-white text-black px-8 py-4 rounded-full font-bold"
        >
          Continue with Google
        </button>

      </div>

    </main>
  );
}