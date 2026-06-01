"use client";

import Navbar from "@/components/Navbar";
import PostComposer from "@/components/PostComposer";
import PostFeed from "@/components/PostFeed";

export default function PostPage() {
  return (
    <main className="min-h-screen bg-black text-white px-6 py-20">
      <div className="max-w-2xl mx-auto">

        <Navbar />

        <h1 className="text-5xl font-black mb-8">
          Share Your Vibe ✨
        </h1>

        <PostComposer />

        <div className="mt-12">
          <PostFeed />
        </div>

      </div>
    </main>
  );
}