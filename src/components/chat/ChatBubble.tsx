"use client";

type Message = {
  id: number;
  sender_id: string;
  receiver_id: string;
  message: string;
  image_url: string | null;
  created_at: string;
  seen?: boolean;
  edited?: boolean;
};

type Props = {
  message: Message;
  isOwn: boolean;
};

export default function ChatBubble({ message, isOwn }: Props) {
  return (
    <div
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
        {message.message && (
          <p className="whitespace-pre-wrap break-words">
            {message.message}
          </p>
        )}

        {message.image_url && (
          <img
            src={message.image_url}
            alt="Chat"
            className="mt-3 rounded-xl max-h-80 w-full object-cover"
          />
        )}

        <div className="mt-2 flex items-center justify-between text-[11px] opacity-70">
          <span>
            {new Date(message.created_at).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </span>

          {isOwn && (
            <span>
              {message.seen ? "✓✓ Seen" : "✓ Sent"}
            </span>
          )}
        </div>

        {message.edited && (
          <div className="text-[10px] italic opacity-60 mt-1">
            edited
          </div>
        )}
      </div>
    </div>
  );
}