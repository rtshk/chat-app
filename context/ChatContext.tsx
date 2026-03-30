"use client"

import React, { createContext, useContext, ReactNode } from "react"
import { useChatState } from "@/hooks/use-chat-state"
import { useUserProfile } from "@/hooks/use-user-profile"

type ChatContextType = ReturnType<typeof useChatState> & ReturnType<typeof useUserProfile>

const ChatContext = createContext<ChatContextType | undefined>(undefined)

export function ChatProvider({ children }: { children: ReactNode }) {
  const userProfile = useUserProfile()
  const chatState = useChatState(userProfile.currentUser?.id)

  const value = {
    ...chatState,
    ...userProfile,
  }

  return (
    <ChatContext.Provider value={value}>
      {children}
    </ChatContext.Provider>
  )
}

export function useChat() {
  const context = useContext(ChatContext)
  if (context === undefined) {
    throw new Error("useChat must be used within a ChatProvider")
  }
  return context
}
