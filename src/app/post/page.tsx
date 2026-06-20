"use client";

import Navbar from "@/components/Navbar";
import PostComposer from "@/components/PostComposer";
import FeedList from "@/components/FeedList";

export default function PostPage() {
  return (
    <main className="min-h-screen bg-black text-white px-6 py-20">

      <div className="max-w-2xl mx-auto">

        <Navbar />

        <h1 className="text-5xl font-black mb-2">
          Home Feed ✨
        </h1>

        <p className="text-white/50 mb-10">
          Posts from people you follow and yourself.
        </p>

        <PostComposer />

        <div className="mt-12">
          <FeedList />
        </div>

      </div>

    </main>
  );
}