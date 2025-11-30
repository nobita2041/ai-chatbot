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

  // contentが文字列の場合と配列の場合に対応
  const textContent = typeof message.content === "string"
    ? message.content
    : message.content.find(item => item.type === "text")?.text || ""

  return (
    <div
      className={cn(
        "flex w-full",
        isUser ? "justify-end" : "justify-start"
      )}
    >
      <div
        className={cn(
          "max-w-[80%] rounded-lg px-4 py-2 space-y-2",
          isUser
            ? "bg-primary text-primary-foreground"
            : "bg-muted text-foreground"
        )}
      >
        {/* 画像表示（ユーザーメッセージのみ） */}
        {message.images && message.images.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {message.images.map((image, index) => (
              <img
                key={index}
                src={`data:${image.mimeType};base64,${image.data}`}
                alt={`Attached image ${index + 1}`}
                className="max-w-full max-h-60 rounded-lg object-contain"
              />
            ))}
          </div>
        )}

        {/* テキスト表示 */}
        {textContent && (
          <p className="whitespace-pre-wrap break-words">{textContent}</p>
        )}
      </div>
    </div>
  )
})
