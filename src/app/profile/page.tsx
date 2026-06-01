"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import Navbar from "@/components/Navbar";

export default function ProfilePage() {
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user);
    });
  }, []);

  return (
    <main className="min-h-screen bg-black text-white px-6 py-20">

      <div className="max-w-3xl mx-auto">

        <Navbar />

        {user && (
          <div className="bg-white/5 border border-white/10 rounded-3xl p-8 text-center">

            <img
              src={user.user_metadata?.avatar_url}
              alt="avatar"
              className="w-28 h-28 rounded-full mx-auto mb-6"
            />

            <h1 className="text-4xl font-black mb-2">
              {user.user_metadata?.full_name}
            </h1>

            <p className="text-white/50">
              {user.email}
            </p>

          </div>
        )}

      </div>

    </main>
  );
}