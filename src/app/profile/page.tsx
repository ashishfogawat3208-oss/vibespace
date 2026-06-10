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

type Post = {
  id: number;
  text: string;
  image_url: string | null;
};

export default function ProfilePage() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [bio, setBio] = useState("");
  const [posts, setPosts] = useState<Post[]>([]);
  const [followers, setFollowers] = useState(0);
  const [following, setFollowing] = useState(0);

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      window.location.href = "/";
      return;
    }

    const { data: profileData } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", user.id)
      .single();

    if (profileData) {
      setProfile(profileData);
      setBio(profileData.bio || "");
    }

    const { data: userPosts } = await supabase
      .from("posts")
      .select("*")
      .eq("user_id", user.id)
      .order("id", { ascending: false });

    setPosts(userPosts || []);

    const { count: followersCount } = await supabase
      .from("follows")
      .select("*", {
        count: "exact",
        head: true,
      })
      .eq("following_id", user.id);

    setFollowers(followersCount || 0);

    const { count: followingCount } = await supabase
      .from("follows")
      .select("*", {
        count: "exact",
        head: true,
      })
      .eq("follower_id", user.id);

    setFollowing(followingCount || 0);
  };

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
      <div className="max-w-4xl mx-auto">

        <Navbar />

        <div className="bg-white/5 border border-white/10 rounded-3xl p-8">

          <div className="flex flex-col items-center">

            <img
              src={profile.avatar}
              alt="avatar"
              className="w-32 h-32 rounded-full object-cover mb-5"
            />

            <h1 className="text-4xl font-black mb-4">
              {profile.username}
            </h1>

            <p className="text-white/60 text-center mb-5">
              {profile.bio}
            </p>

            <div className="flex gap-10 mb-8">

              <div>
                <div className="font-bold text-center text-xl">
                  {posts.length}
                </div>
                <div className="text-white/50">
                  Posts
                </div>
              </div>

              <div>
                <div className="font-bold text-center text-xl">
                  {followers}
                </div>
                <div className="text-white/50">
                  Followers
                </div>
              </div>

              <div>
                <div className="font-bold text-center text-xl">
                  {following}
                </div>
                <div className="text-white/50">
                  Following
                </div>
              </div>

            </div>

          </div>

          <div>

            <label className="block mb-3 text-white/60">
              Bio
            </label>

            <textarea
              value={bio}
              onChange={(e) => setBio(e.target.value)}
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

        <div className="mt-12">

          <h2 className="text-3xl font-black mb-8">
            📸 Your Posts
          </h2>

          <div className="grid md:grid-cols-3 gap-6">

            {posts.map((post) => (
              <div
                key={post.id}
                className="bg-white/5 border border-white/10 rounded-3xl overflow-hidden"
              >
                {post.image_url ? (
                  <img
                    src={post.image_url}
                    alt="post"
                    className="w-full h-60 object-cover"
                  />
                ) : (
                  <div className="h-60 flex items-center justify-center text-6xl">
                    ✨
                  </div>
                )}

                <div className="p-4">
                  <p className="text-white/80">
                    {post.text}
                  </p>
                </div>

              </div>
            ))}

          </div>

        </div>

      </div>
    </main>
  );
}