import { GoogleGenerativeAI } from "@google/generative-ai"
import { NextResponse } from "next/server"

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "")
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" })

export async function POST(req: Request) {
  try {
    const { messages, prompt } = await req.json()

    // Create a context for the AI
    const chat = model.startChat({
      history: messages.map((m: any) => ({
        role: m.senderId === 'ai-assistant' ? 'model' : 'user',
        parts: [{ text: m.content }],
      })),
      generationConfig: {
        maxOutputTokens: 500,
      },
    })

    const result = await chat.sendMessage(prompt)
    const response = await result.response
    const text = response.text()

    return NextResponse.json({ text })
  } catch (error) {
    console.error("AI Chat Error:", error)
    return NextResponse.json({ error: "Failed to get AI response" }, { status: 500 })
  }
}
