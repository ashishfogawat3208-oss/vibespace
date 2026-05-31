"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import CommentSection from "@/components/CommentSection";

type Mood =
  | "💔 Heartbroken"
  | "😌 Peaceful"
  | "🔥 Motivated"
  | "🌙 Midnight Thoughts"
  | "😂 Funny"
  | "😤 Frustrated";

type DbPost = {
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

export default function PostPage() {
  const [text, setText] = useState("");
  const [mood, setMood] = useState<Mood>("🌙 Midnight Thoughts");
  const [posts, setPosts] = useState<DbPost[]>([]);
  const [openComments, setOpenComments] = useState<number | null>(null);

  const loadPosts = async () => {
    const { data, error } = await supabase
      .from("posts")
      .select("*")
      .order("id", { ascending: false });

    if (!error && data) {
      setPosts(data as DbPost[]);
    }
  };

  useEffect(() => {
    loadPosts();

    const channel = supabase
      .channel("posts-realtime")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "posts",
        },
        () => {
          loadPosts();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const handlePost = async () => {
    if (!text.trim()) return;

    const { error } = await supabase
      .from("posts")
      .insert([
        {
          text,
          mood,
          comments: [],
          heart: 0,
          cry: 0,
          fire: 0,
          hug: 0,
          moon: 0,
        },
      ]);

    if (!error) {
      setText("");
      setMood("🌙 Midnight Thoughts");
      loadPosts();
    }
  };

  const deletePost = async (id: number) => {
    const { error } = await supabase
      .from("posts")
      .delete()
      .eq("id", id);

    if (!error) {
      loadPosts();
    }
  };

  const react = async (
    post: DbPost,
    reaction: "heart" | "cry" | "fire" | "hug" | "moon"
  ) => {
    const { error } = await supabase
      .from("posts")
      .update({
        [reaction]: post[reaction] + 1,
      })
      .eq("id", post.id);

    if (!error) {
      loadPosts();
    }
  };

  const addComment = async (
    post: DbPost,
    comment: string
  ) => {
    const updatedComments = [
      ...(post.comments || []),
      comment,
    ];

    const { error } = await supabase
      .from("posts")
      .update({
        comments: updatedComments,
      })
      .eq("id", post.id);

    if (!error) {
      loadPosts();
    }
  };

  return (
    <main className="min-h-screen bg-black text-white px-6 py-20">
      <div className="max-w-2xl mx-auto">

        <h1 className="text-5xl font-black mb-8">
          Share Your Vibe ✨
        </h1>

        <div className="bg-white/5 border border-white/10 rounded-3xl p-6">

          <select
            value={mood}
            onChange={(e) => setMood(e.target.value as Mood)}
            className="w-full mb-4 bg-black/30 border border-white/10 rounded-xl p-3"
          >
            <option>💔 Heartbroken</option>
            <option>😌 Peaceful</option>
            <option>🔥 Motivated</option>
            <option>🌙 Midnight Thoughts</option>
            <option>😂 Funny</option>
            <option>😤 Frustrated</option>
          </select>

          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="What's on your mind?"
            className="w-full h-40 bg-black/30 border border-white/10 rounded-2xl p-5 outline-none resize-none text-lg"
          />

          <div className="flex justify-end mt-5">
            <button
              onClick={handlePost}
              className="px-6 py-3 rounded-full bg-purple-500 hover:bg-purple-400 transition font-semibold"
            >
              Post Vibe
            </button>
          </div>

        </div>

        <div className="mt-12 space-y-5">

          {posts.map((post) => (
            <div
              key={post.id}
              className="bg-white/5 border border-white/10 rounded-3xl p-6"
            >
              <div className="flex justify-between items-start">

                <div className="w-full">

                  <span className="text-purple-400 text-sm">
                    {post.mood}
                  </span>

                  <p className="text-lg mt-3">
                    {post.text}
                  </p>

                  <div className="flex gap-4 flex-wrap mt-5">

                    <button
                      onClick={() => react(post, "heart")}
                      className="hover:scale-110 transition"
                    >
                      ❤️ {post.heart}
                    </button>

                    <button
                      onClick={() => react(post, "cry")}
                      className="hover:scale-110 transition"
                    >
                      😭 {post.cry}
                    </button>

                    <button
                      onClick={() => react(post, "fire")}
                      className="hover:scale-110 transition"
                    >
                      🔥 {post.fire}
                    </button>

                    <button
                      onClick={() => react(post, "hug")}
                      className="hover:scale-110 transition"
                    >
                      🫂 {post.hug}
                    </button>

                    <button
                      onClick={() => react(post, "moon")}
                      className="hover:scale-110 transition"
                    >
                      🌙 {post.moon}
                    </button>

                  </div>

                  <button
                    onClick={() =>
                      setOpenComments(
                        openComments === post.id
                          ? null
                          : post.id
                      )
                    }
                    className="mt-4 text-purple-400 hover:text-purple-300 text-sm"
                  >
                    💬 {(post.comments || []).length} comments
                  </button>

                  {openComments === post.id && (
                    <CommentSection
                      comments={post.comments || []}
                      onAddComment={(comment) =>
                        addComment(post, comment)
                      }
                    />
                  )}

                </div>

                <button
                  onClick={() => deletePost(post.id)}
                  className="text-red-400 hover:text-red-300 text-xl ml-4"
                >
                  🗑️
                </button>

              </div>
            </div>
          ))}

        </div>

      </div>
    </main>
  );
}