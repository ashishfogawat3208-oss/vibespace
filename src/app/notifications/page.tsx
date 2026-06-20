"use client";

import Navbar from "@/components/Navbar";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

type Notification = {
  id: number;
  text: string;
  type: string;
};

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<
    Notification[]
  >([]);

  useEffect(() => {
    loadNotifications();
  }, []);

  const loadNotifications = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return;

    const { data } = await supabase
      .from("notifications")
      .select("*")
      .eq("receiver_id", user.id)
      .order("id", {
        ascending: false,
      });

    setNotifications(data || []);
  };

  return (
    <main className="min-h-screen bg-black text-white px-6 py-20">

      <div className="max-w-3xl mx-auto">

        <Navbar />

        <h1 className="text-5xl font-black mb-10">
          🔔 Notifications
        </h1>

        <div className="space-y-5">

          {notifications.length === 0 && (
            <div className="text-white/50">
              No notifications yet 🚀
            </div>
          )}

          {notifications.map((notification) => (
            <div
              key={notification.id}
              className="bg-white/5 border border-white/10 rounded-2xl p-5"
            >
              {notification.text}
            </div>
          ))}

        </div>

      </div>

    </main>
  );
}