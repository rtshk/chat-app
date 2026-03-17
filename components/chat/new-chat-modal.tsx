"use client"

import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Search, UserPlus, Users } from "lucide-react"
import { cn } from "@/lib/utils"

interface User {
  id: string
  name: string
  avatar?: string
  phone: string
  email?: string
}

interface NewChatModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  allUsers: User[]
  onSelectUser: (user: User) => void
  onCreateGroup?: (name: string, userIds: string[]) => void
}

export function NewChatModal({ open, onOpenChange, allUsers, onSelectUser, onCreateGroup }: NewChatModalProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [isGroupMode, setIsGroupMode] = useState(false)
  const [selectedUserIds, setSelectedUserIds] = useState<string[]>([])
  const [groupName, setGroupName] = useState("")
  const [step, setStep] = useState<1 | 2>(1) // 1: Select members, 2: Name group

  const filteredUsers = searchQuery.trim() === "" 
    ? [] 
    : allUsers.filter(user =>
        user.email && user.email.toLowerCase().includes(searchQuery.toLowerCase())
      )

  const handleSelect = (user: User) => {
    if (isGroupMode) {
      setSelectedUserIds(prev => 
        prev.includes(user.id) 
          ? prev.filter(id => id !== user.id)
          : [...prev, user.id]
      )
    } else {
      onSelectUser(user)
      onOpenChange(false)
      setSearchQuery("")
    }
  }

  const handleNext = () => {
    if (selectedUserIds.length > 0) {
      setStep(2)
    }
  }

  const handleCreate = () => {
    if (groupName.trim() && onCreateGroup) {
      onCreateGroup(groupName.trim(), selectedUserIds)
      reset()
    }
  }

  const reset = () => {
    onOpenChange(false)
    setIsGroupMode(false)
    setSelectedUserIds([])
    setGroupName("")
    setSearchQuery("")
    setStep(1)
  }

  return (
    <Dialog open={open} onOpenChange={(val) => { if(!val) reset(); onOpenChange(val); }}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {isGroupMode ? <Users className="h-5 w-5" /> : <UserPlus className="h-5 w-5" />}
            {isGroupMode ? (step === 1 ? "Add Group Members" : "Name Your Group") : "New Conversation"}
          </DialogTitle>
          <DialogDescription>
            {isGroupMode 
              ? (step === 1 ? "Select participants for your new group." : "Give your group a name to get started.")
              : "Search for a user by name or email to start a new chat."}
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4">
          {step === 1 ? (
            <>
              {!isGroupMode && (
                <button
                  onClick={() => setIsGroupMode(true)}
                  className="flex w-full items-center gap-3 rounded-lg bg-primary/10 p-3 text-left text-primary transition-colors hover:bg-primary/20"
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-primary-foreground">
                    <Users className="h-5 w-5" />
                  </div>
                  <span className="font-semibold">New Group</span>
                </button>
              )}

              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search by registered email..."
                  className="pl-9"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  autoFocus
                />
              </div>

              <div className="custom-scrollbar max-h-72 space-y-1 overflow-y-auto">
                {filteredUsers.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-8 text-muted-foreground">
                    <Search className="mb-2 h-8 w-8 opacity-50" />
                    <p className="text-sm">No users found</p>
                  </div>
                ) : (
                  filteredUsers.map((user) => (
                    <button
                      key={user.id}
                      onClick={() => handleSelect(user)}
                      className={cn(
                        "flex w-full items-center gap-3 rounded-lg p-3 text-left transition-colors hover:bg-secondary",
                        selectedUserIds.includes(user.id) && "bg-secondary ring-1 ring-primary/30"
                      )}
                    >
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={user.avatar} alt={user.name} />
                        <AvatarFallback className="bg-primary/10 text-primary">
                          {user.name.split(" ").map(n => n[0]).join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <p className="font-medium text-foreground">{user.name}</p>
                        <div className="flex flex-col gap-0.5">
                          {user.email && <p className="text-[11px] leading-tight text-muted-foreground">{user.email}</p>}
                          {user.phone && <p className="text-[10px] leading-tight text-muted-foreground/70">{user.phone}</p>}
                        </div>
                      </div>
                      {isGroupMode && (
                        <div className={cn(
                          "h-5 w-5 rounded-full border-2 transition-all",
                          selectedUserIds.includes(user.id) 
                            ? "border-primary bg-primary" 
                            : "border-muted-foreground/30"
                        )}>
                          {selectedUserIds.includes(user.id) && (
                            <svg className="h-full w-full p-0.5 text-primary-foreground" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                          )}
                        </div>
                      )}
                    </button>
                  ))
                )}
              </div>

              {isGroupMode && selectedUserIds.length > 0 && (
                <div className="flex justify-end pt-2">
                  <Button onClick={handleNext} className="rounded-full px-8">
                    Next
                  </Button>
                </div>
              )}
            </>
          ) : (
            <div className="space-y-4 py-4">
              <div className="flex flex-col items-center gap-4">
                <div className="flex h-20 w-20 items-center justify-center rounded-full bg-primary/10">
                  <Users className="h-10 w-10 text-primary" />
                </div>
                <div className="w-full space-y-2">
                  <label className="text-sm font-medium">Group Name</label>
                  <Input 
                    placeholder="Enter group name..."
                    value={groupName}
                    onChange={(e) => setGroupName(e.target.value)}
                    autoFocus
                  />
                </div>
              </div>
              <div className="flex justify-between pt-4">
                <Button variant="ghost" onClick={() => setStep(1)}>Back</Button>
                <Button onClick={handleCreate} disabled={!groupName.trim()}>Create Group</Button>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
