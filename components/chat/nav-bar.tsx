"use client"

import { cn } from "@/lib/utils"
import { MessageCircle, Users, User } from "lucide-react"
import { NavView } from "@/lib/types"

interface NavBarProps {
  activeView: NavView
  onViewChange: (view: NavView) => void
  onProfileClick: () => void
}

export function NavBar({ activeView, onViewChange, onProfileClick }: NavBarProps) {
  return (
    <>
      {/* Desktop: Vertical bar on left */}
      <div className="hidden h-full w-16 flex-col items-center border-r border-border bg-card py-4 md:flex">
        <div className="flex flex-1 flex-col items-center gap-2">
          <NavButton
            icon={<MessageCircle className="h-5 w-5" />}
            label="DMs"
            active={activeView === "dm"}
            onClick={() => onViewChange("dm")}
          />
          <NavButton
            icon={<Users className="h-5 w-5" />}
            label="Groups"
            active={activeView === "groups"}
            onClick={() => onViewChange("groups")}
          />
        </div>
        <div className="mt-auto">
          <NavButton
            icon={<User className="h-5 w-5" />}
            label="Profile"
            onClick={onProfileClick}
          />
        </div>
      </div>

      {/* Mobile: Horizontal bar at bottom */}
      <div className="fixed inset-x-0 bottom-0 z-40 flex h-16 items-center justify-around border-t border-border bg-card/80 backdrop-blur-md md:hidden pb-safe">
        <NavButton
          icon={<MessageCircle className="h-5 w-5" />}
          label="DMs"
          active={activeView === "dm"}
          onClick={() => onViewChange("dm")}
          mobile
        />
        <NavButton
          icon={<Users className="h-5 w-5" />}
          label="Groups"
          active={activeView === "groups"}
          onClick={() => onViewChange("groups")}
          mobile
        />
        <NavButton
          icon={<User className="h-5 w-5" />}
          label="Profile"
          onClick={onProfileClick}
          mobile
        />
      </div>
    </>
  )
}

interface NavButtonProps {
  icon: React.ReactNode
  label: string
  active?: boolean
  onClick: () => void
  mobile?: boolean
}

function NavButton({ icon, label, active, onClick, mobile }: NavButtonProps) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "flex flex-col items-center justify-center gap-1 rounded-xl transition-colors",
        mobile ? "h-14 w-16" : "h-12 w-12",
        active
          ? "bg-primary/10 text-primary"
          : "text-muted-foreground hover:bg-secondary hover:text-foreground"
      )}
    >
      {icon}
      <span className="text-[10px] font-medium">{label}</span>
    </button>
  )
}
