"use client"

import { useEffect, useRef, useState } from "react"
import { cn } from "@/lib/utils"
import { Message } from "@/lib/types"
import { Reply, Check, CheckCheck, FileIcon, Download, Play, Pause, MoreVertical, Trash2 } from "lucide-react"
import { format } from "date-fns"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

interface MessageListProps {
  messages: Message[]
  currentUserId: string
  participantName: string
  onReply: (message: Message) => void
  onDelete: (messageId: string) => void
  onMarkAsRead?: (messageId: string) => void
  isGroup?: boolean
}

export function MessageList({
  messages,
  currentUserId,
  participantName,
  onReply,
  onDelete,
  onMarkAsRead,
  isGroup,
}: MessageListProps) {
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [messages])

  useEffect(() => {
    if (onMarkAsRead) {
      messages.forEach(msg => {
        if (msg.senderId !== currentUserId && msg.status !== 'read') {
          onMarkAsRead(msg.id)
        }
      })
    }
  }, [messages, currentUserId, onMarkAsRead])

  return (
    <div 
      ref={scrollRef}
      className="flex-1 overflow-y-auto p-4 space-y-1 scrollbar-thin scrollbar-thumb-border scrollbar-track-transparent"
    >
      {messages.map((message, index) => {
        const isOwn = message.senderId === currentUserId
        const prevMessage = index > 0 ? messages[index - 1] : null
        const isFirstInGroup = !prevMessage || prevMessage.senderId !== message.senderId
        
        // Compact time format
        const time = format(new Date(message.timestamp), "HH:mm")

        return (
          <div
            key={message.id}
            className={cn(
              "group flex items-center gap-2 px-2",
              isOwn ? "flex-row-reverse" : "flex-row",
              isFirstInGroup ? "mt-3" : "mt-0"
            )}
          >

            {/* Message Bubble Container */}
            <div
              className={cn(
                "relative flex flex-col max-w-[85%] sm:max-w-[70%]",
                isOwn ? "items-end" : "items-start"
              )}
            >
              {/* The actual Bubble */}
              <div
                className={cn(
                  "relative flex flex-col rounded-2xl px-3 py-1.5 shadow-sm",
                  isOwn 
                    ? "bg-primary text-primary-foreground rounded-tr-none" 
                    : "bg-card text-card-foreground rounded-tl-none border border-border"
                )}
              >
                {/* Sender Name */}
                {isFirstInGroup && (
                  <p className={cn(
                    "text-[11px] font-bold mb-0.5",
                    isOwn ? "text-primary-foreground/90 text-right" : "text-primary text-left"
                  )}>
                    {isOwn ? "You" : message.senderName || "Unknown"}
                  </p>
                )}
                {/* Reply Context (WhatsApp Style) */}
                {message.replyTo && message.replyTo.id && (
                  <div className={cn(
                    "mb-1.5 border-l-[3px] border-primary/60 bg-secondary/40 p-2 py-1 rounded-r-md transition-colors",
                    isOwn 
                      ? "bg-white/10 border-white/40" 
                      : "bg-muted/50 border-primary/50"
                  )}>
                    <p className={cn(
                      "text-[11px] font-bold truncate",
                      isOwn ? "text-white" : "text-primary"
                    )}>
                      {message.replyTo.senderName || "Message"}
                    </p>
                    <p className={cn(
                      "text-xs truncate max-w-[200px] opacity-80",
                      isOwn ? "text-white/80" : "text-muted-foreground"
                    )}>
                      {message.replyTo.content || "Message not available"}
                    </p>
                  </div>
                )}

                {/* Content */}
                <div className="flex flex-wrap items-end gap-x-2">
                  <span className="text-[14px] leading-relaxed break-words py-0.5">
                    {message.content}
                  </span>
                  
                  {/* Timestamp & Status (Integrated into bubble) */}
                  <div className={cn(
                    "flex items-center gap-1 text-[10px] pb-0.5 mt-1 ml-auto",
                    isOwn ? "text-primary-foreground/70" : "text-muted-foreground"
                  )}>
                    <span>{time}</span>
                    {isOwn && (
                      <div className="flex items-center">
                        {message.status === 'read' ? (
                          <CheckCheck className="h-3 w-3 text-sky-400" />
                        ) : message.status === 'delivered' ? (
                          <CheckCheck className="h-3 w-3" />
                        ) : (
                          <Check className="h-3 w-3" />
                        )}
                      </div>
                    )}
                  </div>
                </div>

                {/* Inline Attachments */}
                {message.attachmentUrl && (
                  <div className="mt-2 overflow-hidden rounded-lg">
                    {message.attachmentType?.startsWith('image/') ? (
                      <div className="relative group/img">
                        <img 
                          src={message.attachmentUrl} 
                          alt="Attachment" 
                          className="max-h-64 w-full object-cover rounded-lg"
                        />
                        <a 
                          href={message.attachmentUrl} 
                          download
                          target="_blank"
                          rel="noopener noreferrer"
                          className="absolute inset-0 bg-black/20 opacity-0 group-hover/img:opacity-100 transition-opacity flex items-center justify-center rounded-lg"
                        >
                          <Download className="text-white h-8 w-8" />
                        </a>
                      </div>
                    ) : message.attachmentType?.startsWith('audio/') ? (
                      <VoiceMessage 
                        url={message.attachmentUrl} 
                        type={message.attachmentType || "audio/mpeg"} 
                        isOwn={isOwn} 
                      />
                    ) : (
                      <a 
                        href={message.attachmentUrl} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className={cn(
                          "flex items-center gap-3 p-3 rounded-lg border border-border/50 transition-colors hover:bg-secondary/50",
                          isOwn ? "bg-primary-foreground/10 border-primary-foreground/20" : "bg-card"
                        )}
                      >
                        <div className="flex h-10 w-10 items-center justify-center rounded bg-primary/10 text-primary">
                          <FileIcon className="h-5 w-5" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-sm font-medium">Attachment</p>
                          <p className="text-[10px] opacity-70">Click to view/download</p>
                        </div>
                        <Download className="h-4 w-4 opacity-50" />
                      </a>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Reply & Menu Buttons (Hidden until hover) */}
            <div className={cn(
              "flex items-center gap-1 opacity-0 transition-opacity group-hover:opacity-100 px-1",
              isOwn ? "mr-2" : "ml-2"
            )}>
              <button
                onClick={() => onReply(message)}
                className="p-1.5 rounded-full hover:bg-secondary text-muted-foreground hover:text-foreground transition-colors"
              >
                <Reply className="h-4 w-4" />
              </button>
              
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="p-1.5 rounded-full hover:bg-secondary text-muted-foreground hover:text-foreground transition-colors">
                    <MoreVertical className="h-4 w-4" />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align={isOwn ? "end" : "start"} className="w-32">
                  <DropdownMenuItem 
                    onClick={() => onDelete(message.id)}
                    className="text-destructive focus:text-destructive gap-2 cursor-pointer"
                  >
                    <Trash2 className="h-4 w-4" />
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        )
      })}
    </div>
  )
}

function VoiceMessage({ url, type, isOwn }: { url: string; type: string; isOwn: boolean }) {
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const audioRef = useRef<HTMLAudioElement>(null)

  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause()
      } else {
        audioRef.current.play()
      }
      setIsPlaying(!isPlaying)
    }
  }

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime)
    }
  }

  const handleLoadedMetadata = () => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration)
    }
  }

  const formatTime = (time: number) => {
    const mins = Math.floor(time / 60)
    const secs = Math.floor(time % 60)
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const progress = duration ? (currentTime / duration) * 100 : 0

  return (
    <div className={cn(
      "flex items-center gap-3 p-3 rounded-2xl min-w-[240px] bg-secondary/30 border border-border/50",
      isOwn ? "bg-primary-foreground/20 border-primary-foreground/20" : "bg-secondary/50"
    )}>
      <button 
        onClick={togglePlay}
        className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-sm transition-transform hover:scale-105 active:scale-95"
      >
        {isPlaying ? <Pause className="h-5 w-5 fill-current" /> : <Play className="h-5 w-5 fill-current ml-0.5" />}
      </button>
      <div className="flex-1 space-y-1.5">
        <div className="relative h-1.5 w-full rounded-full bg-muted-foreground/20 overflow-hidden">
          <div 
            className="absolute inset-y-0 left-0 bg-primary rounded-full transition-all duration-100" 
            style={{ width: `${progress}%` }}
          />
        </div>
        <div className="flex justify-between items-center text-[10px] font-medium opacity-70">
          <span>{formatTime(isPlaying ? currentTime : duration)}</span>
          <div className="flex items-center gap-1">
            <span className="h-1 w-1 rounded-full bg-current" />
            <span>Voice Note</span>
          </div>
        </div>
      </div>
      <audio 
        ref={audioRef}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onEnded={() => setIsPlaying(false)}
        className="hidden"
      >
        <source src={url} type={type} />
      </audio>
    </div>
  )
}
