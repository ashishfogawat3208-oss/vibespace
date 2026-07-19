"use client";

import { useState } from "react";

type Props = {
  onSend: (text: string, image: File | null) => Promise<void>;
  sending: boolean;
};

export default function ChatInput({
  onSend,
  sending,
}: Props) {
  const [text, setText] = useState("");
  const [image, setImage] = useState<File | null>(null);

  const send = async () => {
    if (!text.trim() && !image) return;

    await onSend(text, image);

    setText("");
    setImage(null);
  };

  return (
    <>
      {image && (
        <div className="mt-4 bg-white/10 rounded-xl px-4 py-2 flex justify-between items-center">
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

      <div className="flex gap-3 mt-6">

        <input
          type="file"
          accept="image/*"
          id="chat-image"
          className="hidden"
          onChange={(e) => {
            if (e.target.files?.length) {
              setImage(e.target.files[0]);
            }
          }}
        />

        <label
          htmlFor="chat-image"
          className="cursor-pointer bg-white/10 hover:bg-white/20 px-5 py-3 rounded-xl"
        >
          📷
        </label>

        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Type a message..."
          className="flex-1 bg-black/30 border border-white/10 rounded-xl px-5 py-3"
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              send();
            }
          }}
        />

        <button
          disabled={sending}
          onClick={send}
          className="bg-purple-500 hover:bg-purple-400 px-6 rounded-xl disabled:opacity-50"
        >
          {sending ? "..." : "Send"}
        </button>

      </div>
    </>
  );
}