"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

type Mood =
  | "💔 Heartbroken"
  | "😌 Peaceful"
  | "🔥 Motivated"
  | "🌙 Midnight Thoughts"
  | "😂 Funny"
  | "😤 Frustrated";

type Post = {
  id: number;
  text: string;
  mood: Mood;
  comments: string[];
  heart: number;
  cry: number;
  fire: number;
  hug: number;
  moon: number;
};

export default function ExplorePage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [selectedMood, setSelectedMood] = useState("All");

  useEffect(() => {
    const loadPosts = async () => {
      const { data, error } = await supabase
        .from("posts")
        .select("*");

      if (!error && data) {
        const sortedPosts = [...data].sort((a, b) => {
          const scoreA =
            a.heart +
            a.cry +
            a.fire +
            a.hug +
            a.moon;

          const scoreB =
            b.heart +
            b.cry +
            b.fire +
            b.hug +
            b.moon;

          return scoreB - scoreA;
        });

        setPosts(sortedPosts as Post[]);
      }
    };

    loadPosts();
  }, []);

  const filteredPosts =
    selectedMood === "All"
      ? posts
      : posts.filter((post) => post.mood === selectedMood);

  return (
    <main className="min-h-screen bg-black text-white px-6 py-20">

      <div className="max-w-4xl mx-auto">

        <h1 className="text-5xl font-black mb-4">
          Trending Vibes 📈
        </h1>

        <p className="text-white/50 mb-8">
          Discover the most emotional vibes on VibeSpace.
        </p>

        <div className="flex flex-wrap gap-3 mb-10">

          {[
            "All",
            "💔 Heartbroken",
            "😌 Peaceful",
            "🔥 Motivated",
            "🌙 Midnight Thoughts",
            "😂 Funny",
            "😤 Frustrated",
          ].map((mood) => (
            <button
              key={mood}
              onClick={() => setSelectedMood(mood)}
              className={`px-4 py-2 rounded-full border transition ${
                selectedMood === mood
                  ? "bg-purple-500 border-purple-500"
                  : "border-white/10 bg-white/5"
              }`}
            >
              {mood}
            </button>
          ))}

        </div>

        <div className="space-y-6">

          {filteredPosts.map((post, index) => {
            const totalReactions =
              post.heart +
              post.cry +
              post.fire +
              post.hug +
              post.moon;

            return (
              <div
                key={post.id}
                className="bg-white/5 border border-white/10 rounded-3xl p-6"
              >
                <div className="flex justify-between mb-4">

                  <span className="text-purple-400 font-bold">
                    #{index + 1}
                  </span>

                  <span className="text-white/40">
                    {totalReactions} reactions
                  </span>

                </div>

                <div className="mb-3">
                  <span className="text-purple-400 text-sm">
                    {post.mood}
                  </span>
                </div>

                <p className="text-lg mb-5">
                  {post.text}
                </p>

                <div className="text-white/50 text-sm">
                  💬 {(post.comments || []).length} comments
                </div>

              </div>
            );
          })}

        </div>

      </div>

    </main>
  );
}