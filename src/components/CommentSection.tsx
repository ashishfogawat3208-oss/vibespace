"use client";

import { useState } from "react";

type Props = {
  comments: string[];
  onAddComment: (comment: string) => void;
};

export default function CommentSection({
  comments,
  onAddComment,
}: Props) {
  const [comment, setComment] = useState("");

  return (
    <div className="mt-5 border-t border-white/10 pt-5">

      <div className="space-y-2 mb-4">

        {comments.map((item, index) => (
          <div
            key={index}
            className="bg-white/5 rounded-xl p-3 text-sm"
          >
            {item}
          </div>
        ))}

      </div>

      <div className="flex gap-2">

        <input
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Write a comment..."
          className="flex-1 bg-black/30 border border-white/10 rounded-xl px-4 py-2"
        />

        <button
          onClick={() => {
            if (!comment.trim()) return;

            onAddComment(comment);
            setComment("");
          }}
          className="bg-purple-500 hover:bg-purple-400 px-4 py-2 rounded-xl"
        >
          Send
        </button>

      </div>

    </div>
  );
}