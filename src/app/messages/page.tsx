"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import { supabase } from "@/lib/supabase";

type Conversation = {
  id: string;
  username: string;
  avatar: string;
  lastMessage: string;
};

export default function MessagesPage() {
  const [conversations, setConversations] = useState<
    Conversation[]
  >([]);

  useEffect(() => {
    loadConversations();
  }, []);

  const loadConversations = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return;

    const { data: messages } = await supabase
      .from("messages")
      .select("*")
      .or(
        `sender_id.eq.${user.id},receiver_id.eq.${user.id}`
      )
      .order("created_at", {
        ascending: false,
      });

    if (!messages) return;

    const map = new Map<string, Conversation>();

    for (const msg of messages) {
      const otherUser =
        msg.sender_id === user.id
          ? msg.receiver_id
          : msg.sender_id;

      if (map.has(otherUser)) continue;

      const { data: profile } = await supabase
        .from("profiles")
        .select("username,avatar")
        .eq("id", otherUser)
        .single();

      map.set(otherUser, {
        id: otherUser,
        username: profile?.username || "Unknown",
        avatar: profile?.avatar || "",
        lastMessage: msg.message || "",
      });
    }

    setConversations(
      Array.from(map.values())
    );
  };

  return (
    <main className="min-h-screen bg-black text-white px-6 py-20">

      <div className="max-w-3xl mx-auto">

        <Navbar />

        <h1 className="text-5xl font-black mb-10">
          💬 Messages
        </h1>

        {conversations.length === 0 && (
          <div className="text-white/50">
            No conversations yet.
          </div>
        )}

        <div className="space-y-4">

          {conversations.map((chat) => (
            <Link
              key={chat.id}
              href={`/messages/${chat.id}`}
            >
              <div className="bg-white/5 border border-white/10 rounded-2xl p-5 hover:bg-white/10 transition cursor-pointer flex gap-4 items-center">

                {chat.avatar ? (
                  <img
                    src={chat.avatar}
                    alt="avatar"
                    className="w-14 h-14 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-14 h-14 rounded-full bg-purple-500 flex items-center justify-center">
                    👤
                  </div>
                )}

                <div>

                  <h2 className="font-bold text-lg">
                    {chat.username}
                  </h2>

                  <p className="text-white/50 truncate max-w-md">
                    {chat.lastMessage}
                  </p>

                </div>

              </div>
            </Link>
          ))}

        </div>

      </div>

    </main>
  );
}