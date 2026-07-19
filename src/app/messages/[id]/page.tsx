"use client";

import { useEffect, useRef, useState } from "react";
import { useParams } from "next/navigation";

import Navbar from "@/components/Navbar";
import ChatBubble from "@/components/chat/ChatBubble";
import ChatInput from "@/components/chat/ChatInput";
import MessageMenu from "@/components/chat/MessageMenu";

import { supabase } from "@/lib/supabase";

type Message = {
  id: number;
  sender_id: string;
  receiver_id: string;
  message: string;
  image_url: string | null;

  created_at: string;

  seen: boolean;
  seen_at: string | null;

  edited: boolean;
  deleted: boolean;
};

export default function ChatPage() {
  const params = useParams();

  const otherUser = params.id as string;

  const [messages, setMessages] = useState<Message[]>([]);

  const [userId, setUserId] = useState("");

  const [sending, setSending] = useState(false);

  const [editingId, setEditingId] = useState<number | null>(null);

  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    loadMessages();

    const channel = supabase
      .channel(`chat-${otherUser}`)
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
  }, [otherUser]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [messages]);

  async function markSeen(list: Message[], currentUser: string) {
    const unseen = list
      .filter(
        (m) =>
          m.receiver_id === currentUser &&
          m.sender_id === otherUser &&
          !m.seen
      )
      .map((m) => m.id);

    if (!unseen.length) return;

    await supabase
      .from("messages")
      .update({
        seen: true,
        seen_at: new Date().toISOString(),
      })
      .in("id", unseen);
  }

  async function loadMessages() {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return;

    setUserId(user.id);

    const { data } = await supabase
      .from("messages")
      .select("*")
      .or(
        `and(sender_id.eq.${user.id},receiver_id.eq.${otherUser}),and(sender_id.eq.${otherUser},receiver_id.eq.${user.id})`
      )
      .order("created_at", {
        ascending: true,
      });

    const list = (data || []).filter((m) => !m.deleted);

    setMessages(list);

    await markSeen(list, user.id);
  }

  async function uploadImage(file: File) {
    const fileName =
      Date.now() +
      "-" +
      Math.random().toString(36).substring(2) +
      "-" +
      file.name;

    const { error } = await supabase.storage
      .from("post-images")
      .upload(fileName, file);

    if (error) return null;

    return supabase.storage
      .from("post-images")
      .getPublicUrl(fileName).data.publicUrl;
  }
    async function sendMessage(text: string, image: File | null) {
    if (!text.trim() && !image) return;

    setSending(true);

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) return;

      let imageUrl: string | null = null;

      if (image) {
        imageUrl = await uploadImage(image);
      }

      const optimistic: Message = {
        id: Date.now(),
        sender_id: user.id,
        receiver_id: otherUser,
        message: text,
        image_url: imageUrl,
        created_at: new Date().toISOString(),
        seen: false,
        seen_at: null,
        edited: false,
        deleted: false,
      };

      setMessages((prev) => [...prev, optimistic]);

      bottomRef.current?.scrollIntoView({
        behavior: "smooth",
      });

      const { error } = await supabase.from("messages").insert([
        {
          sender_id: user.id,
          receiver_id: otherUser,
          message: text,
          image_url: imageUrl,
          seen: false,
          edited: false,
          deleted: false,
        },
      ]);

      if (error) {
        setMessages((prev) =>
          prev.filter((m) => m.id !== optimistic.id)
        );
        console.error(error);
      }
    } finally {
      setSending(false);
    }
  }

  async function editMessage(id: number) {
    const current = messages.find((m) => m.id === id);

    if (!current) return;

    const value = window.prompt(
      "Edit your message",
      current.message
    );

    if (value === null) return;

    const trimmed = value.trim();

    if (!trimmed) return;

    setMessages((prev) =>
      prev.map((m) =>
        m.id === id
          ? {
              ...m,
              message: trimmed,
              edited: true,
            }
          : m
      )
    );

    const { error } = await supabase
      .from("messages")
      .update({
        message: trimmed,
        edited: true,
      })
      .eq("id", id);

    if (error) {
      console.error(error);
      loadMessages();
    }

    setEditingId(null);
  }

  async function deleteMessage(id: number) {
    const confirmDelete = window.confirm(
      "Delete this message?"
    );

    if (!confirmDelete) return;

    setMessages((prev) =>
      prev.filter((m) => m.id !== id)
    );

    const { error } = await supabase
      .from("messages")
      .update({
        deleted: true,
      })
      .eq("id", id);

    if (error) {
      console.error(error);
      loadMessages();
    }
  }
    return (
    <main className="min-h-screen bg-black text-white px-6 py-20">
      <div className="max-w-3xl mx-auto">

        <Navbar />

        <h1 className="text-4xl font-black mb-8">
          💬 Chat
        </h1>

        <div className="bg-white/5 border border-white/10 rounded-3xl p-6 h-[65vh] overflow-y-auto">

          {messages.length === 0 && (
            <div className="h-full flex items-center justify-center text-white/40">
              Start your conversation 👋
            </div>
          )}

          {messages.map((msg) => {
            const isOwn = msg.sender_id === userId;

            return (
              <div key={msg.id} className="group relative">

                <ChatBubble
                  message={msg}
                  isOwn={isOwn}
                />

                {isOwn && (
                  <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition">

                    <MessageMenu
                      onEdit={() => {
                        setEditingId(msg.id);
                        editMessage(msg.id);
                      }}
                      onDelete={() => deleteMessage(msg.id)}
                    />

                  </div>
                )}

              </div>
            );
          })}

          <div ref={bottomRef} />

        </div>

        {editingId && (
          <div className="mt-4 rounded-xl border border-yellow-500/30 bg-yellow-500/10 px-4 py-3 text-sm text-yellow-300">
            Editing message...
          </div>
        )}

        <ChatInput
          onSend={sendMessage}
          sending={sending}
        />

      </div>
    </main>
  );
}