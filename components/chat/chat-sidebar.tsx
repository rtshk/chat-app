"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { cn } from "@/lib/utils"
import { Search, Plus, MessageSquare, Users, MoreVertical, Trash2, ChevronDown } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"

import { Conversation } from "@/lib/types"
import { motion, AnimatePresence } from "framer-motion"

interface ChatSidebarProps {
  conversations: Conversation[]
  selectedId: string
  onSelectConversation: (id: string) => void
  onDeleteConversation: (id: string) => void
  searchQuery: string
  onSearchChange: (query: string) => void
  onNewChat: () => void
  navView: "dm" | "groups"
  setNavView: (view: "dm" | "groups") => void
}

export function ChatSidebar({ 
  conversations, 
  selectedId, 
  onSelectConversation,
  onDeleteConversation,
  searchQuery,
  onSearchChange,
  onNewChat,
  navView,
  setNavView
}: ChatSidebarProps) {
  const filteredConversations = conversations.filter(conversation =>
    conversation.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="flex h-full w-full flex-col bg-card/60 backdrop-blur-xl dark:bg-card/40">
      <div className="flex items-center justify-between p-4 pb-2">
        <h1 className="text-xl font-bold tracking-tight text-card-foreground">Chat</h1>
        <div className="flex items-center gap-1">
          <button 
            onClick={() => setNavView("dm")}
            className={cn(
              "p-2 rounded-lg transition-colors",
              navView === "dm" ? "bg-primary/10 text-primary" : "text-muted-foreground hover:bg-secondary"
            )}
          >
            <MessageSquare className="h-5 w-5" />
          </button>
          <button 
            onClick={() => setNavView("groups")}
            className={cn(
              "p-2 rounded-lg transition-colors",
              navView === "groups" ? "bg-primary/10 text-primary" : "text-muted-foreground hover:bg-secondary"
            )}
          >
            <Users className="h-5 w-5" />
          </button>
          <div className="w-px h-6 bg-border mx-1" />
          <button 
            onClick={onNewChat}
            className="p-2 rounded-full bg-primary text-primary-foreground shadow-sm hover:scale-105 active:scale-95 transition-transform"
          >
            <Plus className="h-5 w-5" />
          </button>
        </div>
      </div>
      
      <div className="px-4 pb-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search conversations..."
            className="pl-9 bg-secondary border-none"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
          />
        </div>
      </div>

      <div className="custom-scrollbar flex-1 overflow-y-auto pb-20 md:pb-0">
        <AnimatePresence initial={false}>
          {filteredConversations.length === 0 ? (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center justify-center py-12 text-muted-foreground"
            >
              <Search className="mb-2 h-8 w-8 opacity-50" />
              <p className="text-sm">No conversations found</p>
            </motion.div>
          ) : (
            filteredConversations.map((conv) => (
              <motion.div
                layout
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                key={conv.id}
                className={cn(
                  "group flex w-full items-center gap-3 px-4 py-3 text-left transition-colors hover:bg-secondary/80",
                  selectedId === conv.id && "bg-secondary"
                )}
              >
                <div className="relative flex-shrink-0 cursor-pointer" onClick={() => onSelectConversation(conv.id)}>
                  {conv.isGroup && conv.members ? (
                    <GroupAvatar members={conv.members} />
                  ) : (
                    <Avatar className="h-12 w-12">
                      <AvatarImage src={conv.avatar} alt={conv.name} />
                      <AvatarFallback className="bg-primary/10 text-primary">
                        {conv.name.split(" ").map(n => n[0]).join("")}
                      </AvatarFallback>
                    </Avatar>
                  )}
                  {conv.online && !conv.isGroup && (
                    <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-card bg-green-500" />
                  )}
                </div>
                <div 
                  onClick={() => onSelectConversation(conv.id)}
                  className="flex-1 min-w-0 cursor-pointer"
                >
                  <div className="flex items-center justify-between gap-2">
                    <p className="truncate text-sm font-semibold text-card-foreground">{conv.name}</p>
                    <span className="shrink-0 text-[10px] text-muted-foreground">{conv.time}</span>
                  </div>
                  <div className="flex items-center justify-between gap-2">
                    <p className="truncate text-xs text-muted-foreground">
                      {conv.lastMessage}
                    </p>
                    {typeof conv.unread === 'number' && conv.unread > 0 ? (
                      <span className="flex h-5 min-w-5 flex-shrink-0 items-center justify-center rounded-full bg-primary px-1.5 text-xs font-medium text-primary-foreground">
                        {conv.unread}
                      </span>
                    ) : (
                      <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <button 
                              onClick={(e) => e.stopPropagation()}
                              className="p-1 rounded-full hover:bg-secondary text-muted-foreground"
                            >
                              <ChevronDown className="h-4 w-4" />
                            </button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="w-32">
                            <DropdownMenuItem 
                              onClick={(e) => {
                                e.stopPropagation();
                                onDeleteConversation(conv.id);
                              }}
                              className="text-destructive focus:text-destructive gap-2 cursor-pointer"
                            >
                              <Trash2 className="h-4 w-4" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            ))
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}

function GroupAvatar({ members }: { members: { name: string; avatar?: string }[] }) {
  const displayMembers = members.slice(0, 3)
  
  return (
    <div className="relative h-12 w-12">
      {displayMembers.map((member, index) => {
        const size = displayMembers.length === 1 ? 48 : displayMembers.length === 2 ? 32 : 28
        const positions = getAvatarPositions(displayMembers.length, index)
        
        return (
          <Avatar
            key={index}
            className="absolute border-2 border-card"
            style={{
              width: size,
              height: size,
              ...positions
            }}
          >
            <AvatarImage src={member.avatar} alt={member.name} />
            <AvatarFallback className="bg-primary/10 text-primary text-xs">
              {member.name.split(" ").map(n => n[0]).join("")}
            </AvatarFallback>
          </Avatar>
        )
      })}
    </div>
  )
}

function getAvatarPositions(total: number, index: number): React.CSSProperties {
  if (total === 1) {
    return { top: 0, left: 0 }
  }
  if (total === 2) {
    return index === 0 
      ? { top: 0, left: 0 }
      : { bottom: 0, right: 0 }
  }
  // 3 avatars
  if (index === 0) return { top: 0, left: "50%", transform: "translateX(-50%)" }
  if (index === 1) return { bottom: 0, left: 0 }
  return { bottom: 0, right: 0 }
}
