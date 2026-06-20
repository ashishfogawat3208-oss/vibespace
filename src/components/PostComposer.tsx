"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";

type Mood =
  | "💔 Heartbroken"
  | "😌 Peaceful"
  | "🔥 Motivated"
  | "🌙 Midnight Thoughts"
  | "😂 Funny"
  | "😤 Frustrated";

export default function PostComposer() {
  const [text, setText] = useState("");
  const [mood, setMood] =
    useState<Mood>("🌙 Midnight Thoughts");

  const [image, setImage] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);

  const handlePost = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return;

    if (!text.trim() && !image) return;

    setUploading(true);

    let imageUrl: string | null = null;

    if (image) {
      const fileName = `${Date.now()}-${image.name}`;

      const { error: uploadError } =
        await supabase.storage
          .from("post-images")
          .upload(fileName, image);

      if (!uploadError) {
        const { data } = supabase.storage
          .from("post-images")
          .getPublicUrl(fileName);

        imageUrl = data.publicUrl;
      }
    }

    await supabase.from("posts").insert([
      {
        text,
        mood,
        user_id: user.id,
        username:
          user.user_metadata?.full_name ||
          user.email,

        avatar:
          user.user_metadata?.avatar_url ||
          "",

        email:
          user.email,

        image_url: imageUrl,

        comments: [],
        heart: 0,
        cry: 0,
        fire: 0,
        hug: 0,
        moon: 0,
      },
    ]);

    setText("");
    setImage(null);
    setMood("🌙 Midnight Thoughts");
    setUploading(false);
  };

  return (
    <div className="bg-white/5 border border-white/10 rounded-3xl p-6">

      <select
        value={mood}
        onChange={(e) =>
          setMood(e.target.value as Mood)
        }
        className="w-full mb-4 bg-black/30 border border-white/10 rounded-xl p-3"
      >
        <option>💔 Heartbroken</option>
        <option>😌 Peaceful</option>
        <option>🔥 Motivated</option>
        <option>🌙 Midnight Thoughts</option>
        <option>😂 Funny</option>
        <option>😤 Frustrated</option>
      </select>

      <textarea
        value={text}
        onChange={(e) =>
          setText(e.target.value)
        }
        placeholder="What's on your mind?"
        className="w-full h-40 bg-black/30 border border-white/10 rounded-2xl p-5 resize-none"
      />

      <input
        type="file"
        accept="image/*"
        className="mt-4"
        onChange={(e) =>
          setImage(
            e.target.files?.[0] || null
          )
        }
      />

      {image && (
        <img
          src={URL.createObjectURL(image)}
          alt="preview"
          className="mt-4 rounded-2xl max-h-64 object-cover"
        />
      )}

      <div className="flex justify-end mt-5">

        <button
          onClick={handlePost}
          className="bg-purple-500 hover:bg-purple-400 px-6 py-3 rounded-full"
        >
          {uploading
            ? "Uploading..."
            : "Post Vibe"}
        </button>

      </div>

    </div>
  );
}