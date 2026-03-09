"use client"

import { useState, useEffect } from "react"
import { useTheme } from "next-themes"
import { type UserProfile } from "@/components/chat/user-profile-panel"

const defaultUser: UserProfile = {
  id: "user-1",
  name: "John Doe",
  email: "john.doe@email.com",
  avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face",
  about: "Hey there! I am using Chat App",
  phone: "+1 (555) 123-4567"
}

export function useUserProfile() {
  const { theme, setTheme } = useTheme()
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null)
  const [showUserProfile, setShowUserProfile] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchUser = async () => {
      const { createClient } = await import("@/lib/supabase/client")
      const supabase = createClient()
      
      const { data: { user } } = await supabase.auth.getUser()
      
      if (user) {
        setCurrentUser({
          id: user.id,
          name: user.user_metadata.full_name || user.email?.split("@")[0] || "User",
          email: user.email || "",
          avatar: user.user_metadata.avatar_url || "",
          about: user.user_metadata.about || "Hey there! I am using Chat App",
          phone: user.phone || ""
        })
      }
      setIsLoading(false)
    }

    fetchUser()
  }, [])

  const handleUpdateUser = async (user: UserProfile) => {
    setCurrentUser(user)
    // In a real app, you would also update the Supabase profile/metadata here
    const { createClient } = await import("@/lib/supabase/client")
    const supabase = createClient()
    await supabase.auth.updateUser({
      data: {
        full_name: user.name,
        avatar_url: user.avatar,
        about: user.about,
      }
    })
  }

  const handleThemeChange = (newTheme: "light" | "dark" | "system") => {
    setTheme(newTheme)
  }

  return {
    currentUser,
    isLoading,
    showUserProfile,
    setShowUserProfile,
    handleUpdateUser,
    handleThemeChange,
    theme: (theme as "light" | "dark" | "system") || "system",
  }
}
