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
  created_at: string;
};

export default function ChatPage() {
  const params = useParams();

  const [messages, setMessages] = useState<Message[]>([]);
  const [text, setText] = useState("");
  const [userId, setUserId] = useState("");

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
  if (!text.trim()) return;

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    console.log("No user");
    return;
  }

  console.log("Sender:", user.id);
  console.log("Receiver:", params.id);

  const { data, error } = await supabase
    .from("messages")
    .insert([
      {
        sender_id: user.id,
        receiver_id: params.id,
        message: text,
      },
    ])
    .select();

  console.log("INSERT DATA:", data);
  console.log("INSERT ERROR:", error);

  if (!error) {
    setText("");
    loadMessages();
  }
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
                className={`max-w-[70%] px-5 py-3 rounded-2xl ${
                  msg.sender_id === userId
                    ? "bg-purple-500"
                    : "bg-white/10"
                }`}
              >
                {msg.message}
              </div>
            </div>
          ))}

          <div ref={bottomRef} />

        </div>

        <div className="flex gap-3 mt-6">

          <input
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Type a message..."
            className="flex-1 bg-black/30 border border-white/10 rounded-xl px-5 py-3"
          />

          <button
            onClick={sendMessage}
            className="bg-purple-500 hover:bg-purple-400 px-6 rounded-xl"
          >
            Send
          </button>

        </div>

      </div>

    </main>
  );
}