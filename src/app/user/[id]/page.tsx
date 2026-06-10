"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { supabase } from "@/lib/supabase";
import Navbar from "@/components/Navbar";

type Profile = {
  username: string;
  avatar: string;
  bio: string;
};

type Post = {
  id: number;
  text: string;
  image_url: string | null;
};

export default function UserPage() {
  const params = useParams();

  const [profile, setProfile] = useState<Profile | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);

  useEffect(() => {
    const loadUser = async () => {
      const id = params.id as string;

      if (!id) return;

      const { data: profileData, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", id)
        .single();

      console.log(profileData);
      console.log(error);

      if (profileData) {
        setProfile(profileData);
      }

      const { data: userPosts } = await supabase
        .from("posts")
        .select("*")
        .eq("user_id", id)
        .order("id", { ascending: false });

      setPosts(userPosts || []);
    };

    loadUser();
  }, [params]);

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

            <p className="text-white/60 text-center">
              {profile.bio}
            </p>

          </div>

        </div>

        <div className="mt-12">

          <h2 className="text-3xl font-black mb-8">
            📸 Posts
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
                  <p>{post.text}</p>
                </div>

              </div>
            ))}

          </div>

        </div>

      </div>
    </main>
  );
}