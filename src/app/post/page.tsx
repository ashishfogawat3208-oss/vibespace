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
  username: string;
  avatar: string;
  comments: string[];
  heart: number;
  cry: number;
  fire: number;
  hug: number;
  moon: number;
};

export default function PostPage() {
  const [text, setText] = useState("");
  const [mood, setMood] =
    useState<Mood>("🌙 Midnight Thoughts");

  const [posts, setPosts] = useState<DbPost[]>([]);
  const [openComments, setOpenComments] =
    useState<number | null>(null);

  const [user, setUser] = useState<any>(null);

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

    supabase.auth.getUser().then(({ data }) => {
  if (!data.user) {
    window.location.href = "/login";
    return;
  }

  setUser(data.user);
});

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

  const logout = async () => {
    await supabase.auth.signOut();
    window.location.href = "/";
  };

  const handlePost = async () => {
    if (!text.trim()) return;

    const { error } = await supabase
      .from("posts")
      .insert([
        {
          text,
          mood,
          username:
          user?.user_metadata?.full_name ||
          user?.email ||
          "Anonymous",
          avatar:
          user?.user_metadata?.avatar_url ||
          "",
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
    reaction:
      | "heart"
      | "cry"
      | "fire"
      | "hug"
      | "moon"
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

      <button
        onClick={() => window.location.href = "/"}
        className="mb-5 bg-white/10 px-4 py-2 rounded-xl hover:bg-white/20"
      >
        ← Home
      </button>

      <h1 className="text-5xl font-black mb-2">
        Share Your Vibe ✨
      </h1>

        {user && (
  <div className="flex justify-between items-center mb-8">

    <div className="text-purple-400">
      Welcome,
      {" "}
      {user.user_metadata?.full_name ||
        user.email}
    </div>

    <button
      onClick={logout}
      className="bg-red-500 hover:bg-red-400 px-4 py-2 rounded-xl"
    >
      Logout
    </button>

  </div>
)}

        <div className="bg-white/5 border border-white/10 rounded-3xl p-6">

          <select
            value={mood}
            onChange={(e) =>
              setMood(e.target.value as Mood)
            }
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
            onChange={(e) =>
              setText(e.target.value)
            }
            placeholder="What's on your mind?"
            className="w-full h-40 bg-black/30 border border-white/10 rounded-2xl p-5 outline-none resize-none text-lg"
          />

          <div className="flex justify-end mt-5">
            <button
              onClick={handlePost}
              className="px-6 py-3 rounded-full bg-purple-500 hover:bg-purple-400 transition"
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
            <div className="flex items-center gap-3 mb-2">
               <div className="w-10 h-10 rounded-full bg-purple-500 flex items-center justify-center">
                 👤
                 </div>
                 <div className="font-bold text-white">
                  {post.username}
                  </div>
                  
                  </div>

              <div className="text-sm text-white/60 mt-1">
                {post.mood}
              </div>

              <p className="mt-3 text-lg">
                {post.text}
              </p>

              <div className="flex gap-4 mt-5 flex-wrap">

                <button onClick={() => react(post, "heart")}>
                  ❤️ {post.heart}
                </button>

                <button onClick={() => react(post, "cry")}>
                  😭 {post.cry}
                </button>

                <button onClick={() => react(post, "fire")}>
                  🔥 {post.fire}
                </button>

                <button onClick={() => react(post, "hug")}>
                  🫂 {post.hug}
                </button>

                <button onClick={() => react(post, "moon")}>
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
                className="mt-4 text-purple-400"
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

              <button
                onClick={() => deletePost(post.id)}
                className="mt-4 text-red-400"
              >
                🗑️ Delete
              </button>

            </div>
          ))}

        </div>

      </div>
    </main>
  );
}