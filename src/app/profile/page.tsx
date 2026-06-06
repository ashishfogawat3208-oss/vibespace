"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import Navbar from "@/components/Navbar";

type Profile = {
  id: string;
  username: string;
  avatar: string;
  bio: string;
};

export default function ProfilePage() {
  const [profile, setProfile] = useState<Profile | null>(
    null
  );

  const [bio, setBio] = useState("");

  const [postCount, setPostCount] = useState(0);

  const loadProfile = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      window.location.href = "/";
      return;
    }

    const { data } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", user.id)
      .single();

    if (data) {
      setProfile(data);
      setBio(data.bio || "");
    }

    const { count } = await supabase
      .from("posts")
      .select("*", {
        count: "exact",
        head: true,
      })
      .eq("email", user.email);

    setPostCount(count || 0);
  };

  useEffect(() => {
    loadProfile();
  }, []);

  const saveBio = async () => {
    if (!profile) return;

    await supabase
      .from("profiles")
      .update({
        bio,
      })
      .eq("id", profile.id);

    alert("Bio Updated 🚀");
  };

  if (!profile) {
    return (
      <main className="min-h-screen bg-black text-white flex items-center justify-center">
        Loading...
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-black text-white px-6 py-20">

      <div className="max-w-3xl mx-auto">

        <Navbar />

        <div className="bg-white/5 border border-white/10 rounded-3xl p-8">

          <div className="flex flex-col items-center">

            <img
              src={profile.avatar}
              alt="avatar"
              className="w-32 h-32 rounded-full object-cover mb-5"
            />

            <h1 className="text-4xl font-black mb-2">
              {profile.username}
            </h1>

            <p className="text-purple-400 mb-8">
              {postCount} Posts
            </p>

          </div>

          <div>

            <label className="block mb-3 text-white/60">
              Bio
            </label>

            <textarea
              value={bio}
              onChange={(e) =>
                setBio(e.target.value)
              }
              className="w-full h-40 bg-black/30 border border-white/10 rounded-2xl p-4 resize-none"
              placeholder="Tell people about yourself..."
            />

            <button
              onClick={saveBio}
              className="mt-5 bg-purple-500 hover:bg-purple-400 px-6 py-3 rounded-xl"
            >
              Save Bio
            </button>

          </div>

        </div>

      </div>

    </main>
  );
}