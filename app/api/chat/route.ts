import { NextResponse } from "next/server"

const N8N_WEBHOOK_URL =
  "https://automacao.v4kuri.com.br/webhook/35487ad2-6cf9-4eb0-9918-86ddb77163b7/chat"

export async function POST(request: Request) {
  try {
    const { message, sessionId } = await request.json()

    if (!message || typeof message !== "string") {
      return NextResponse.json({ error: "Mensagem inválida" }, { status: 400 })
    }

    const response = await fetch(N8N_WEBHOOK_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        action: "sendMessage",
        sessionId: sessionId || crypto.randomUUID(),
        chatInput: message,
      }),
    })

    if (!response.ok) {
      return NextResponse.json(
        { error: "Erro ao comunicar com o chatbot" },
        { status: 502 }
      )
    }

    const data = await response.json()

    return NextResponse.json({ output: data.output ?? "" })
  } catch {
    return NextResponse.json(
      { error: "Erro interno no servidor" },
      { status: 500 }
    )
  }
}
