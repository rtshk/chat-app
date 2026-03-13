"use client"

import { useState } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { cn } from "@/lib/utils"
import { X, ArrowLeft, Users, UserPlus, UserMinus, Search, Image, Link as LinkIcon, FileText } from "lucide-react"
import { motion } from "framer-motion"

export interface GroupMember {
  id: string
  name: string
  avatar?: string
}

export interface GroupProfile {
  id: string
  name: string
  members: GroupMember[]
  createdAt?: string
}

interface GroupProfilePanelProps {
  group: GroupProfile | null
  isOpen: boolean
  onClose: () => void
  allUsers: { id: string; name: string; avatar?: string }[]
  onAddMember: (userId: string) => void
  onRemoveMember: (userId: string) => void
}

export function GroupProfilePanel({
  group,
  isOpen,
  onClose,
  allUsers,
  onAddMember,
  onRemoveMember,
}: GroupProfilePanelProps) {
  const [showAddMember, setShowAddMember] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")

  if (!group) return null

  const memberIds = new Set(group.members.map(m => m.id))
  const availableUsers = allUsers.filter(
    u => !memberIds.has(u.id) && u.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const mediaItems = [
    { icon: Image, label: "Photos", count: 24 },
    { icon: LinkIcon, label: "Links", count: 8 },
    { icon: FileText, label: "Documents", count: 12 },
  ]

  return (
    <>
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
            <h2 className="flex-1 text-lg font-semibold">Group Info</h2>
            <button
              onClick={onClose}
              className="rounded-full p-2 text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Content */}
          <div className="custom-scrollbar flex-1 overflow-y-auto">
            {/* Group Avatar Section */}
            <div className="flex flex-col items-center px-4 py-6">
              <div className="flex h-28 w-28 items-center justify-center rounded-full bg-primary/10">
                <Users className="h-14 w-14 text-primary" />
              </div>
              <h3 className="mt-4 text-xl font-semibold">{group.name}</h3>
              <p className="text-sm text-muted-foreground">
                Group · {group.members.length} members
              </p>
            </div>

            <Separator />

            {/* Members Section */}
            <div className="p-4">
              <div className="flex items-center justify-between">
                <p className="text-xs font-medium text-muted-foreground">
                  {group.members.length} MEMBERS
                </p>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowAddMember(true)}
                  className="h-8 gap-1 text-primary hover:text-primary"
                >
                  <UserPlus className="h-4 w-4" />
                  Add
                </Button>
              </div>

              <div className="mt-3 space-y-1">
                {group.members.map((member) => (
                  <div
                    key={member.id}
                    className="group flex items-center gap-3 rounded-lg p-2 transition-colors hover:bg-secondary"
                  >
                    <Avatar className="h-10 w-10 flex-shrink-0">
                      <AvatarImage src={member.avatar} alt={member.name} />
                      <AvatarFallback className="bg-primary/10 text-primary text-sm">
                        {member.name.split(" ").map(n => n[0]).join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div className="min-w-0 flex-1">
                      <p className="truncate font-medium">{member.name}</p>
                    </div>
                    <button
                      onClick={() => onRemoveMember(member.id)}
                      className="rounded-full p-1.5 text-muted-foreground opacity-0 transition-all hover:bg-destructive/10 hover:text-destructive group-hover:opacity-100"
                      title="Remove member"
                    >
                      <UserMinus className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <Separator />

            {/* Media & Links */}
            <div className="p-4">
              <p className="text-xs font-medium text-muted-foreground">MEDIA, LINKS AND DOCS</p>
              <div className="mt-3 grid grid-cols-3 gap-2">
                {mediaItems.map((item) => (
                  <button
                    key={item.label}
                    className="flex flex-col items-center gap-1 rounded-lg border border-border p-3 transition-colors hover:bg-secondary"
                  >
                    <item.icon className="h-5 w-5 text-muted-foreground" />
                    <span className="text-xs">{item.label}</span>
                    <span className="text-xs text-muted-foreground">{item.count}</span>
                  </button>
                ))}
              </div>
            </div>

            <Separator />

            {/* Group Settings (Placeholder) */}
            <div className="p-4">
              <p className="text-xs font-medium text-muted-foreground">GROUP SETTINGS</p>
              <div className="mt-3 space-y-2">
                <button className="flex w-full items-center gap-3 rounded-lg p-2 text-left transition-colors hover:bg-secondary">
                  <span className="text-sm">Mute notifications</span>
                </button>
                <button className="flex w-full items-center gap-3 rounded-lg p-2 text-left text-destructive transition-colors hover:bg-destructive/10">
                  <span className="text-sm">Exit group</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Add Member Dialog */}
      <Dialog open={showAddMember} onOpenChange={setShowAddMember}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Add Members</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search users..."
                className="pl-9"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="custom-scrollbar max-h-64 space-y-1 overflow-y-auto">
              {availableUsers.length === 0 ? (
                <p className="py-8 text-center text-sm text-muted-foreground">
                  {searchQuery ? "No users found" : "All users are already members"}
                </p>
              ) : (
                availableUsers.map((user) => (
                  <button
                    key={user.id}
                    onClick={() => {
                      onAddMember(user.id)
                      setSearchQuery("")
                    }}
                    className="flex w-full items-center gap-3 rounded-lg p-2 transition-colors hover:bg-secondary"
                  >
                    <Avatar className="h-10 w-10 flex-shrink-0">
                      <AvatarImage src={user.avatar} alt={user.name} />
                      <AvatarFallback className="bg-primary/10 text-primary text-sm">
                        {user.name.split(" ").map(n => n[0]).join("")}
                      </AvatarFallback>
                    </Avatar>
                    <span className="font-medium">{user.name}</span>
                    <UserPlus className="ml-auto h-4 w-4 text-primary" />
                  </button>
                ))
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
