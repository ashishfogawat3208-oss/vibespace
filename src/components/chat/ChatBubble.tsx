"use client";

type ReplyMessage = {
  id: number;
  message: string;
};

type Message = {
  id: number;
  sender_id: string;
  receiver_id: string;

  message: string;

  image_url: string |null;

  created_at: string;

  seen?: boolean;

  edited?: boolean;

  reply?: ReplyMessage | null;
};

type Props = {
  message: Message;

  isOwn: boolean;

  onReplyClick?: () => void;
};

export default function ChatBubble({
  message,
  isOwn,
  onReplyClick,
}: Props) {
  return (
    <div
      id={`message-${message.id}`}
      className={`mb-4 flex ${
        isOwn ? "justify-end" : "justify-start"
      }`}
    >
      <div
        className={`max-w-[75%] rounded-2xl px-4 py-3 ${
          isOwn
            ? "bg-purple-600 text-white"
            : "bg-white/10 text-white"
        }`}
      >
        {message.reply && (
          <button
            type="button"
            onClick={onReplyClick}
            className="mb-3 w-full rounded-xl border-l-4 border-purple-400 bg-black/20 px-3 py-2 text-left transition hover:bg-black/30"
          >
            <div className="text-[11px] font-semibold text-purple-300">
              ↩ Reply
            </div>

            <div className="truncate text-xs opacity-80">
              {message.reply.message}
            </div>
          </button>
        )}

        {message.message && (
          <p className="whitespace-pre-wrap break-words">
            {message.message}
          </p>
        )}

        {message.image_url && (
          <img
            src={message.image_url}
            alt="Chat"
            className="mt-3 w-full max-h-80 rounded-xl object-cover"
          />
        )}

        <div className="mt-2 flex items-center justify-between text-[11px] opacity-70">
          <span>
            {new Date(
              message.created_at
            ).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </span>

          {isOwn && (
            <span>
              {message.seen
                ? "✓✓ Seen"
                : "✓ Sent"}
            </span>
          )}
        </div>

        {message.edited && (
          <div className="mt-1 text-[10px] italic opacity-60">
            edited
          </div>
        )}
      </div>
    </div>
  );
}