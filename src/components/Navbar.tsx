"use client";

import { supabase } from "@/lib/supabase";

export default function Navbar() {
  const logout = async () => {
    await supabase.auth.signOut();
    window.location.href = "/";
  };

  return (
    <nav className="flex justify-between items-center mb-10 bg-white/5 border border-white/10 rounded-2xl px-6 py-4">

      <div
        className="text-2xl font-black cursor-pointer"
        onClick={() => (window.location.href = "/")}
      >
        VibeSpace ✨
      </div>

      <div className="flex gap-3 flex-wrap">

        <button
          onClick={() => (window.location.href = "/")}
          className="bg-white/10 hover:bg-white/20 px-4 py-2 rounded-xl"
        >
          🏠 Home
        </button>

        <button
          onClick={() => (window.location.href = "/post")}
          className="bg-purple-500 hover:bg-purple-400 px-4 py-2 rounded-xl"
        >
          ➕ Post
        </button>

        <button
          onClick={() => (window.location.href = "/explore")}
          className="bg-white/10 hover:bg-white/20 px-4 py-2 rounded-xl"
        >
          📈 Explore
        </button>

        <button
          onClick={() => (window.location.href = "/search")}
          className="bg-white/10 hover:bg-white/20 px-4 py-2 rounded-xl"
        >
          🔎 Search
        </button>

        <button
          onClick={() => (window.location.href = "/notifications")}
          className="bg-white/10 hover:bg-white/20 px-4 py-2 rounded-xl"
        >
          🔔 Notifications
        </button>

        <button
          onClick={() => (window.location.href = "/profile")}
          className="bg-white/10 hover:bg-white/20 px-4 py-2 rounded-xl"
        >
          👤 Profile
        </button>

        <button
          onClick={logout}
          className="bg-red-500 hover:bg-red-400 px-4 py-2 rounded-xl"
        >
          🚪 Logout
        </button>

      </div>

    </nav>
  );
}