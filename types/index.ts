// 画像データの型定義
export interface ImageContent {
  type: "image"
  data: string // Base64エンコードされた画像データ
  mimeType: string // image/png, image/jpeg, etc.
}

// メッセージのコンテンツ型（テキストまたは画像を含む配列）
export type MessageContent =
  | string
  | Array<{ type: "text"; text: string } | { type: "image_url"; image_url: { url: string } }>

export interface Message {
  id: string
  role: "user" | "assistant" | "system"
  content: MessageContent
  images?: ImageContent[] // UIで画像を表示するための情報
}

// APIリクエスト用（IDなし）
export interface ChatRequestMessage {
  role: "user" | "assistant" | "system"
  content: MessageContent
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
