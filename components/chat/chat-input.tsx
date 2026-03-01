"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Send, Paperclip, X, ImageIcon, FileIcon, Loader2, Mic } from "lucide-react"
import { EmojiPicker } from "./emoji-picker"
import { VoiceRecorder } from "./voice-recorder"
import { type Message } from "@/lib/types"
import { createClient } from "@/lib/supabase/client"
import { motion, AnimatePresence } from "framer-motion"
import { useToast } from "@/hooks/use-toast"

const MAX_FILE_SIZE = 10 * 1024 * 1024 // 10MB

interface ChatInputProps {
  onSend: (message: string, replyTo?: Message["replyTo"], attachment?: { url: string, type: string }) => void
  disabled?: boolean
  replyingTo?: {
    message: Message
    senderName: string
  } | null
  onCancelReply?: () => void
}

export function ChatInput({ onSend, disabled, replyingTo, onCancelReply }: ChatInputProps) {
  const [message, setMessage] = useState("")
  const [file, setFile] = useState<File | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const [filePreview, setFilePreview] = useState<string | null>(null)
  const [isRecording, setIsRecording] = useState(false)
  
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const supabase = createClient()
  const { toast } = useToast()

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]
    if (selectedFile) {
      if (selectedFile.size > MAX_FILE_SIZE) {
        toast({
          title: "File too large",
          description: "Please select a file smaller than 10MB.",
          variant: "destructive",
        })
        return
      }
      setFile(selectedFile)
      if (selectedFile.type.startsWith("image/")) {
        const reader = new FileReader()
        reader.onload = (e) => setFilePreview(e.target?.result as string)
        reader.readAsDataURL(selectedFile)
      } else {
        setFilePreview(null)
      }
    }
  }

  const uploadFile = async (file: File) => {
    const fileExt = file.name.split('.').pop()
    const fileName = `${Math.random()}.${fileExt}`
    const filePath = `chat-attachments/${fileName}`

    const { data, error } = await supabase.storage
      .from('chat-attachments')
      .upload(filePath, file)

    if (error) {
      console.error('Error uploading file:', error)
      toast({
        title: "Upload failed",
        description: "Could not upload file. Please try again.",
        variant: "destructive",
      })
      return null
    }

    const { data: { publicUrl } } = supabase.storage
      .from('chat-attachments')
      .getPublicUrl(filePath)

    return publicUrl
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if ((message.trim() || file) && !disabled && !isUploading) {
      setIsUploading(true)
      
      let attachment = undefined
      if (file) {
        const url = await uploadFile(file)
        if (url) {
          attachment = { url, type: file.type }
        }
      }

      if (replyingTo) {
        onSend(message.trim(), {
          id: replyingTo.message.id,
          content: replyingTo.message.content || "",
          senderName: replyingTo.senderName,
        }, attachment)
      } else {
        onSend(message.trim(), undefined, attachment)
      }
      
      setMessage("")
      setFile(null)
      setFilePreview(null)
      setIsUploading(false)
    }
  }

  const handleVoiceSend = async (blob: Blob) => {
    setIsUploading(true)
    setIsRecording(false)

    const fileName = `${Math.random()}.webm`
    const filePath = `chat-attachments/${fileName}`

    const { data, error } = await supabase.storage
      .from('chat-attachments')
      .upload(filePath, blob)

    if (error) {
      console.error('Error uploading voice:', error)
      toast({
        title: "Upload failed",
        description: "Could not upload voice message. Please try again.",
        variant: "destructive",
      })
      setIsUploading(false)
      return
    }

    const { data: { publicUrl } } = supabase.storage
      .from('chat-attachments')
      .getPublicUrl(filePath)

    onSend("", undefined, { url: publicUrl, type: 'audio/webm' })
    setIsUploading(false)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSubmit(e)
    }
  }

  const handleEmojiSelect = (emoji: string) => {
    const textarea = textareaRef.current
    if (textarea) {
      const start = textarea.selectionStart
      const end = textarea.selectionEnd
      const newMessage = message.slice(0, start) + emoji + message.slice(end)
      setMessage(newMessage)
      // Set cursor position after emoji
      setTimeout(() => {
        textarea.selectionStart = textarea.selectionEnd = start + emoji.length
        textarea.focus()
      }, 0)
    } else {
      setMessage(prev => prev + emoji)
    }
  }

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto"
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 120)}px`
    }
  }, [message])

  useEffect(() => {
    if (replyingTo && textareaRef.current) {
      textareaRef.current.focus()
    }
  }, [replyingTo])

  return (
    <form onSubmit={handleSubmit} className="border-t border-border bg-card">
      {/* Reply Preview (WhatsApp style) */}
      {replyingTo && (
        <motion.div 
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: "auto", opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          className="relative border-b border-border bg-background px-4 py-2"
        >
          <div className="flex items-center gap-3 overflow-hidden rounded-md bg-secondary/40 p-2">
            <div className="h-10 w-1 flex-shrink-0 rounded-full bg-primary shadow-[0_0_8px_rgba(var(--primary),0.4)]" />
            <div className="min-w-0 flex-1 overflow-hidden">
              <p className="text-[11px] font-bold text-primary">
                Replying to {replyingTo.senderName}
              </p>
              <p className="truncate text-xs text-muted-foreground opacity-80">
                {replyingTo.message.content || "Attachment"}
              </p>
            </div>
            <button
              type="button"
              onClick={onCancelReply}
              className="flex-shrink-0 rounded-full p-1 text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </motion.div>
      )}
      
      {/* File Preview */}
      {file && (
        <div className="flex items-center gap-3 border-b border-border bg-secondary/30 px-4 py-2">
          {filePreview ? (
            <div className="relative h-12 w-12 overflow-hidden rounded-md border border-border">
              <img src={filePreview} alt="Preview" className="h-full w-full object-cover" />
            </div>
          ) : (
            <div className="flex h-12 w-12 items-center justify-center rounded-md border border-border bg-background">
              <FileIcon className="h-6 w-6 text-muted-foreground" />
            </div>
          )}
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium">{file.name}</p>
            <p className="text-xs text-muted-foreground">{(file.size / 1024).toFixed(1)} KB</p>
          </div>
          <button
            type="button"
            onClick={() => { setFile(null); setFilePreview(null); }}
            className="rounded-full p-1.5 text-muted-foreground hover:bg-secondary"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      )}
      
      <div className="p-4">
        <div className="mx-auto flex max-w-3xl items-end gap-2">
          {isRecording ? (
            <VoiceRecorder 
              onSend={handleVoiceSend} 
              onCancel={() => setIsRecording(false)} 
            />
          ) : (
            <>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                className="hidden"
              />
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="mb-2 rounded-full p-2 text-muted-foreground transition-colors hover:bg-secondary hover:text-card-foreground"
                disabled={isUploading}
              >
                <Paperclip className="h-5 w-5" />
              </motion.button>
              <div className="flex flex-1 items-end rounded-2xl bg-secondary px-4 py-2">
                <textarea
                  ref={textareaRef}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Type a message..."
                  rows={1}
                  className="custom-scrollbar max-h-[120px] flex-1 resize-none bg-transparent py-1.5 text-sm text-card-foreground placeholder:text-muted-foreground focus:outline-none"
                  disabled={disabled || isUploading}
                />
                <EmojiPicker onEmojiSelect={handleEmojiSelect} />
              </div>
              {message.trim() || file ? (
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button
                    type="submit"
                    size="icon"
                    className="mb-0.5 h-10 w-10 rounded-full shadow-lg"
                    disabled={disabled || isUploading}
                  >
                    {isUploading ? (
                      <Loader2 className="h-5 w-5 animate-spin" />
                    ) : (
                      <Send className="h-5 w-5" />
                    )}
                  </Button>
                </motion.div>
              ) : (
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  type="button"
                  onClick={() => setIsRecording(true)}
                  className="mb-0.5 flex h-10 w-10 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg transition-transform"
                  disabled={disabled || isUploading}
                >
                  <Mic className="h-5 w-5" />
                </motion.button>
              )}
            </>
          )}
        </div>
      </div>
    </form>
  )
}
