"use client";

import { useState } from "react";

type ReplyMessage = {
  id: number;
  message: string;
};

type Props = {
  onSend: (text: string, image: File | null) => Promise<void>;

  sending: boolean;

  replyingTo: ReplyMessage | null;

  onCancelReply: () => void;
};

export default function ChatInput({
  onSend,
  sending,
  replyingTo,
  onCancelReply,
}: Props) {
  const [text, setText] = useState("");

  const [image, setImage] = useState<File | null>(null);

  async function send() {
    if (!text.trim() && !image) return;

    await onSend(text, image);

    setText("");

    setImage(null);
  }

  return (
    <>

      {replyingTo && (
        <div className="mb-3 rounded-xl border border-purple-500/30 bg-purple-500/10 px-4 py-3 flex items-start justify-between">

          <div>

            <div className="text-xs text-purple-300 font-semibold">
              ↩ Replying
            </div>

            <div className="text-sm text-white/80 line-clamp-2">
              {replyingTo.message}
            </div>

          </div>

          <button
            onClick={onCancelReply}
            className="ml-4 text-red-400 hover:text-red-300"
          >
            ✕
          </button>

        </div>
      )}

      {image && (
        <div className="mb-3 rounded-xl bg-white/10 px-4 py-2 flex justify-between items-center">

          <span className="truncate">
            📷 {image.name}
          </span>

          <button
            onClick={() => setImage(null)}
            className="text-red-400"
          >
            ✕
          </button>

        </div>
      )}

      <div className="flex gap-3">

        <input
          id="chat-image"
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => {
            if (e.target.files?.length) {
              setImage(e.target.files[0]);
            }
          }}
        />

        <label
          htmlFor="chat-image"
          className="cursor-pointer rounded-xl bg-white/10 hover:bg-white/20 px-5 py-3"
        >
          📷
        </label>

        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder={
            replyingTo
              ? "Reply..."
              : "Type a message..."
          }
          className="flex-1 rounded-xl border border-white/10 bg-black/30 px-5 py-3"
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              send();
            }
          }}
        />

        <button
          disabled={sending}
          onClick={send}
          className="rounded-xl bg-purple-500 px-6 hover:bg-purple-400 disabled:opacity-50"
        >
          {sending ? "..." : "Send"}
        </button>

      </div>

    </>
  );
}