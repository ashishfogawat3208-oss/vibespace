"use client";

import { useEffect, useRef, useState } from "react";

type Props = {
  onEdit: () => void;
  onDelete: () => void;
};

export default function MessageMenu({
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

    return () =>
      document.removeEventListener("mousedown", close);
  }, []);

  return (
    <div
      ref={menuRef}
      className="relative inline-block"
    >
      <button
        onClick={() => setOpen(!open)}
        className="text-gray-300 hover:text-white px-2 py-1"
      >
        ⋮
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-48 rounded-xl border border-white/10 bg-zinc-900 shadow-xl overflow-hidden z-50">

          <button
            onClick={() => {
              setOpen(false);
              onEdit();
            }}
            className="w-full text-left px-4 py-3 hover:bg-white/10"
          >
            ✏️ Edit Message
          </button>

          <button
            onClick={() => {
              setOpen(false);
              onDelete();
            }}
            className="w-full text-left px-4 py-3 hover:bg-red-500/20 text-red-400"
          >
            🗑 Delete Message
          </button>

        </div>
      )}
    </div>
  );
}