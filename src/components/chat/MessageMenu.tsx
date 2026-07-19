"use client";

import { useEffect, useRef, useState } from "react";

type Props = {
  onReply: () => void;
  onEdit: () => void;
  onDelete: () => void;
};

export default function MessageMenu({
  onReply,
  onEdit,
  onDelete,
}: Props) {
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const close = (e: MouseEvent) => {
      if (
        menuRef.current &&
        !menuRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", close);

    return () => {
      document.removeEventListener("mousedown", close);
    };
  }, []);

  const run = (fn: () => void) => {
    setOpen(false);
    fn();
  };

  return (
    <div ref={menuRef} className="relative inline-block">

      <button
        onClick={() => setOpen((v) => !v)}
        className="rounded-lg px-2 py-1 text-gray-300 transition hover:bg-white/10 hover:text-white"
      >
        ⋮
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-52 overflow-hidden rounded-2xl border border-white/10 bg-zinc-900 shadow-2xl backdrop-blur-xl z-50 animate-in fade-in zoom-in-95 duration-150">

          <button
            onClick={() => run(onReply)}
            className="flex w-full items-center gap-3 px-4 py-3 text-left hover:bg-white/10 transition"
          >
            ↩️
            <span>Reply</span>
          </button>

          <button
            onClick={() => run(onEdit)}
            className="flex w-full items-center gap-3 px-4 py-3 text-left hover:bg-white/10 transition"
          >
            ✏️
            <span>Edit Message</span>
          </button>

          <button
            onClick={() => run(onDelete)}
            className="flex w-full items-center gap-3 px-4 py-3 text-left text-red-400 hover:bg-red-500/20 transition"
          >
            🗑
            <span>Delete Message</span>
          </button>

        </div>
      )}

    </div>
  );
}