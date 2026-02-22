"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Phone, Video, MoreVertical, ArrowLeft, Users } from "lucide-react"

interface ChatHeaderProps {
  name: string
  avatar?: string
  online?: boolean
  onBack?: () => void
  showBackButton?: boolean
  onProfileClick?: () => void
  isGroup?: boolean
  memberCount?: number
}

export function ChatHeader({ 
  name, 
  avatar, 
  online, 
  onBack, 
  showBackButton, 
  onProfileClick,
  isGroup,
  memberCount 
}: ChatHeaderProps) {
  return (
    <div className="flex items-center justify-between border-b border-border bg-card px-4 py-3">
      <div className="flex items-center gap-3">
        {showBackButton && (
          <button
            onClick={onBack}
            className="mr-1 rounded-full p-2 text-muted-foreground transition-colors hover:bg-secondary hover:text-card-foreground md:hidden"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
        )}
        <button
          onClick={onProfileClick}
          disabled={!onProfileClick}
          className="flex items-center gap-3 rounded-lg p-1 transition-colors hover:bg-secondary disabled:cursor-default disabled:hover:bg-transparent"
        >
          {isGroup ? (
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
              <Users className="h-5 w-5 text-primary" />
            </div>
          ) : (
            <Avatar className="h-10 w-10">
              <AvatarImage src={avatar} alt={name} />
              <AvatarFallback className="bg-primary/10 text-primary">
                {name.split(" ").map(n => n[0]).join("")}
              </AvatarFallback>
            </Avatar>
          )}
          <div className="text-left">
            <h2 className="font-semibold text-card-foreground">{name}</h2>
            <p className="text-xs text-muted-foreground">
              {isGroup ? (
                <span>{memberCount} members</span>
              ) : online ? (
                <span className="flex items-center gap-1">
                  <span className="h-2 w-2 rounded-full bg-green-500" />
                  Online
                </span>
              ) : (
                "Offline"
              )}
            </p>
          </div>
        </button>
      </div>
      <div className="flex items-center gap-1">
        <button className="rounded-full p-2 text-muted-foreground transition-colors hover:bg-secondary hover:text-card-foreground">
          <Phone className="h-5 w-5" />
        </button>
        <button className="rounded-full p-2 text-muted-foreground transition-colors hover:bg-secondary hover:text-card-foreground">
          <Video className="h-5 w-5" />
        </button>
        <button className="rounded-full p-2 text-muted-foreground transition-colors hover:bg-secondary hover:text-card-foreground">
          <MoreVertical className="h-5 w-5" />
        </button>
      </div>
    </div>
  )
}
