"use client"

import { useState, useRef, useEffect, useCallback } from "react"
import { ScrollArea } from "@/components/ui/scroll-area"
import { ChatMessage } from "./chat-message"
import { ChatInput } from "./chat-input"
import { SystemPromptEditor } from "./system-prompt-editor"
import type { Message, ChatRequestMessage, ImageContent } from "@/types"
import { DEFAULT_SYSTEM_PROMPT } from "@/lib/constants"
import { generateId } from "@/lib/utils"

// リクエストタイムアウト（30秒）
const REQUEST_TIMEOUT_MS = 30000

// 最大メッセージ数（メモリ管理）
const MAX_MESSAGES = 100

// エラーメッセージの定義
const ERROR_MESSAGES: Record<string, string> = {
  TIMEOUT: "リクエストがタイムアウトしました。もう一度お試しください。",
  RATE_LIMIT: "リクエストが多すぎます。しばらく待ってから再試行してください。",
  SERVER_ERROR: "サーバーエラーが発生しました。しばらく待ってから再試行してください。",
  NETWORK_ERROR: "ネットワークエラーが発生しました。接続を確認してください。",
  VALIDATION_ERROR: "入力内容に問題があります。内容を確認してください。",
  UNKNOWN_ERROR: "エラーが発生しました。もう一度お試しください。",
}

// HTTPステータスコードに基づくエラーメッセージ取得
function getErrorMessage(status: number): string {
  switch (status) {
    case 400:
      return ERROR_MESSAGES.VALIDATION_ERROR
    case 429:
      return ERROR_MESSAGES.RATE_LIMIT
    case 500:
    case 502:
    case 503:
    case 504:
      return ERROR_MESSAGES.SERVER_ERROR
    default:
      return ERROR_MESSAGES.UNKNOWN_ERROR
  }
}

export function ChatContainer() {
  const [messages, setMessages] = useState<Message[]>([])
  const [systemPrompt, setSystemPrompt] = useState(DEFAULT_SYSTEM_PROMPT)
  const [isLoading, setIsLoading] = useState(false)
  const [streamingContent, setStreamingContent] = useState("")
  const scrollRef = useRef<HTMLDivElement>(null)
  const abortControllerRef = useRef<AbortController | null>(null)

  // Auto scroll to bottom when new messages arrive
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [messages, streamingContent])

  // コンポーネントアンマウント時にリクエストをキャンセル
  useEffect(() => {
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort()
      }
    }
  }, [])

  const handleSend = useCallback(async (content: string, images?: ImageContent[]) => {
    // 既存のリクエストをキャンセル
    if (abortControllerRef.current) {
      abortControllerRef.current.abort()
    }

    // 新しいAbortControllerを作成
    const abortController = new AbortController()
    abortControllerRef.current = abortController

    // タイムアウト設定
    const timeoutId = setTimeout(() => {
      abortController.abort()
    }, REQUEST_TIMEOUT_MS)

    // 画像がある場合はcontentを配列形式に変換
    let messageContent: Message["content"]
    if (images && images.length > 0) {
      messageContent = [
        ...(content ? [{ type: "text" as const, text: content }] : []),
        ...images.map((img) => ({
          type: "image_url" as const,
          image_url: {
            url: `data:${img.mimeType};base64,${img.data}`,
          },
        })),
      ]
    } else {
      messageContent = content
    }

    const userMessage: Message = {
      id: generateId(),
      role: "user",
      content: messageContent,
      images, // UI表示用
    }

    // メッセージ追加（最大数を超えたら古いメッセージを削除）
    setMessages((prev) => {
      const newMessages = [...prev, userMessage]
      if (newMessages.length > MAX_MESSAGES) {
        return newMessages.slice(-MAX_MESSAGES)
      }
      return newMessages
    })
    setIsLoading(true)
    setStreamingContent("")

    // APIリクエスト用にIDとimagesを除外したメッセージを作成
    const requestMessages: ChatRequestMessage[] = [...messages, userMessage].map(
      ({ role, content }) => ({ role, content })
    )

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messages: requestMessages,
          systemPrompt,
        }),
        signal: abortController.signal,
      })

      clearTimeout(timeoutId)

      if (!response.ok) {
        const errorMsg = getErrorMessage(response.status)
        throw new Error(errorMsg)
      }

      const reader = response.body?.getReader()
      if (!reader) {
        throw new Error(ERROR_MESSAGES.UNKNOWN_ERROR)
      }

      const decoder = new TextDecoder()
      let fullContent = ""

      while (true) {
        const { done, value } = await reader.read()
        if (done) break

        const chunk = decoder.decode(value, { stream: true })
        fullContent += chunk
        setStreamingContent(fullContent)
      }

      // Add the complete assistant message
      const assistantMessage: Message = {
        id: generateId(),
        role: "assistant",
        content: fullContent,
      }
      setMessages((prev) => {
        const newMessages = [...prev, assistantMessage]
        if (newMessages.length > MAX_MESSAGES) {
          return newMessages.slice(-MAX_MESSAGES)
        }
        return newMessages
      })
      setStreamingContent("")
    } catch (error: unknown) {
      clearTimeout(timeoutId)

      // キャンセルされた場合は何もしない（ユーザーによるキャンセルまたはアンマウント）
      if (error instanceof Error && error.name === "AbortError") {
        // タイムアウトの場合のみエラーメッセージを表示
        if (!abortController.signal.aborted) return
        const errorMessage: Message = {
          id: generateId(),
          role: "assistant",
          content: ERROR_MESSAGES.TIMEOUT,
        }
        setMessages((prev) => [...prev, errorMessage])
        return
      }

      // ネットワークエラーの判定
      let errorContent = ERROR_MESSAGES.UNKNOWN_ERROR
      if (error instanceof TypeError && error.message.includes("fetch")) {
        errorContent = ERROR_MESSAGES.NETWORK_ERROR
      } else if (error instanceof Error) {
        errorContent = error.message
      }

      const errorMessage: Message = {
        id: generateId(),
        role: "assistant",
        content: errorContent,
      }
      setMessages((prev) => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
      abortControllerRef.current = null
    }
  }, [messages, systemPrompt])

  const handleClearChat = () => {
    setMessages([])
    setStreamingContent("")
  }

  return (
    <div className="flex flex-col h-screen max-w-4xl mx-auto p-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold">AI Chatbot</h1>
        <button
          onClick={handleClearChat}
          className="text-sm text-muted-foreground hover:text-foreground"
        >
          チャットをクリア
        </button>
      </div>

      {/* System Prompt Editor */}
      <div className="mb-4">
        <SystemPromptEditor value={systemPrompt} onChange={setSystemPrompt} />
      </div>

      {/* Chat Messages */}
      <ScrollArea className="flex-1 pr-4" ref={scrollRef}>
        <div className="space-y-4 pb-4">
          {messages.length === 0 && !streamingContent && (
            <div className="text-center text-muted-foreground py-8">
              メッセージを入力して会話を始めましょう
            </div>
          )}
          {messages.map((message) => (
            <ChatMessage key={message.id} message={message} />
          ))}
          {streamingContent && (
            <ChatMessage
              message={{ id: "streaming", role: "assistant", content: streamingContent }}
            />
          )}
          {isLoading && !streamingContent && (
            <div className="flex justify-start">
              <div className="bg-muted rounded-lg px-4 py-2">
                <span className="animate-pulse">考え中...</span>
              </div>
            </div>
          )}
        </div>
      </ScrollArea>

      {/* Input */}
      <div className="mt-4 pt-4 border-t">
        <ChatInput onSend={handleSend} disabled={isLoading} />
      </div>
    </div>
  )
}
