"use client"

import { useEffect, useRef, useState } from "react"
import { Lock } from "lucide-react"
import { ChatHeader } from "./chat-header"
import { ChatInput } from "./chat-input"
import {
  MessageBubble,
  TypingBubble,
  type ChatMessage,
} from "./message-bubble"

function nowTime() {
  return new Date().toLocaleTimeString("pt-BR", {
    hour: "2-digit",
    minute: "2-digit",
  })
}

export function WhatsAppChat() {
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [isTyping, setIsTyping] = useState(false)
  const sessionIdRef = useRef<string>("")
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!sessionIdRef.current) {
      sessionIdRef.current = crypto.randomUUID()
    }
  }, [])

  useEffect(() => {
    scrollRef.current?.scrollTo({
      top: scrollRef.current.scrollHeight,
      behavior: "smooth",
    })
  }, [messages, isTyping])

  const handleSend = async (text: string) => {
    const userMessage: ChatMessage = {
      id: crypto.randomUUID(),
      text,
      sender: "me",
      time: nowTime(),
      status: "sent",
    }
    setMessages((prev) => [...prev, userMessage])
    setIsTyping(true)

    // Marca como entregue/lida rapidamente, como no WhatsApp
    setTimeout(() => {
      setMessages((prev) =>
        prev.map((m) =>
          m.id === userMessage.id ? { ...m, status: "delivered" } : m
        )
      )
    }, 500)
    setTimeout(() => {
      setMessages((prev) =>
        prev.map((m) =>
          m.id === userMessage.id ? { ...m, status: "read" } : m
        )
      )
    }, 1200)

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: text,
          sessionId: sessionIdRef.current,
        }),
      })

      const data = await res.json()

      const reply: ChatMessage = {
        id: crypto.randomUUID(),
        text:
          data.output ||
          "Desculpe, não consegui processar sua mensagem. Tente novamente.",
        sender: "them",
        time: nowTime(),
      }
      setMessages((prev) => [...prev, reply])
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          id: crypto.randomUUID(),
          text: "Erro de conexão. Verifique sua internet e tente novamente.",
          sender: "them",
          time: nowTime(),
        },
      ])
    } finally {
      setIsTyping(false)
    }
  }

  return (
    <div className="flex h-full flex-col overflow-hidden bg-[#efeae2]">
      <ChatHeader isTyping={isTyping} />

      <div
        ref={scrollRef}
        className="relative flex-1 overflow-y-auto bg-[#efe7dd] px-3 py-2 [background-image:url('/images/whatsapp-bg.webp')] [background-size:420px_auto] [background-repeat:repeat]"
      >
        <div className="flex flex-col gap-1.5">
          {/* Selo de data */}
          <div className="my-1 flex justify-center">
            <span className="rounded-lg bg-white px-3 py-1 text-xs font-medium uppercase text-[#54656f] shadow-sm">
              Hoje
            </span>
          </div>

          {/* Aviso de criptografia */}
          <div className="mb-2 flex justify-center">
            <p className="flex max-w-[85%] items-start gap-1 rounded-lg bg-[#ffeecd] px-3 py-1.5 text-center text-[12.5px] leading-snug text-[#54656f] shadow-sm">
              <Lock className="mt-0.5 h-3 w-3 shrink-0" aria-hidden="true" />
              <span>
                As mensagens são protegidas com a criptografia de ponta a
                ponta e ficam somente entre você e os participantes desta
                conversa.
              </span>
            </p>
          </div>

          {messages.map((message) => (
            <MessageBubble key={message.id} message={message} />
          ))}

          {isTyping && <TypingBubble />}
        </div>
      </div>

      <ChatInput onSend={handleSend} disabled={isTyping} />
    </div>
  )
}
