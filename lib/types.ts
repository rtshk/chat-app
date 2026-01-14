export interface Message {
  id: string
  content?: string
  senderId: string
  senderName?: string
  timestamp: string
  attachmentUrl?: string
  attachmentType?: string
  status?: "sent" | "delivered" | "read"
  replyTo?: {
    id: string
    content: string
    senderName: string
  }
}

export interface Conversation {
  id: string
  name: string
  avatar?: string
  lastMessage: string
  time: string
  lastMessageAt?: string
  lastClearedAt?: string
  unread?: number
  online?: boolean
  isGroup: boolean
  members?: { name: string; avatar?: string }[]
}

export interface UserProfile {
  id: string
  name: string
  email: string
  avatar?: string
  about: string
  phone: string
}

export interface ContactProfile {
  id: string
  name: string
  avatar?: string
  email?: string
  phone?: string
  about: string
  lastSeen?: string
}

export interface GroupMember {
  id: string
  name: string
  avatar?: string
}

export interface GroupProfile {
  id: string
  name: string
  members: GroupMember[]
}

export type NavView = "dm" | "groups"
