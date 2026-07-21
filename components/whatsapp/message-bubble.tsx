import { Check, CheckCheck } from "lucide-react"

export interface ChatMessage {
  id: string
  text: string
  sender: "me" | "them"
  time: string
  status?: "sent" | "delivered" | "read"
}

export function MessageBubble({ message }: { message: ChatMessage }) {
  const isMe = message.sender === "me"

  return (
    <div className={`flex w-full ${isMe ? "justify-end" : "justify-start"}`}>
      <div
        className={`relative max-w-[80%] rounded-lg px-2 py-1.5 shadow-sm ${
          isMe
            ? "rounded-tr-none bg-[#d9fdd3]"
            : "rounded-tl-none bg-white"
        }`}
      >
        {/* Rabinho da bolha */}
        <span
          aria-hidden="true"
          className={`absolute top-0 h-0 w-0 border-8 ${
            isMe
              ? "-right-2 border-t-[#d9fdd3] border-l-[#d9fdd3] border-r-transparent border-b-transparent"
              : "-left-2 border-t-white border-r-white border-l-transparent border-b-transparent"
          }`}
        />

        <p className="whitespace-pre-wrap break-words pr-1 text-[14.5px] leading-[19px] text-[#111b21]">
          {message.text}
          {/* Espaço reservado para hora ficar na última linha */}
          <span className="inline-block w-16" aria-hidden="true" />
        </p>

        <span className="absolute bottom-1 right-2 flex items-center gap-0.5 text-[11px] leading-none text-[#667781]">
          {message.time}
          {isMe && message.status === "read" && (
            <CheckCheck className="h-4 w-4 text-[#53bdeb]" aria-label="Lida" />
          )}
          {isMe && message.status === "delivered" && (
            <CheckCheck className="h-4 w-4" aria-label="Entregue" />
          )}
          {isMe && message.status === "sent" && (
            <Check className="h-4 w-4" aria-label="Enviada" />
          )}
        </span>
      </div>
    </div>
  )
}

export function TypingBubble() {
  return (
    <div className="flex w-full justify-start">
      <div className="relative rounded-lg rounded-tl-none bg-white px-4 py-3 shadow-sm">
        <span
          aria-hidden="true"
          className="absolute -left-2 top-0 h-0 w-0 border-8 border-t-white border-r-white border-l-transparent border-b-transparent"
        />
        <div className="flex items-center gap-1" aria-label="Digitando">
          <span className="h-2 w-2 animate-bounce rounded-full bg-[#8696a0] [animation-delay:0ms]" />
          <span className="h-2 w-2 animate-bounce rounded-full bg-[#8696a0] [animation-delay:150ms]" />
          <span className="h-2 w-2 animate-bounce rounded-full bg-[#8696a0] [animation-delay:300ms]" />
        </div>
      </div>
    </div>
  )
}
