"use client"

import { useState } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import { cn } from "@/lib/utils"
import {
  X,
  Camera,
  User,
  Shield,
  Bell,
  Palette,
  ChevronRight,
  ArrowLeft,
  Moon,
  Sun,
  LogOut,
} from "lucide-react"

export interface UserProfile {
  id: string
  name: string
  email: string
  avatar?: string
  about?: string
  phone?: string
}

interface UserProfilePanelProps {
  user: UserProfile
  isOpen: boolean
  onClose: () => void
  onUpdateUser: (user: UserProfile) => void
  theme: "light" | "dark" | "system"
  onThemeChange: (theme: "light" | "dark" | "system") => void
  onLogout: () => void
}

type SettingsSection = "main" | "account" | "privacy" | "notifications" | "appearance"

import { motion } from "framer-motion"

export function UserProfilePanel({
  user,
  isOpen,
  onClose,
  onUpdateUser,
  theme,
  onThemeChange,
  onLogout,
}: UserProfilePanelProps) {
  const [activeSection, setActiveSection] = useState<SettingsSection>("main")
  const [editedUser, setEditedUser] = useState(user)
  const [isEditing, setIsEditing] = useState(false)

  const handleSave = () => {
    onUpdateUser(editedUser)
    setIsEditing(false)
  }

  const handleCancel = () => {
    setEditedUser(user)
    setIsEditing(false)
  }

  const handleBack = () => {
    if (activeSection !== "main") {
      setActiveSection("main")
    } else {
      onClose()
    }
  }

  const settingsItems = [
    { id: "account" as const, icon: User, label: "Account", description: "Manage your account" },
    { id: "privacy" as const, icon: Shield, label: "Privacy", description: "Privacy settings" },
    { id: "notifications" as const, icon: Bell, label: "Notifications", description: "Notification preferences" },
    { id: "appearance" as const, icon: Palette, label: "Appearance", description: "Theme and display" },
  ]

  return (
    <motion.div
      initial={{ x: "-100%" }}
      animate={{ x: 0 }}
      exit={{ x: "-100%" }}
      transition={{ type: "spring", damping: 25, stiffness: 200 }}
      className="fixed inset-y-0 left-0 z-50 w-80 bg-card shadow-xl"
    >
      <div className="flex h-full flex-col">
        {/* Header */}
        <div className="flex items-center gap-3 border-b border-border p-4">
          <button
            onClick={handleBack}
            className="rounded-full p-2 text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <h2 className="flex-1 text-lg font-semibold">
            {activeSection === "main" && "Profile"}
            {activeSection === "account" && "Account"}
            {activeSection === "privacy" && "Privacy"}
            {activeSection === "notifications" && "Notifications"}
            {activeSection === "appearance" && "Appearance"}
          </h2>
          <button
            onClick={onClose}
            className="rounded-full p-2 text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto">
          {activeSection === "main" && (
            <div className="space-y-6">
              {/* Profile Section */}
              <div className="flex flex-col items-center px-4 pt-6">
                <div className="relative">
                  <Avatar className="h-24 w-24">
                    <AvatarImage src={editedUser.avatar} alt={editedUser.name} />
                    <AvatarFallback className="bg-primary/10 text-primary text-2xl">
                      {editedUser.name.split(" ").map(n => n[0]).join("")}
                    </AvatarFallback>
                  </Avatar>
                  <button className="absolute bottom-0 right-0 rounded-full bg-primary p-2 text-primary-foreground shadow-md transition-transform hover:scale-105">
                    <Camera className="h-4 w-4" />
                  </button>
                </div>
              </div>

              {/* Editable Fields */}
              <div className="space-y-4 px-4">
                {isEditing ? (
                  <>
                    <div className="space-y-2">
                      <Label htmlFor="name">Name</Label>
                      <Input
                        id="name"
                        value={editedUser.name}
                        onChange={(e) => setEditedUser({ ...editedUser, name: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="about">About</Label>
                      <Textarea
                        id="about"
                        value={editedUser.about || ""}
                        onChange={(e) => setEditedUser({ ...editedUser, about: e.target.value })}
                        placeholder="Tell something about yourself..."
                        rows={3}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone</Label>
                      <Input
                        id="phone"
                        value={editedUser.phone || ""}
                        onChange={(e) => setEditedUser({ ...editedUser, phone: e.target.value })}
                        placeholder="+1 (555) 000-0000"
                      />
                    </div>
                    <div className="flex gap-2 pt-2">
                      <Button variant="outline" onClick={handleCancel} className="flex-1">
                        Cancel
                      </Button>
                      <Button onClick={handleSave} className="flex-1">
                        Save
                      </Button>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="space-y-1">
                      <p className="text-xs text-muted-foreground">Name</p>
                      <p className="font-medium">{editedUser.name}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-xs text-muted-foreground">About</p>
                      <p className="text-sm">{editedUser.about || "No about info"}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-xs text-muted-foreground">Email</p>
                      <p className="text-sm">{editedUser.email}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-xs text-muted-foreground">Phone</p>
                      <p className="text-sm">{editedUser.phone || "Not set"}</p>
                    </div>
                    <Button variant="outline" onClick={() => setIsEditing(true)} className="w-full">
                      Edit Profile
                    </Button>
                  </>
                )}
              </div>

              <Separator />

              {/* Settings List */}
              <div className="px-2">
                <p className="px-2 pb-2 text-xs font-medium text-muted-foreground">SETTINGS</p>
                {settingsItems.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setActiveSection(item.id)}
                    className="flex w-full items-center gap-3 rounded-lg px-3 py-3 text-left transition-colors hover:bg-secondary"
                  >
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                      <item.icon className="h-5 w-5 text-primary" />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium">{item.label}</p>
                      <p className="text-xs text-muted-foreground">{item.description}</p>
                    </div>
                    <ChevronRight className="h-5 w-5 text-muted-foreground" />
                  </button>
                ))}
              </div>

              <Separator />

              {/* Logout */}
              <div className="px-4 pb-4">
                <Button variant="destructive" onClick={onLogout} className="w-full">
                  <LogOut className="mr-2 h-4 w-4" />
                  Log Out
                </Button>
              </div>
            </div>
          )}

          {activeSection === "account" && (
            <div className="space-y-4 p-4">
              <div className="space-y-1">
                <p className="text-xs text-muted-foreground">Email Address</p>
                <p className="font-medium">{user.email}</p>
              </div>
              <Separator />
              <div className="space-y-3">
                <p className="text-sm font-medium">Account Actions</p>
                <Button variant="outline" className="w-full justify-start">
                  Change Password
                </Button>
                <Button variant="outline" className="w-full justify-start text-destructive hover:text-destructive">
                  Delete Account
                </Button>
              </div>
            </div>
          )}

          {activeSection === "privacy" && (
            <div className="space-y-4 p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Read Receipts</p>
                  <p className="text-xs text-muted-foreground">Show when you have read messages</p>
                </div>
                <Switch defaultChecked />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Last Seen</p>
                  <p className="text-xs text-muted-foreground">Show your online status</p>
                </div>
                <Switch defaultChecked />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Profile Photo</p>
                  <p className="text-xs text-muted-foreground">Who can see your profile photo</p>
                </div>
                <p className="text-sm text-muted-foreground">Everyone</p>
              </div>
            </div>
          )}

          {activeSection === "notifications" && (
            <div className="space-y-4 p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Message Notifications</p>
                  <p className="text-xs text-muted-foreground">Get notified for new messages</p>
                </div>
                <Switch defaultChecked />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Sound</p>
                  <p className="text-xs text-muted-foreground">Play sound for notifications</p>
                </div>
                <Switch defaultChecked />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Desktop Notifications</p>
                  <p className="text-xs text-muted-foreground">Show desktop alerts</p>
                </div>
                <Switch />
              </div>
            </div>
          )}

          {activeSection === "appearance" && (
            <div className="space-y-4 p-4">
              <p className="text-sm font-medium">Theme</p>
              <div className="space-y-2">
                <button
                  onClick={() => onThemeChange("light")}
                  className={cn(
                    "flex w-full items-center gap-3 rounded-lg border p-3 transition-colors",
                    theme === "light" ? "border-primary bg-primary/5" : "border-border hover:bg-secondary"
                  )}
                >
                  <Sun className="h-5 w-5" />
                  <span className="flex-1 text-left">Light</span>
                  {theme === "light" && <div className="h-2 w-2 rounded-full bg-primary" />}
                </button>
                <button
                  onClick={() => onThemeChange("dark")}
                  className={cn(
                    "flex w-full items-center gap-3 rounded-lg border p-3 transition-colors",
                    theme === "dark" ? "border-primary bg-primary/5" : "border-border hover:bg-secondary"
                  )}
                >
                  <Moon className="h-5 w-5" />
                  <span className="flex-1 text-left">Dark</span>
                  {theme === "dark" && <div className="h-2 w-2 rounded-full bg-primary" />}
                </button>
                <button
                  onClick={() => onThemeChange("system")}
                  className={cn(
                    "flex w-full items-center gap-3 rounded-lg border p-3 transition-colors",
                    theme === "system" ? "border-primary bg-primary/5" : "border-border hover:bg-secondary"
                  )}
                >
                  <Palette className="h-5 w-5" />
                  <span className="flex-1 text-left">System</span>
                  {theme === "system" && <div className="h-2 w-2 rounded-full bg-primary" />}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  )
}
