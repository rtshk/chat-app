"use client"

import { useState } from "react"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Smile } from "lucide-react"
import { cn } from "@/lib/utils"

const EMOJI_CATEGORIES = [
  {
    name: "Smileys",
    emojis: ["😀", "😃", "😄", "😁", "😅", "😂", "🤣", "😊", "😇", "🙂", "😉", "😌", "😍", "🥰", "😘", "😗", "😙", "😚", "😋", "😛", "😜", "🤪", "😝", "🤗", "🤭", "🤫", "🤔", "🤐", "🤨", "😐", "😑", "😶", "😏", "😒", "🙄", "😬", "😮‍💨", "🤥", "😌", "😔"]
  },
  {
    name: "Gestures",
    emojis: ["👋", "🤚", "🖐️", "✋", "🖖", "👌", "🤌", "🤏", "✌️", "🤞", "🤟", "🤘", "🤙", "👈", "👉", "👆", "🖕", "👇", "☝️", "👍", "👎", "✊", "👊", "🤛", "🤜", "👏", "🙌", "👐", "🤲", "🤝", "🙏"]
  },
  {
    name: "Hearts",
    emojis: ["❤️", "🧡", "💛", "💚", "💙", "💜", "🖤", "🤍", "🤎", "💔", "❣️", "💕", "💞", "💓", "💗", "💖", "💘", "💝", "💟", "♥️"]
  },
  {
    name: "Objects",
    emojis: ["💼", "📁", "📂", "🗂️", "📅", "📆", "🗒️", "🗓️", "📇", "📈", "📉", "📊", "📋", "📌", "📍", "📎", "🖇️", "📏", "📐", "✂️", "🗃️", "🗄️", "🗑️", "🔒", "🔓", "🔑", "🗝️", "🔨", "⚒️", "🛠️"]
  },
  {
    name: "Symbols",
    emojis: ["✅", "❌", "❓", "❔", "❗", "❕", "⭕", "🔴", "🟠", "🟡", "🟢", "🔵", "🟣", "⚫", "⚪", "🟤", "🔶", "🔷", "🔸", "🔹", "🔺", "🔻", "💠", "🔘", "🔳", "🔲"]
  }
]

interface EmojiPickerProps {
  onEmojiSelect: (emoji: string) => void
}

export function EmojiPicker({ onEmojiSelect }: EmojiPickerProps) {
  const [open, setOpen] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState(0)

  const handleSelect = (emoji: string) => {
    onEmojiSelect(emoji)
    setOpen(false)
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          type="button"
          className="mb-0.5 ml-2 rounded-full p-1.5 text-muted-foreground transition-colors hover:bg-background hover:text-card-foreground"
        >
          <Smile className="h-5 w-5" />
        </button>
      </PopoverTrigger>
      <PopoverContent 
        className="w-80 p-0" 
        align="end"
        side="top"
        sideOffset={8}
      >
        <div className="flex flex-col">
          {/* Category tabs */}
          <div className="flex gap-1 border-b border-border p-2">
            {EMOJI_CATEGORIES.map((category, index) => (
              <button
                key={category.name}
                onClick={() => setSelectedCategory(index)}
                className={cn(
                  "rounded-md px-2 py-1 text-xs font-medium transition-colors",
                  selectedCategory === index
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                )}
              >
                {category.name}
              </button>
            ))}
          </div>
          
          {/* Emoji grid */}
          <div className="custom-scrollbar grid max-h-48 grid-cols-8 gap-1 overflow-y-auto p-2">
            {EMOJI_CATEGORIES[selectedCategory].emojis.map((emoji, index) => (
              <button
                key={`${emoji}-${index}`}
                onClick={() => handleSelect(emoji)}
                className="flex h-8 w-8 items-center justify-center rounded-md text-lg transition-colors hover:bg-secondary"
              >
                {emoji}
              </button>
            ))}
          </div>
        </div>
      </PopoverContent>
    </Popover>
  )
}
