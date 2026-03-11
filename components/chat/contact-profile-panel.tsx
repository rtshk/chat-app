"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { cn } from "@/lib/utils"
import { X, ArrowLeft, Phone, Mail, Image, Link as LinkIcon, FileText } from "lucide-react"

export interface ContactProfile {
  id: string
  name: string
  avatar?: string
  email?: string
  about?: string
  lastSeen?: string
  online?: boolean
}

interface ContactProfilePanelProps {
  contact: ContactProfile | null
  isOpen: boolean
  onClose: () => void
}

import { motion } from "framer-motion"

export function ContactProfilePanel({ contact, isOpen, onClose }: ContactProfilePanelProps) {
  if (!contact) return null


  return (
    <motion.div
      initial={{ x: "100%" }}
      animate={{ x: 0 }}
      exit={{ x: "100%" }}
      transition={{ type: "spring", damping: 25, stiffness: 200 }}
      className="fixed inset-y-0 right-0 z-50 w-80 bg-card shadow-xl"
    >
      <div className="flex h-full flex-col">
        {/* Header */}
        <div className="flex items-center gap-3 border-b border-border p-4">
          <button
            onClick={onClose}
            className="rounded-full p-2 text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <h2 className="flex-1 text-lg font-semibold">Contact Info</h2>
          <button
            onClick={onClose}
            className="rounded-full p-2 text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto">
          {/* Profile Section */}
          <div className="flex flex-col items-center px-4 py-6">
            <Avatar className="h-28 w-28">
              <AvatarImage src={contact.avatar} alt={contact.name} />
              <AvatarFallback className="bg-primary/10 text-primary text-3xl">
                {contact.name.split(" ").map(n => n[0]).join("")}
              </AvatarFallback>
            </Avatar>
            <h3 className="mt-4 text-xl font-semibold">{contact.name}</h3>
            <p className="text-sm text-muted-foreground">
              {contact.online ? (
                <span className="flex items-center gap-1">
                  <span className="h-2 w-2 rounded-full bg-green-500" />
                  Online
                </span>
              ) : (
                contact.lastSeen || "Last seen recently"
              )}
            </p>
          </div>

          <Separator />

          {/* About Section */}
          <div className="space-y-4 p-4">
            <div>
              <p className="text-xs font-medium text-muted-foreground">ABOUT</p>
              <p className="mt-1 text-sm">{contact.about || "Hey there! I am using Chat App"}</p>
            </div>
          </div>

          <Separator />

          {/* Contact Info */}
          <div className="space-y-3 p-4">
            <p className="text-xs font-medium text-muted-foreground">CONTACT INFO</p>
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                <Mail className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="font-medium">{contact.email || "No email"}</p>
                <p className="text-xs text-muted-foreground">Email</p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </motion.div>
  )
}
