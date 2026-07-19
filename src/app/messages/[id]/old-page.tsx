"use client";

import { useEffect, useRef, useState } from "react";
import { useParams } from "next/navigation";
import Navbar from "@/components/Navbar";
import { supabase } from "@/lib/supabase";

type Message = {
  id: number;
  sender_id: string;
  receiver_id: string;
  message: string;
  image_url: string | null;
  created_at: string;
};

export default function ChatPage() {
  const params = useParams();

  const [messages, setMessages] = useState<Message[]>([]);
  const [text, setText] = useState("");
  const [userId, setUserId] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [sending, setSending] = useState(false);

  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    loadMessages();

    const channel = supabase
      .channel("messages-realtime")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "messages",
        },
        () => {
          loadMessages();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [params]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [messages]);

  const loadMessages = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return;

    setUserId(user.id);

    const otherUser = params.id as string;

    const { data } = await supabase
      .from("messages")
      .select("*")
      .or(
        `and(sender_id.eq.${user.id},receiver_id.eq.${otherUser}),and(sender_id.eq.${otherUser},receiver_id.eq.${user.id})`
      )
      .order("created_at", {
        ascending: true,
      });

    setMessages(data || []);
  };

  const sendMessage = async () => {
    if (!text.trim() && !image) return;

    setSending(true);

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      setSending(false);
      return;
    }

    let imageUrl: string | null = null;

    if (image) {
      const fileName = `${Date.now()}-${image.name}`;

      const { error } = await supabase.storage
        .from("post-images")
        .upload(fileName, image);

      if (!error) {
        imageUrl = supabase.storage
          .from("post-images")
          .getPublicUrl(fileName).data.publicUrl;
      }
    }

    const { error } = await supabase.from("messages").insert([
      {
        sender_id: user.id,
        receiver_id: params.id,
        message: text,
        image_url: imageUrl,
      },
    ]);

    if (!error) {
      setText("");
      setImage(null);
      loadMessages();
    }

    setSending(false);
  };

  return (
    <main className="min-h-screen bg-black text-white px-6 py-20">
      <div className="max-w-3xl mx-auto">

        <Navbar />

        <h1 className="text-4xl font-black mb-8">
          💬 Chat
        </h1>

        <div className="bg-white/5 border border-white/10 rounded-3xl p-6 h-[65vh] overflow-y-auto">

          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`mb-4 flex ${
                msg.sender_id === userId
                  ? "justify-end"
                  : "justify-start"
              }`}
            >
              <div
                className={`max-w-[75%] rounded-2xl px-4 py-3 ${
                  msg.sender_id === userId
                    ? "bg-purple-500"
                    : "bg-white/10"
                }`}
              >
                {msg.message && (
                  <p className="whitespace-pre-wrap break-words">
                    {msg.message}
                  </p>
                )}

                {msg.image_url && (
                  <img
                    src={msg.image_url}
                    alt="chat"
                    className="mt-3 rounded-xl max-h-80 w-full object-cover"
                  />
                )}
              </div>
            </div>
          ))}

          <div ref={bottomRef} />

        </div>

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
            onChange={(e) => {
              if (e.target.files?.length) {
                setImage(e.target.files[0]);
              }
            }}
            className="hidden"
            id="chat-image"
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
                sendMessage();
              }
            }}
          />

          <button
            disabled={sending}
            onClick={sendMessage}
            className="bg-purple-500 hover:bg-purple-400 px-6 rounded-xl disabled:opacity-50"
          >
            {sending ? "..." : "Send"}
          </button>

        </div>

      </div>
    </main>
  );
}