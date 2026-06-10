"use client";

import { useEffect } from "react";
import { supabase } from "@/lib/supabase";

export default function ProfilePage() {
  useEffect(() => {
    const redirectToOwnProfile = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        window.location.href = "/";
        return;
      }

      window.location.href = `/user/${user.id}`;
    };

    redirectToOwnProfile();
  }, []);

  return (
    <main className="min-h-screen bg-black text-white flex items-center justify-center">
      Loading...
    </main>
  );
}