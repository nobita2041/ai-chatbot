"use client"

import { memo } from "react"
import { cn } from "@/lib/utils"
import type { Message } from "@/types"

interface ChatMessageProps {
  message: Message
}

// React.memoで最適化（メッセージが変更されない限り再レンダリングしない）
export const ChatMessage = memo(function ChatMessage({ message }: ChatMessageProps) {
  const isUser = message.role === "user"

  return (
    <div
      className={cn(
        "flex w-full",
        isUser ? "justify-end" : "justify-start"
      )}
    >
      <div
        className={cn(
          "max-w-[80%] rounded-lg px-4 py-2",
          isUser
            ? "bg-primary text-primary-foreground"
            : "bg-muted text-foreground"
        )}
      >
        <p className="whitespace-pre-wrap break-words">{message.content}</p>
      </div>
    </div>
  )
})
