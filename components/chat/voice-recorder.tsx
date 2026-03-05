"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Mic, Square, Trash2, Send, Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"

interface VoiceRecorderProps {
  onSend: (blob: Blob) => void
  onCancel: () => void
}

export function VoiceRecorder({ onSend, onCancel }: VoiceRecorderProps) {
  const [isRecording, setIsRecording] = useState(false)
  const [recordingTime, setRecordingTime] = useState(0)
  const [isPaused, setIsPaused] = useState(false)
  
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const chunksRef = useRef<Blob[]>([])
  const timerRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    startRecording()
    return () => {
      if (timerRef.current) clearInterval(timerRef.current)
      if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
        mediaRecorderRef.current.stop()
      }
    }
  }, [])

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      const mediaRecorder = new MediaRecorder(stream)
      mediaRecorderRef.current = mediaRecorder
      chunksRef.current = []

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          chunksRef.current.push(e.data)
        }
      }

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(chunksRef.current, { type: 'audio/webm' })
        // We'll handle sending in the stop handler if requested
      }

      mediaRecorder.start()
      setIsRecording(true)
      
      timerRef.current = setInterval(() => {
        setRecordingTime(prev => prev + 1)
      }, 1000)
    } catch (err) {
      console.error("Error accessing microphone:", err)
      onCancel()
    }
  }

  const stopAndSend = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.onstop = () => {
        const audioBlob = new Blob(chunksRef.current, { type: 'audio/webm' })
        onSend(audioBlob)
      }
      mediaRecorderRef.current.stop()
      mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop())
    }
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  return (
    <div className="flex flex-1 items-center gap-3 rounded-2xl bg-primary/10 px-4 py-2 animate-in fade-in slide-in-from-bottom-2 duration-300">
      <div className="flex items-center gap-2 text-primary animate-pulse">
        <div className="h-2 w-2 rounded-full bg-red-500" />
        <span className="text-sm font-medium">{formatTime(recordingTime)}</span>
      </div>
      
      <div className="flex-1 text-center">
        <span className="text-xs text-muted-foreground">Recording audio...</span>
      </div>

      <div className="flex items-center gap-1">
        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={onCancel}
          className="h-8 w-8 rounded-full text-muted-foreground hover:bg-red-100 hover:text-red-600"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          size="icon"
          onClick={stopAndSend}
          className="h-10 w-10 rounded-full bg-primary hover:bg-primary/90"
        >
          <Send className="h-5 w-5" />
        </Button>
      </div>
    </div>
  )
}
