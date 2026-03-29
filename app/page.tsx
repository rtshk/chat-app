"use client"

import { ChatProvider } from "@/context/ChatContext"
import { ChatLayout } from "@/components/chat/chat-layout"

export default function ChatPage() {
  return (
    <ChatProvider>
      <ChatLayout />
    </ChatProvider>
  )
}
