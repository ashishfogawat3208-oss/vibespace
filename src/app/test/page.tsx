"use client";

import { supabase } from "@/lib/supabase";

export default function TestPage() {

  const insertPost = async () => {
    const { data, error } = await supabase
      .from("posts")
      .insert([
        {
          text: "Hello from VibeSpace 🚀",
          mood: "🔥 Motivated",
          comments: [],
          heart: 0,
          cry: 0,
          fire: 0,
          hug: 0,
          moon: 0,
        },
      ]);

    console.log(data);
    console.log(error);

    alert("Check Supabase table");
  };

  return (
    <main className="min-h-screen bg-black text-white flex items-center justify-center">

      <button
        onClick={insertPost}
        className="px-6 py-3 bg-purple-500 rounded-xl"
      >
        Insert Test Post
      </button>

    </main>
  );
}