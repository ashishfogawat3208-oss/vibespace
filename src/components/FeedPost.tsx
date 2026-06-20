"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";
import CommentSection from "./CommentSection";

type Post = {
  id: number;
  user_id: string;
  text: string;
  mood: string;
  username: string;
  avatar: string;
  email: string;
  image_url: string | null;
  comments: string[];
  heart: number;
  cry: number;
  fire: number;
  hug: number;
  moon: number;
};

type Props = {
  post: Post;
  currentUserEmail: string;
  refreshPosts: () => void;
};

export default function FeedPost({
  post,
  currentUserEmail,
  refreshPosts,
}: Props) {
  const [openComments, setOpenComments] =
    useState(false);

  const react = async (
    reaction:
      | "heart"
      | "cry"
      | "fire"
      | "hug"
      | "moon"
  ) => {
    await supabase
      .from("posts")
      .update({
        [reaction]: post[reaction] + 1,
      })
      .eq("id", post.id);

    refreshPosts();
  };

  const deletePost = async () => {
    await supabase
      .from("posts")
      .delete()
      .eq("id", post.id);

    refreshPosts();
  };

  const addComment = async (
    comment: string
  ) => {
    const updatedComments = [
      ...(post.comments || []),
      comment,
    ];

    await supabase
      .from("posts")
      .update({
        comments: updatedComments,
      })
      .eq("id", post.id);

    refreshPosts();
  };

  return (
    <div className="bg-white/5 border border-white/10 rounded-3xl p-6">

      <div className="flex items-center gap-3 mb-2">

        <a href={`/user/${post.user_id}`}>
          {post.avatar ? (
            <img
              src={post.avatar}
              alt="avatar"
              className="w-10 h-10 rounded-full object-cover"
            />
          ) : (
            <div className="w-10 h-10 rounded-full bg-purple-500 flex items-center justify-center">
              👤
            </div>
          )}
        </a>

        <a
          href={`/user/${post.user_id}`}
          className="font-bold hover:text-purple-400"
        >
          {post.username}
        </a>

      </div>

      <div className="text-white/50 text-sm mb-2">
        {post.mood}
      </div>

      <p className="text-lg">
        {post.text}
      </p>

      {post.image_url && (
        <img
          src={post.image_url}
          alt="post"
          className="mt-4 rounded-2xl w-full max-h-[500px] object-cover"
        />
      )}

      <div className="flex gap-4 mt-5 flex-wrap">

        <button
          onClick={() => react("heart")}
        >
          ❤️ {post.heart}
        </button>

        <button
          onClick={() => react("cry")}
        >
          😭 {post.cry}
        </button>

        <button
          onClick={() => react("fire")}
        >
          🔥 {post.fire}
        </button>

        <button
          onClick={() => react("hug")}
        >
          🫂 {post.hug}
        </button>

        <button
          onClick={() => react("moon")}
        >
          🌙 {post.moon}
        </button>

      </div>

      <button
        className="mt-4 text-purple-400"
        onClick={() =>
          setOpenComments(!openComments)
        }
      >
        💬 {(post.comments || []).length}
        {" "}comments
      </button>

      {openComments && (
        <CommentSection
          comments={post.comments || []}
          onAddComment={addComment}
        />
      )}

      {currentUserEmail === post.email && (
        <button
          onClick={deletePost}
          className="mt-4 text-red-400"
        >
          🗑️ Delete
        </button>
      )}

    </div>
  );
}