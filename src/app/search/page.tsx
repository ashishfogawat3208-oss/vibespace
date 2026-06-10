"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import Navbar from "@/components/Navbar";

type Profile = {
  id: string;
  username: string;
  avatar: string;
};

export default function SearchPage() {
  const [search, setSearch] = useState("");
  const [users, setUsers] = useState<Profile[]>([]);

  useEffect(() => {
    const searchUsers = async () => {
      if (!search.trim()) {
        setUsers([]);
        return;
      }

      const { data } = await supabase
        .from("profiles")
        .select("*")
        .ilike("username", `%${search}%`);

      setUsers(data || []);
    };

    searchUsers();
  }, [search]);

  return (
    <main className="min-h-screen bg-black text-white px-6 py-20">

      <div className="max-w-3xl mx-auto">

        <Navbar />

        <h1 className="text-5xl font-black mb-8">
          🔎 Search Users
        </h1>

        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search usernames..."
          className="w-full bg-black/30 border border-white/10 rounded-2xl p-5 mb-10"
        />

        <div className="space-y-5">

          {users.map((user) => (
            <a
              key={user.id}
              href={`/user/${user.id}`}
              className="flex items-center gap-4 bg-white/5 border border-white/10 rounded-2xl p-5 hover:bg-white/10"
            >
              <img
                src={user.avatar}
                alt="avatar"
                className="w-14 h-14 rounded-full object-cover"
              />

              <div className="text-xl font-bold">
                {user.username}
              </div>

            </a>
          ))}

        </div>

      </div>

    </main>
  );
}