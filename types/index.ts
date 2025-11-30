export interface Message {
  id: string
  role: "user" | "assistant" | "system"
  content: string
}

// APIリクエスト用（IDなし）
export interface ChatRequestMessage {
  role: "user" | "assistant" | "system"
  content: string
}

export interface ChatRequest {
  messages: ChatRequestMessage[]
  systemPrompt?: string
}

export interface ChatResponse {
  message: Message
}

// ヘルスチェックレスポンス
export interface HealthCheckResponse {
  status: "ok" | "error"
  timestamp?: string
  details?: Record<string, unknown>
}

// エラーレスポンス
export interface ErrorResponse {
  error: string
  message?: string
  details?: string[]
}
