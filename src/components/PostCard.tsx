"use client";

import { useState } from "react";
import CommentSection from "./CommentSection";

type Post = {
  id: string;
  text: string;
  mood: string;
  comments: string[];
  reactions: {
    heart: number;
    cry: number;
    fire: number;
    hug: number;
    moon: number;
  };
};

type Props = {
  post: Post;
  index: number;
  posts: Post[];
  savePosts: (posts: Post[]) => void;
  deletePost: (id: string) => void;
};

export default function PostCard({
  post,
  index,
  posts,
  savePosts,
  deletePost,
}: Props) {
  const [showComments, setShowComments] = useState(false);

  const addComment = (comment: string) => {
    const updated = [...posts];

    updated[index].comments.push(comment);

    savePosts(updated);
  };

  return (
    <div className="bg-white/5 border border-white/10 rounded-3xl p-6">

      <div className="flex justify-between items-start">

        <div>

          <span className="text-purple-400 text-sm">
            {post.mood}
          </span>

          <p className="text-lg mt-3">
            {post.text}
          </p>

        </div>

        <button
          onClick={() => deletePost(post.id)}
          className="text-red-400 hover:text-red-300"
        >
          🗑️
        </button>

      </div>

      <span className="text-white/40 text-sm block mt-4">
        anonymous vibe
      </span>

      <div className="flex gap-4 mt-5 flex-wrap">

        <button
          onClick={() => {
            const updated = [...posts];
            updated[index].reactions.heart++;
            savePosts(updated);
          }}
        >
          ❤️ {post.reactions.heart}
        </button>

        <button
          onClick={() => {
            const updated = [...posts];
            updated[index].reactions.cry++;
            savePosts(updated);
          }}
        >
          😭 {post.reactions.cry}
        </button>

        <button
          onClick={() => {
            const updated = [...posts];
            updated[index].reactions.fire++;
            savePosts(updated);
          }}
        >
          🔥 {post.reactions.fire}
        </button>

        <button
          onClick={() => {
            const updated = [...posts];
            updated[index].reactions.hug++;
            savePosts(updated);
          }}
        >
          🫂 {post.reactions.hug}
        </button>

        <button
          onClick={() => {
            const updated = [...posts];
            updated[index].reactions.moon++;
            savePosts(updated);
          }}
        >
          🌙 {post.reactions.moon}
        </button>

      </div>

      <button
        onClick={() => setShowComments(!showComments)}
        className="mt-5 text-purple-400 hover:text-purple-300"
      >
        💬 {post.comments.length} Comments
      </button>

      {showComments && (
        <CommentSection
          comments={post.comments}
          onAddComment={addComment}
        />
      )}

    </div>
  );
}