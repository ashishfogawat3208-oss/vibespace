"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import FeedPost from "./FeedPost";

type DbPost = {
  id: number;
  user_id: string;
  text: string;
  mood: string;
  username: string;
  avatar: string;
  email: string;
  image_url: string | null;
  comments: string[];
  heart: number;
  cry: number;
  fire: number;
  hug: number;
  moon: number;
};

export default function FeedList() {
  const [posts, setPosts] = useState<DbPost[]>([]);
  const [currentUserEmail, setCurrentUserEmail] =
    useState("");

  const loadPosts = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return;

    setCurrentUserEmail(user.email || "");

    const { data: follows } = await supabase
      .from("follows")
      .select("following_id")
      .eq("follower_id", user.id);

    let ids =
      follows?.map(
        (item) => item.following_id
      ) || [];

    ids.push(user.id);

    const { data } = await supabase
      .from("posts")
      .select("*")
      .in("user_id", ids)
      .order("id", {
        ascending: false,
      });

    setPosts(data || []);
  };

  useEffect(() => {
    loadPosts();

    const channel = supabase
      .channel("posts-realtime")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "posts",
        },
        () => {
          loadPosts();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return (
    <div className="space-y-6">

      {posts.length === 0 && (
        <div className="text-center text-white/50">
          Follow people to build your feed 🚀
        </div>
      )}

      {posts.map((post) => (
        <FeedPost
          key={post.id}
          post={post}
          currentUserEmail={
            currentUserEmail
          }
          refreshPosts={loadPosts}
        />
      ))}

    </div>
  );
}